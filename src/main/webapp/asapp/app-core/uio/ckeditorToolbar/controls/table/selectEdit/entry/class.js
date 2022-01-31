define(['as'], function(as) {
	"use strict";

	var Class = as.generics.entry.Class;

	function Entry(context, path, template) {
		Class.call(this, context, path, template);
	}
	Entry.prototype = Object.create(Class.prototype);
	Entry.prototype.constructor = Entry;

	Entry.prototype.getView = function() {
		return this.tabLoop[0].getValue();
	}

	return Entry;
});