define([], function() {
	"use strict";

	/*
	 * ------------- UTILITIES --------------
	 */
	function cutout(array, first, last) {
		var result = [];

		var firstItemId = array.indexOf(first), lastItemId = array.indexOf(last);
		var firstIndex = (firstItemId < lastItemId) ? firstItemId : lastItemId;
		var lastIndex = (firstItemId < lastItemId) ? lastItemId : firstItemId;
		for (var i = firstIndex; i <= lastIndex; i++) {
			result.push(array[i]);
		}

		return result;
	}

	/*
	 * ------------- TABLE SELECTION CLASS --------------
	 */
	function Selection(context) {
		this.context = context;

		this.rows = [];
		this.columns = [];
		this.entries = [];
		this.fields = [];
	}

	Selection.prototype.setActiveStatus = function(status) {
		this.entries.forEach(function(entry, rowIndex) {
			entry.setSelectedStatus(this.fields, [ 'active' ].includes(status));
		}.bind(this));
	}

	Selection.prototype.create = function(initControl, currentControl) {
		this.destroy();

		var isWholeRow = false, isWholeColumn = false;

		if (initControl && currentControl) {
			var header = this.context.header, footers = this.context.footer ? this.context.footer.collection : [];

			var fields = this.context.header.fields;
			var entries = [];
			this.context.content.forEach(function(item) {
				entries.push(item);
			});

			if (fields.includes(initControl)) {
				this.columns = cutout(fields, initControl, currentControl);
				isWholeRow = (this.columns.length === fields.length);
				this.rows = entries;
				isWholeColumn = true;
			} else {
				this.rows = cutout(entries, initControl, currentControl);
				isWholeColumn = (this.rows.length === entries.length);
				this.columns = fields;
				isWholeRow = true;
			}
		}

		this.entries = (isWholeColumn ? [ header ] : []).concat(this.rows).concat(isWholeColumn ? footers : []);
		this.fields = (isWholeRow ? [ header.handle ] : []).concat(this.columns);

		this.entries.forEach(function(entry, rowIndex) {
			this.fields.forEach(function(field, index) {
				var item = [ 'handle' ].includes(field.name) ? entry.handle : ((entry === header) ? field : entry.controls[field.name]);

				var borderColor = item.element.css('border-bottom-color');
				var left = 'inset 1px 0px 0px 0px ' + borderColor;
				var right = 'inset -1px 0px 0px 0px ' + borderColor;
				var top = 'inset 0px 1px 0px 0px ' + borderColor;
				var bottom = 'inset 0px -1px 0px 0px ' + borderColor;

				var boxShadow = '';
				if (index === 0) {
					boxShadow = (boxShadow) ? boxShadow + ', ' + left : left;
				}
				if (index === (this.fields.length - 1)) {
					boxShadow = (boxShadow) ? boxShadow + ', ' + right : right;
				}
				if (rowIndex === 0) {
					boxShadow = (boxShadow) ? boxShadow + ', ' + top : top;
				}
				if (rowIndex === (this.entries.length - 1)) {
					boxShadow = (boxShadow) ? boxShadow + ', ' + bottom : bottom;
				}

				item.element.css({
					'box-shadow' : boxShadow
				});
			}.bind(this));

			entry.setSelectedStatus(this.fields, true);
		}.bind(this));

		return this;
	}

	Selection.prototype.destroy = function() {
		var header = this.context.header;

		this.entries.forEach(function(entry, rowIndex) {
			this.fields.forEach(function(field, index) {
				var item = [ 'handle' ].includes(field.name) ? entry.handle : ((entry === header) ? field : entry.controls[field.name]);

				item.element.css({
					'box-shadow' : ''
				});
			}.bind(this));

			entry.setSelectedStatus(this.fields, false);
		}.bind(this));

		this.rows = [];
		this.columns = [];
		this.entries = [];
		this.fields = [];

		return this;
	}

	Selection.prototype.toClipboard = function(data) {
		var textarea = $('<textarea>').css({
			'position' : 'fixed',
			'opacity' : '0'
		});

		textarea.prependTo('body').html(data).select();
		document.execCommand('copy');
		this.context.focus();
		textarea.remove();
	}

	Selection.prototype.copyData = function() {

		function parse(fields, entry, target) {
			fields.forEach(function(item) {
				var control = entry.controls[item.name], msoValue = item.msoFormatter(control.getValue());
				target = target.concat(msoValue.value || '').concat(String.fromCharCode(9));
			});

			return target;
		}

		var text = '';

		var fields = this.columns.filter(function(item) {
			return item.isVisible();
		});

		this.rows.forEach(function(item) {
			text = parse(fields, item, text).replace(/.$/, String.fromCharCode(13));
		}.bind(this));

		this.toClipboard(text);
	}

	Selection.prototype.copyTable = function() {
		var footers = this.context.footer ? this.context.footer.collection : [];

		function parse(fields, entry, target) {
			fields.forEach(function(item) {
				var control = entry.controls[item.name], msoValue = item.msoFormatter(control.getValue());

				var style = 'mso-number-format:\'' + msoValue.format + '\';';
				style += 'border: .5pt solid #888';

				var td = $('<td style= "' + style + '"></td>').appendTo(target).html(msoValue.value || '');
			});

			return target;
		};

		var table = $('<table>').css({
			'white-space' : 'nowrap'
		});

		var fields = this.columns.filter(function(item) {
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

		this.rows.forEach(function(item) {
			parse(fields, item, $('<tr>').appendTo(table));
		});

		if (this.entries.length > this.rows.length) {
			footers.forEach(function(item) {
				var tr = $('<tr>').css({
					'font-weight' : 'bold'
				});

				parse(fields, item, tr.appendTo(table));
			});
		}

		this.toClipboard(table.prop('outerHTML'));
	}

	// Selection.prototype.paste = function(data) {
	//
	// var parse = function(fields, entry, data) {
	// if (data) {
	// fields.forEach(function(item, index) {
	// if (entry.tabLoop.includes(entry.controls[item.name])) {
	// var control = entry.controls[item.name], formattedValue = control.formatter(data[index], control) || '';
	// control.setValue(formattedValue).send('control:changed');
	// };
	// });
	// entry.submit(function(self) {
	// if (this.content.dao && this.content.dao.edit) {
	// this.content.dao.edit(self.attributes, this.parameters).execute(function(response) {
	// self.setContent(response[0]);
	// }.bind(this));
	// }
	// }.bind(this));
	// }
	// }.bind(this);
	//
	// var table = data.replace(/\n$/, '').split(/\n/).map(function(item) {
	// return item.split(/\t/);
	// });
	//
	// this.rows.forEach(function(item, index) {
	// parse(this.columns, item, table[index]);
	// }.bind(this));
	// }

	return Selection;
});