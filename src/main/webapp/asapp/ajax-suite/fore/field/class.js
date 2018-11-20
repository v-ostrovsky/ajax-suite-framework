define([ 'core/primitives' ], function(primitives) {
	"use strict";

	/*
	 * ------------- GENEGIC FIELD CLASS --------------
	 */
	function Field(context, name, formatter, calculator, inputMaskBuilder) {
		primitives.Field.call(this, context, name, formatter, calculator, inputMaskBuilder);
	}
	Field.prototype = Object.create(primitives.Field.prototype);
	Field.prototype.constructor = Field;

	Field.prototype.setActiveStatus = function(state) {
		this.element.toggleClass('control-active', [ 'active' ].includes(state));
		return primitives.Field.prototype.setActiveStatus.call(this, state);
	}

	Field.prototype.setLabel = function(name, text) {
		if (text) {
			this.label = new primitives.Label(this.context, name + '-label', text);
		}

		return this;
	}

	return Field;
});