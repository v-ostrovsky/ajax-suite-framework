define([ './Control' ], function(Control) {
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
	 * ------------- TABLE CLASS --------------
	 */
	function Table(context, name, template, headerBuilder, contentBuilder, footerBuilder) {
		Control.call(this, context, name, template);

		this.header = headerBuilder(this);
		this.fields = this.header.fields;

		if (footerBuilder) {
			this.footer = footerBuilder(this);
		};

		this.content = contentBuilder(this);

		this._adjustTemplate_();
		this._setVisibility_();

		this.selectCollection = [];
		this.selectFields = [];
		this.selection = [];

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
				'flex' : '1 1 100%',
				'display' : 'flex'
			}).append(section.element.contents());

			section.element.empty().append(wrapper);

			var ruler = $('<div>').appendTo(this.content.element), placeHolderWidth = section.element.innerWidth() - ruler.innerWidth();
			this.header.handle.element.clone().html('').css({
				'padding' : '0px',
				'border-right' : 'none',
				'flex' : '0 0 ' + placeHolderWidth + 'px'
			}).appendTo(section.element);
			ruler.remove();
		}.bind(this);

		this.header.element.css({
			'display' : 'flex'
		});

		if (this.footer) {
			this.footer.element.css({
				'display' : 'flex'
			});
		}

		if (this.content.element.css('overflow-y') === 'scroll') {
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

		Table.prototype.getData = function() {
			return this.content.getData();
		}
	}

	Table.prototype._getAllRows_ = function() {
		var collection = [];
		this.content.forEach(function(item) {
			collection.push(item);
		});

		return collection;
	}

	Table.prototype._setSelection_ = function(initControl, currentControl) {
		this.deselect();
		this.selectCollection = [];
		this.selectFields = [];
		this.selection = [];

		var collection = this._getAllRows_();
		if (collection.length && initControl && currentControl) {
			var isWholeRow = false, isWholeColumn = false;
			if (initControl.context === this.header) {
				this.selectCollection = collection;
				this.selectFields = cutout(this.fields, initControl, currentControl);
				isWholeColumn = true;
				isWholeRow = (this.selectFields.length && (this.selectFields.length === this.fields.length)) ? true : false;
			} else {
				this.selectCollection = cutout(collection, initControl, currentControl);
				this.selectFields = this.fields;
				isWholeRow = true;
				isWholeColumn = (this.selectCollection.length && (this.selectCollection.length === collection.length)) ? true : false;
			}

			var rows = (isWholeColumn ? [ this.header ] : []).concat(this.selectCollection).concat((isWholeColumn && this.footer) ? [ this.footer ] : []);
			this.selection = rows.map(function(row) {
				var selectedColumns = isWholeRow ? [ row.handle ] : [];
				return selectedColumns.concat(this.selectFields.map(function(item) {
					return (row === this.header) ? item : row.controls[item.name];
				}.bind(this)));
			}.bind(this));

			this.select();
		}
	}

	Table.prototype._onUpDown_ = function(control, event) {
		var updown = (event.which === 38) ? -1 : 1;
		this.initControl = this.content.activeElement;
		var index = (control.itemId > this.selectCollection[0].itemId) ? 0 : this.selectCollection.length - 1;
		this.currentControl = this.content.nextEntry(this.selectCollection[index], updown);
		this._setSelection_(this.initControl, this.currentControl);
	}

	Table.prototype._onMoveOverRows_ = function(event) {
		var top = this.currentControl.element.offset().top;
		var bottom = top + this.currentControl.element.outerHeight();

		if (event.pageY < top) {
			var nextEntry = this.content.nextEntry(this.currentControl, -1);
			if (nextEntry.itemId < this.currentControl.itemId) {
				this.currentControl = nextEntry;
				this._setSelection_(this.initControl, this.currentControl);
			}
		}

		if (event.pageY > bottom) {
			var nextEntry = this.content.nextEntry(this.currentControl, 1);
			if (nextEntry.itemId > this.currentControl.itemId) {
				this.currentControl = nextEntry;
				this._setSelection_(this.initControl, this.currentControl);
			}
		}
	}

	Table.prototype._onMoveOverColumns_ = function(event) {
		var left = this.currentControl.element.offset().left;
		var right = left + this.currentControl.element.outerWidth();

		if (event.pageX < left) {
			var nextField = this.fields[this.currentControl.itemId - 1];
			if (nextField) {
				while (!nextField.element.offset().left) {
					nextField = this.fields[nextField.itemId - 1];
				}
				this.currentControl = nextField;
				this._setSelection_(this.initControl, this.currentControl);
			}
		}

		if (event.pageX > right) {
			var nextField = this.fields[this.currentControl.itemId + 1];
			if (nextField) {
				while (!nextField.element.offset().left) {
					nextField = this.fields[nextField.itemId + 1];
				}
				this.currentControl = nextField;
				this._setSelection_(this.initControl, this.currentControl);
			}
		}
	}

	Table.prototype._onMouseDown_ = function(control, event, handler) {
		this.initControl = control;
		if (event.shiftKey) {
			if (control.root === this.header && this.selectFields.length) {
				this.initControl = this.selectFields[(control.itemId > this.selectFields[0].itemId) ? 0 : this.selectFields.length - 1];
			}
			if (control.root === this.content && this.selectCollection.length) {
				this.initControl = this.selectCollection[(control.itemId > this.selectCollection[0].itemId) ? 0 : this.selectCollection.length - 1];
			}
		}
		this.currentControl = control;
		this._setSelection_(this.initControl, this.currentControl);

		$(document).on({
			mousemove : handler,
			mouseup : function(event) {
				delete this.initControl;
				delete this.currentControl;
				$(document).off('mousemove', null, handler);
			}.bind(this)
		});
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
			this.footer.setInvisible(fieldNames);
		}

		return this;
	}

	Table.prototype.on = function(control, eventType, data) {
		if ([ 'control:focusin' ].includes(eventType)) {
			this.send(eventType, data).content.focus();
			return false;
		}
		if ([ 'control:tabulate' ].includes(eventType) && (control.context === this)) {
			this.send(eventType, data);
			return false;
		}
		if ([ 'control:updown' ].includes(eventType) && (control.root === this.content)) {
			this._onUpDown_(control, data);
			return false;
		}
		if ([ 'handle:mousedown' ].includes(eventType) && (control.context.root === this.content)) {
			var entry = control.context;
			this._onMouseDown_(entry, data, this._onMoveOverRows_.bind(this));
			return false;
		}
		if ([ 'field:mousedown' ].includes(eventType) && (control.context === this.header)) {
			this._onMouseDown_(control, data, this._onMoveOverColumns_.bind(this));
			return false;
		}
		if ([ 'handle:mousedown' ].includes(eventType) && (control.context === this.header)) {
			var isAllColumns = (this.selectFields.length === this.fields.length);
			var isAllRows = (this.selectCollection.length === this._getAllRows_().length);

			if (isAllColumns && isAllRows) {
				this._setSelection_(this.content.activeElement, this.content.activeElement);
			} else {
				this._setSelection_(this.fields[0], this.fields[this.fields.length - 1]);
			}
			return false;
		}
		if ([ 'control:changed' ].includes(eventType) && (control.context === this)) {
			this._setSelection_(this.content.activeElement, this.content.activeElement);
			this.send(eventType, data);
			return false;
		}
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

	Table.prototype.select = function(selection) {
		return this;
	}

	Table.prototype.deselect = function(selection) {
		return this;
	}

	return Table;
});