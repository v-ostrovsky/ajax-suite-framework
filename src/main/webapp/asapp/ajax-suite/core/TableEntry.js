define([ './Entry' ], function(Entry) {
	"use strict";

	/*
	 * ------------- TABLE ENTRY CLASS --------------
	 */
	function TableEntry(context, template, handleBuilder) {
		Entry.call(this, context, template);

		this.handle = handleBuilder(this);
	}
	TableEntry.prototype = Object.create(Entry.prototype);
	TableEntry.prototype.constructor = TableEntry;

	TableEntry.prototype.on = function(control, eventType, data) {
		if ([ 'control:leftright' ].includes(eventType) && (control.context === this)) {
			var leftright = (data.which === 37) ? -1 : 1;
			this.nextControl(control, leftright);
			return false;
		}
		if ([ 'handle:dblclick' ].includes(eventType) && (control.context === this)) {
			this.send(eventType, data);
			return false;
		}

		return Entry.prototype.on.call(this, control, eventType, data);
	}

	TableEntry.prototype.getDefaultActiveElement = function() {
		return Entry.prototype.getDefaultActiveElement.call(this) || this.handle;
	}

	TableEntry.prototype.setInvisible = function(fieldNames) {
		Object.keys(this.controls).forEach(function(key) {
			var item = this.controls[key];
			item.setVisibility(!fieldNames.includes(item.name));
		}.bind(this));

		return this;
	}

	TableEntry.prototype.setItemId = function(root, itemId) {
		var fieldNames = root.context.fields.filter(function(item) {
			return item.isInvisible;
		}).map(function(item) {
			return item.name;
		});
		this.setInvisible(fieldNames);

		return Entry.prototype.setItemId.call(this, root, itemId);
	}

	return TableEntry;
});