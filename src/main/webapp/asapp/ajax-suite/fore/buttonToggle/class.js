define([ 'core/primitives' ], function(primitives) {
	"use strict";

	/*
	 * ------------- GENEGIC BUTTON TOGGLE CLASS --------------
	 */
	function ButtonToggle(context, name, handler, tooltip, image) {
		primitives.ButtonToggle.call(this, context, name, handler, tooltip, image);
	}
	ButtonToggle.prototype = Object.create(primitives.ButtonToggle.prototype);
	ButtonToggle.prototype.constructor = ButtonToggle;

	ButtonToggle.prototype.setActiveStatus = function(state) {
		this.element.toggleClass('control-active', [ 'active' ].includes(state));
		this.element.toggleClass('control-inactive', [ 'inactive' ].includes(state));

		return primitives.ButtonToggle.prototype.setActiveStatus.call(this, state);
	}

	return ButtonToggle;
});