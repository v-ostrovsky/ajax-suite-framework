define(['as'], function(as) {
	"use strict";

	var Class = as.generics.entry.Class;

	function Entry(context, path, template) {
		Class.call(this, context, path, template);
	}
	Entry.prototype = Object.create(Class.prototype);
	Entry.prototype.constructor = Entry;

	Entry.prototype.setActiveStatus = function(status) {
		this.controls['textId'].element.toggleClass('cck-text-entry-active', ['active'].includes(status));
		this.controls['textId'].element.toggleClass('cck-text-entry-inactive', ['inactive'].includes(status));

		return Class.prototype.setActiveStatus.call(this, status);
	}

	return Entry;
});