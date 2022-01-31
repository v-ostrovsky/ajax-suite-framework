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

	Entry.prototype.setActiveStatus = function(status) {
		this.controls['textId'].element.toggleClass('control-active', ['active'].includes(status));
		this.controls['textId'].element.toggleClass('control-inactive', ['inactive'].includes(status));

		return Class.prototype.setActiveStatus.call(this, status);
	}

	return Entry;
});