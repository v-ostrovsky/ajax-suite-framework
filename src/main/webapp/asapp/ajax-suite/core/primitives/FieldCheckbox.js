define(['./Field'], function(Field) {
	"use strict";

	/*
	 * ------------- FIELD CHECKBOX CLASS --------------
	 */
	function FieldCheckbox(context, path, template, parameters) {
		Field.call(this, context, path, template, parameters);

		this.element.addClass('checkbox');

		this.formatter = function(value) {
			return value ? '&#x2713' : ''
		}
	}
	FieldCheckbox.prototype = Object.create(Field.prototype);
	FieldCheckbox.prototype.constructor = FieldCheckbox;

	return FieldCheckbox;
});