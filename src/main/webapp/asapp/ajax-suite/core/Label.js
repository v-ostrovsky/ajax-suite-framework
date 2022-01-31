define([ './Control' ], function(Control) {
	"use strict";

	/*
	 * ------------- LABEL CLASS --------------
	 */
	function Label(context, path) {
		Control.call(this, context, path, null);
	}
	Label.prototype = Object.create(Control.prototype);
	Label.prototype.constructor = Label;

	Label.prototype.setText = function(text) {
		this.element.prepend(text || '');
		return this;
	}

	return Label;
});