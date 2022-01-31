define([ './Control', './Label' ], function(Control, Label) {
	"use strict";

	/*
	 * ------------- TABLE CLASS --------------
	 */
	// , headerBuilder, contentBuilder, footerBuilder
	function Table(context, path, template, parameters) {
		Control.call(this, context, path, template);

		this.header = parameters.headerBuilder(this);
		this.fields = this.header.fields;

		this.content = parameters.contentBuilder(this);

		if (parameters.footerBuilder) {
			this.footer = parameters.footerBuilder(this);
		};

		parameters = parameters || {};

		if (parameters.text) {
			this.label = new Label(this.context, path + '-label', parameters.text);
		}

		this._adjustTemplate_();
		this._setVisibility_();

		this.element.on({
			keydown : function(event) {
				if ([ 65 ].includes(event.which)) {
					if (event.ctrlKey) {
						event.preventDefault();
						event.stopPropagation();
						this.header.handle.send('handle:mousedown', event);
					}
				}
			}.bind(this)
		});
	}
	Table.prototype = Object.create(Control.prototype);
	Table.prototype.constructor = Table;

	Table.prototype._adjustTemplate_ = function(section) {

		var resize = function(section) {
			var wrapper = $('<div>').css({
				'flex' : '1 1 100%'
			}).attr({
				'name' : 'wrapper'
			}).append(section.element.contents());

			section.element.empty().append(wrapper);

			var ruler = $('<div>').appendTo(this.content.element), placeholderWidth = section.element.innerWidth() - ruler.innerWidth();

			var placeholder = this.header.handle.element.clone().css({
				'cursor' : 'default',
				'display' : '',
				'box-sizing' : 'content-box',
				'padding' : '0px',
				'border-right' : 'none',
				'flex' : '0 0 ' + placeholderWidth + 'px'
			}).attr({
				'name' : 'placeholder'
			}).html('').appendTo(section.element);

			this.header.placeholder = new Control(this.header, 'placeholder');

			ruler.remove();
		}.bind(this);

		if (this.content.element.css('overflow-y') === 'scroll') {
			this.header.element.css({
				'display' : 'flex'
			});

			if (this.footer) {
				this.footer.element.css({
					'display' : 'flex'
				});
			}

			resize(this.header);
			if (this.footer) {
				resize(this.footer);
			}
		} else {
			var tableWrapper = this.element.wrap('<div>').parent().css({
				'border-top' : this.element.css('border-top'),
				'border-right' : this.element.css('border-right'),
				'border-bottom' : this.element.css('border-bottom'),
				'border-left' : this.element.css('border-left')
			});
			this.element.css({
				'margin-right' : '-' + this.element.css('border-right-width'),
				'margin-bottom' : '-' + this.element.css('border-bottom-width'),
				'border' : 'none'
			});
		}
	}

	Table.prototype._setVisibility_ = function() {
		var fields = this.fields.filter(function(item) {
			return item.isInvisible;
		});
		this.header.setInvisible(fields);

		var fieldNames = fields.map(function(item) {
			return item.name;
		});

		this.content.forEach(function(entry) {
			entry.setInvisible(fieldNames);
		});

		if (this.footer) {
			this.footer.forEach(function(entry) {
				entry.setInvisible(fieldNames);
			});
		}

		return this;
	}

	Table.prototype.on = function(control, eventType, data) {
		if ([ 'control:focusin' ].includes(eventType) && (control === this.content)) {
			this.send(eventType, data).content.focus();
			return false;
		}
		if ([ 'control:tabulate' ].includes(eventType) && (control.context === this)) {
			this.send(eventType, data);
			return false;
		}
		if ([ 'control:changed' ].includes(eventType) && (control.context === this)) {
			this.send(eventType, data);
			return false;
		}
		if ([ 'control:refresh' ].includes(eventType) && (control === this.content)) {
			if (this.footer) {
				this.footer.collection.forEach(function(item) {
					item.fillContent(item.attributes);
				});
			}
			return false;
		}
	}

	Table.prototype.setVisibility = function(flag) {
		this.label ? this.label.setVisibility(flag) : null;
		return Control.prototype.setVisibility.call(this, flag);
	}

	Table.prototype.setActiveStatus = function(status) {
		this.element.toggleClass('control-active', [ 'active' ].includes(status));
		this.selection.setActiveStatus(status);

		return Control.prototype.setActiveStatus.call(this, status);
	}

	Table.prototype.getDefaultActiveElement = function() {
		return this.content;
	}

	Table.prototype.setInvisible = function(fieldNames) {
		this.fields.forEach(function(item) {
			item.isInvisible = fieldNames.includes(item.name);
		});
		this._setVisibility_();

		if (this.getContent().activeElement) {
			this.focus(this.getContent().activeElement.getDefaultActiveElement());
		}

		return this;
	}

	Table.prototype.getField = function(name) {
		return this.fields.find(function(item) {
			return (item.name === name);
		});
	}

	Table.prototype.getContent = function() {
		return this.content;
	}

	Table.prototype.getData = function() {
		return this.content.getData();
	}

	Table.prototype.getFullData = function() {
		return this.content.getFullData();
	}

	return Table;
});