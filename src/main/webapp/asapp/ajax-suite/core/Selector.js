define([ './Control' ], function(Control) {
	"use strict";

	/*
	 * ------------- SELECTOR INTERFACE --------------
	 */
	function SelectorInterface(context, path, template) {
		Control.call(this, context, path, template);

		this.element.attr({
			'name' : 'selector'
		});
	}
	SelectorInterface.prototype = Object.create(Control.prototype);
	SelectorInterface.prototype.constructor = SelectorInterface;

	SelectorInterface.prototype.setContent = function(data) {
		return this;
	}

	SelectorInterface.prototype.forEach = function(handler) {
		return undefined;
	}

	SelectorInterface.prototype.getItem = function(value) {
		return null;
	}

	return SelectorInterface;
});