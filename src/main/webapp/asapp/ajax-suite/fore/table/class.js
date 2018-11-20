define([ 'core/Table' ], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC TABLE CLASS --------------
	 */
	function Table(context, name, template, headerBuilder, contentBuilder, footerBuilder) {
		Class.call(this, context, name, template, headerBuilder, contentBuilder, footerBuilder);

		this.element.on({
			keydown : function(event) {
				if ([ 67 ].includes(event.which)) {
					if (event.altKey && !event.shiftKey) {
						event.preventDefault();
						event.stopPropagation();
						this.copyData();
					}
					if (event.altKey && event.shiftKey) {
						event.preventDefault();
						event.stopPropagation();
						this.copyTable();
					}
				}
			}.bind(this),
			paste : function(event) {
				event.preventDefault();
				event.stopPropagation();
				this.paste(event.originalEvent.clipboardData.getData('text'));
			}.bind(this)
		});
	}
	Table.prototype = Object.create(Class.prototype);
	Table.prototype.constructor = Table;

	Table.prototype.on = function(control, eventType, data) {
		if ([ 'contextmenu:execute' ].includes(eventType)) {
			this[data]();
		}

		return Class.prototype.on.call(this, control, eventType, data);
	}

	Table.prototype.setActiveStatus = function(state) {
		this.element.toggleClass('control-active', [ 'active' ].includes(state));
		[ 'active' ].includes(state) ? this.select() : this.deselect();

		return Class.prototype.setActiveStatus.call(this, state);
	}

	Table.prototype.select = function() {
		this.selection.forEach(function(row, rowIndex) {
			row.forEach(function(item, index) {
				item.element.addClass('table-cell-selected').css({
					'z-index' : 99
				});

				var borderColor = item.element.css('border-top-color');
				var left = 'inset 0.5px 0px 0px 0px ' + borderColor;
				var right = 'inset -0.5px 0px 0px 0px ' + borderColor;
				var top = 'inset 0px 0.5px 0px 0px ' + borderColor;
				var bottom = 'inset 0px -0.5px 0px 0px ' + borderColor;

				var boxShadow = '';
				if (index === 0) {
					boxShadow = (boxShadow) ? boxShadow + ', ' + left : left;
				}
				if (index === (row.length - 1)) {
					boxShadow = (boxShadow) ? boxShadow + ', ' + right : right;
				}
				if (rowIndex === 0) {
					boxShadow = (boxShadow) ? boxShadow + ', ' + top : top;
				}
				if (rowIndex === (this.selection.length - 1)) {
					boxShadow = (boxShadow) ? boxShadow + ', ' + bottom : bottom;
				}

				item.element.css({
					'box-shadow' : boxShadow
				});
			}.bind(this));

		}.bind(this));

		return Class.prototype.select.call(this);
	}

	Table.prototype.deselect = function() {
		this.selection.forEach(function(row, rowIndex) {
			row.forEach(function(item, index) {
				item.element.removeClass('table-cell-selected').css({
					'z-index' : '',
					'box-shadow' : 'none'
				});
			}.bind(this));
		}.bind(this));

		return Class.prototype.deselect.call(this);
	}

	Table.prototype.execute = function(callback) {
		this.content.execute.call(this, callback);
		return this;
	}

	Table.prototype.toClipboard = function(data) {
		var textarea = $('<textarea>').css({
			'position' : 'fixed',
			'opacity' : '0'
		});

		textarea.prependTo('body').html(data).focus().select();
		document.execCommand('copy');
		this.focus();
		textarea.remove();
	}

	Table.prototype.copyData = function() {

		function parse(fields, entry, target) {
			fields.forEach(function(item) {
				var control = entry.controls[item.name], formattedValue = control.formatter(control.getValue()) || '';
				var value = (item.msoFormatter() != '@') ? formattedValue.replace(/\s/g, '') : formattedValue;
				target = target.concat(value).concat(String.fromCharCode(9));
			});

			return target;
		}

		var text = '';

		var fields = this.selectFields.filter(function(item) {
			return item.isVisible();
		});

		this.selectCollection.forEach(function(item) {
			text = parse(fields, item, text).replace(/.$/, String.fromCharCode(13));
		}.bind(this));

		this.toClipboard(text);
	}

	Table.prototype.copyTable = function() {

		function parse(fields, entry, target) {
			fields.forEach(function(item) {
				var style = 'mso-number-format:\'' + item.msoFormatter() + '\';';
				style += 'border: .5pt solid #888';

				var control = entry.controls[item.name], formattedValue = control.formatter(control.getValue()) || '';
				var value = (item.msoFormatter() != '@') ? formattedValue.replace(/\s/g, '') : formattedValue;
				var td = $('<td style= "' + style + '"></td>').appendTo(target).html(value);
			});

			return target;
		};

		var table = $('<table>').css({
			'white-space' : 'nowrap'
		});

		var fields = this.selectFields.filter(function(item) {
			return item.isVisible();
		});

		var header = $('<tr>').css({
			'background' : '#ccc',
			'text-align' : 'center'
		}).appendTo(table);

		var style = 'border: .5pt solid #888';
		fields.forEach(function(item) {
			var td = $('<td style= "' + style + '"></td>').html(item.getValue()).appendTo(header);
		});

		this.selectCollection.forEach(function(item) {
			parse(fields, item, $('<tr>').appendTo(table));
		}.bind(this));

		this.toClipboard(table.prop('outerHTML'));
	}

	Table.prototype.paste = function(data) {

		var parse = function(fields, entry, data) {
			if (data) {
				fields.forEach(function(item, index) {
					if (entry.tabLoop.includes(entry.controls[item.name])) {
						var control = entry.controls[item.name], formattedValue = control.formatter(data[index]) || '';
						control.setValue(formattedValue).send('control:changed');
					};
				});
				entry.submit(function(entry) {
					if (this.content.dao) {
						this.content.dao.edit(entry.attributes, this.parameters).execute(function(response) {
							entry.setContent(response[0]);
						}.bind(this));
					}
				}.bind(this));
			}
		}.bind(this);

		var table = data.replace(/\n$/, '').split(/\n/).map(function(item) {
			return item.split(/\t/);
		});

		this.selectCollection.forEach(function(item, index) {
			parse(this.selectFields, item, table[index]);
		}.bind(this));
	}

	return Table;
});