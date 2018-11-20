define([ 'core/primitives' ], function(primitives) {
	"use strict";

	/*
	 * ------------- GENEGIC BUTTON FILE CLASS --------------
	 */
	function ButtonFile(context, name, handler, tooltip, image) {
		primitives.ButtonFile.call(this, context, name, handler, tooltip, image);
	}
	ButtonFile.prototype = Object.create(primitives.ButtonFile.prototype);
	ButtonFile.prototype.constructor = ButtonFile;

	ButtonFile.prototype.setActiveStatus = function(state) {
		this.element.toggleClass('button-active', [ 'active' ].includes(state));
		this.element.toggleClass('button-inactive', [ 'inactive' ].includes(state));

		return primitives.ButtonFile.prototype.setActiveStatus.call(this, state);
	}

	return ButtonFile;
});