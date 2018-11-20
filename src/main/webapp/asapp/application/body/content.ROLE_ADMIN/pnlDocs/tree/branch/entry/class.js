define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.entry.Class;

	/*
	 * ------------- DOCUMENT TREE ENTRY CLASS --------------
	 */
	function Entry(context, template) {
		Class.call(this, context, template);
	}
	Entry.prototype = Object.create(Class.prototype);
	Entry.prototype.constructor = Entry;

	Entry.prototype.setActiveStatus = function(state) {
		this.controls['textId'].setActiveStatus(state);
		return Class.prototype.setActiveStatus.call(this, state);
	}

	return Entry;
});