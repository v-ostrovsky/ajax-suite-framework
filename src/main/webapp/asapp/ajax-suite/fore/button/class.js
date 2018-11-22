define([ 'core/primitives' ], function(primitives) {
	"use strict";

	/*
	 * ------------- GENEGIC BUTTON CLASS --------------
	 */
	function Button(context, name, handler, tooltip, image) {
		primitives.Button.call(this, context, name, handler, tooltip, image);
	}
	Button.prototype = Object.create(primitives.Button.prototype);
	Button.prototype.constructor = Button;

	Button.prototype.setActiveStatus = function(state) {
		this.element.toggleClass('control-active', [ 'active' ].includes(state));
		this.element.toggleClass('control-inactive', [ 'inactive' ].includes(state));

		return primitives.Button.prototype.setActiveStatus.call(this, state);
	}

	return Button;
});