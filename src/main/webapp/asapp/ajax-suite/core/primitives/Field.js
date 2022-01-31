define([ '../Primitive' ], function(Primitive) {
	"use strict";

	/*
	 * ------------- FIELD CLASS --------------
	 */
	function Field(context, path, template, parameters) {
		Primitive.call(this, context, path, template, parameters);
	}
	Field.prototype = Object.create(Primitive.prototype);
	Field.prototype.constructor = Field;

	Field.prototype.setCalculator = function(calculator) {
		this.calculator = calculator;
		return this;
	}

	Field.prototype.setValue = function(value) {
		return Primitive.prototype.setValue.call(this, this.calculator ? this.calculator.fnc(this) : value);
	}

	return Field;
});