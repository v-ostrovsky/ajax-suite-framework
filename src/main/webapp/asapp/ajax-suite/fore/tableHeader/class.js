define([ 'ajax-suite/core/TableHeader' ], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC TABLE HEADER CLASS --------------
	 */
	function TableHeader(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	TableHeader.prototype = Object.create(Class.prototype);
	TableHeader.prototype.constructor = TableHeader;

	TableHeader.prototype.setSelectedStatus = function(fields, flag) {
		if (fields[0] === this.handle) {
			this.contextmenuItems.forEach(function(menuItem) {
				(typeof menuItem.onSetSelectedStatus === 'function') ? menuItem.onSetSelectedStatus(menuItem, flag) : null;
			});
		}

		fields.forEach(function(field) {
			var item = (field === this.handle) ? this.handle : field;

			item.element.toggleClass('selected', flag);

			item.contextmenuItems.forEach(function(menuItem) {
				(typeof menuItem.onSetSelectedStatus === 'function') ? menuItem.onSetSelectedStatus(menuItem, flag) : null;
			});
		}.bind(this));

		return this;
	}

	return TableHeader;
});