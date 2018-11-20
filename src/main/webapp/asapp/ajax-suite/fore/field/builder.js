define([ './class' ], function(Field) {
	"use strict";

	function field(context, name, properties, Class) {
		var field = new (Class || Field)(context, name, properties.formatter, properties.calculator, properties.inputMaskBuilder).setLabel(name, properties.text);
		(properties.defaultValue != undefined) ? field.setValue(properties.defaultValue) : null;

		return field;
	}

	return field;
});