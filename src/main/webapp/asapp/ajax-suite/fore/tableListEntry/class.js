define(['../tableEntry/class'], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC TABLE LIST ENTRY CLASS --------------
	 */
	function TableListEntry(context, path, template, handleBuilder) {
		Class.call(this, context, path, template, handleBuilder);
	}
	TableListEntry.prototype = Object.create(Class.prototype);
	TableListEntry.prototype.constructor = TableListEntry;

	TableListEntry.prototype.setItemId = function(root, itemId) {
		this.handle.setValue(itemId + 1);
		return Class.prototype.setItemId.call(this, root, itemId);
	}

	return TableListEntry;
});