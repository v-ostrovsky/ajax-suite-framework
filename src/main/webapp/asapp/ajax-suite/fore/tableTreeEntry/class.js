define(['../tableEntry/class'], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC TABLE TREE ENTRY CLASS --------------
	 */
	function TableTreeEntry(context, path, template, handleBuilder) {
		Class.call(this, context, path, template, handleBuilder);
	}
	TableTreeEntry.prototype = Object.create(Class.prototype);
	TableTreeEntry.prototype.constructor = TableTreeEntry;

	TableTreeEntry.prototype.setItemId = function(root, itemId) {
		Class.prototype.setItemId.call(this, root, itemId);
		this.handle.setValue(this.attributes.code);

		return this;
	}

	return TableTreeEntry;
});