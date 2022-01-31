define([ 'ajax-suite/core/Table', 'ajax-suite/core/primitives/@dir', './selection/builder' ], function(Class, primitives, selectionBuilder) {
	"use strict";

	/*
	 * ------------- GENEGIC TABLE CLASS --------------
	 */
	function Table(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);

		this.selection = selectionBuilder(this);

		this.ondragdrop(function(event, data) {
			data.initControl.handle ? this._onMoveOverRows_(event, data) : this._onMoveOverColumns_(event, data);
		}.bind(this));

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
			}.bind(this)
		// ,
		// paste : function(event) {
		// event.preventDefault();
		// event.stopPropagation();
		// this.paste(event.originalEvent.clipboardData.getData('text'));
		// }.bind(this)
		});
	}
	Table.prototype = Object.create(Class.prototype);
	Table.prototype.constructor = Table;

	Table.prototype._onUpDown_ = function(control, event) {
		var updown = (event.which === 38) ? -1 : 1;
		var initControl = this.content.activeElement;
		var index = (control.itemId > this.selection.rows[0].itemId) ? 0 : this.selection.rows.length - 1;
		var currentControl = this.content.nextEntry(this.selection.rows[index], updown);
		this.selection.create(initControl, currentControl);
	}

	Table.prototype._onMoveOverRows_ = function(event, data) {
		var top = data.currentControl.element.offset().top;
		var bottom = top + data.currentControl.element.outerHeight();

		if (event.pageY < top) {
			var nextEntry = this.content.nextEntry(data.currentControl, -1);
			if (nextEntry.itemId < data.currentControl.itemId) {
				data.currentControl = nextEntry;
				this.selection.create(data.initControl, data.currentControl);
			}
		}

		if (event.pageY > bottom) {
			var nextEntry = this.content.nextEntry(data.currentControl, 1);
			if (nextEntry.itemId > data.currentControl.itemId) {
				data.currentControl = nextEntry;
				this.selection.create(data.initControl, data.currentControl);
			}
		}
	}

	Table.prototype._onMoveOverColumns_ = function(event, data) {
		var left = data.currentControl.element.offset().left;
		var right = left + data.currentControl.element.outerWidth();

		if (event.pageX < left) {
			var nextField = this.fields[data.currentControl.itemId - 1];
			if (nextField) {
				while (!nextField.element.offset().left) {
					nextField = this.fields[nextField.itemId - 1];
				}
				data.currentControl = nextField;
				this.selection.create(data.initControl, data.currentControl);
			}
		}

		if (event.pageX > right) {
			var nextField = this.fields[data.currentControl.itemId + 1];
			if (nextField) {
				while (!nextField.element.offset().left) {
					nextField = this.fields[nextField.itemId + 1];
				}
				data.currentControl = nextField;
				this.selection.create(data.initControl, data.currentControl);
			}
		}
	}

	Table.prototype._onMouseDown_ = function(control, event) {
		var initControl = control;
		if (event.shiftKey) {
			if (control.root === this.header && this.selection.columns.length) {
				initControl = this.selection.columns[(control.itemId > this.selection.columns[0].itemId) ? 0 : this.selection.columns.length - 1];
			}
			if (control.root === this.content && this.selection.rows.length) {
				initControl = this.selection.rows[(control.itemId > this.selection.rows[0].itemId) ? 0 : this.selection.rows.length - 1];
			}
		}

		var currentControl = control;
		this.selection.create(initControl, currentControl);

		this.dragdropInit(event, {
			initControl : initControl,
			currentControl : currentControl
		});
	}

	Table.prototype.on = function(control, eventType, data) {
		if ([ 'contextmenu:execute' ].includes(eventType)) {
			this[data]();
			return false;
		}
		if ([ 'control:updown' ].includes(eventType) && (control.root === this.content)) {
			this._onUpDown_(control, data);
			return false;
		}
		if ([ 'handle:mousedown' ].includes(eventType) && (control.root === this.content)) {
			this._onMouseDown_(control, data);
			return false;
		}
		if ([ 'field:mousedown' ].includes(eventType) && (control.context === this.header)) {
			this._onMouseDown_(control, data);
			return false;
		}
		if ([ 'handle:mousedown' ].includes(eventType) && (control.context === this.header)) {
			if (this.content.collection.length) {
				if ((control === this.selection.fields[0]) && (control === this.selection.entries[0].handle)) {
					this.selection.create(this.content.activeElement, this.content.activeElement);
				} else {
					this.selection.create(this.fields[0], this.fields[this.fields.length - 1]);
				}
			};
			return false;
		}
		if ([ 'control:changed' ].includes(eventType) && (control === this.content)) {
			this.selection.create(this.content.activeElement, this.content.activeElement);
		}

		return Class.prototype.on.call(this, control, eventType, data);
	}

	Table.prototype.execute = function(callback) {
		this.content.execute(function(response) {
			callback(response, this);
		}.bind(this));
		return this;
	}

	Table.prototype.copyData = function() {
		this.selection.copyData();
	}

	Table.prototype.copyTable = function() {
		this.selection.copyTable();
	}

	return Table;
});