define(['ajax-suite/core/TableEntry'], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC TABLE ENTRY CLASS --------------
	 */
	function TableEntry(context, path, template, handleBuilder) {
		Class.call(this, context, path, template, handleBuilder);
	}
	TableEntry.prototype = Object.create(Class.prototype);
	TableEntry.prototype.constructor = TableEntry;

	TableEntry.prototype.setSelectedStatus = function(fields, flag) {
		if (['handle'].includes(fields[0].name)) {
			this.contextmenuItems.forEach(function(menuItem) {
				(typeof menuItem.onSetSelectedStatus === 'function') ? menuItem.onSetSelectedStatus(menuItem, flag) : null;
			});
		}

		fields.forEach(function(field) {
			var item = ['handle'].includes(field.name) ? this.handle : this.controls[field.name];

			item.element.toggleClass('selected', flag);

			item.contextmenuItems.forEach(function(menuItem) {
				(typeof menuItem.onSetSelectedStatus === 'function') ? menuItem.onSetSelectedStatus(menuItem, flag) : null;
			});
		}.bind(this));

		return this;
	}

	return TableEntry;
});