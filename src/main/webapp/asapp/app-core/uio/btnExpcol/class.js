define(['as'], function(as) {
	"use strict";

	var Class = as.generics.button.Class;

	function Expcol(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	Expcol.prototype = Object.create(Class.prototype);
	Expcol.prototype.constructor = Expcol;

	Expcol.prototype.setState = function(state) {
		var expcolIcon = null;
		if (!['none'].includes(state)) {
			expcolIcon = ['expanded'].includes(state) ? as.icons.collapse : as.icons.expand;
		}

		return this.setValue(expcolIcon);
	}

	return Expcol;
});