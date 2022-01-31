define([ './class', '../builder' ], function(Field, primitiveBuilder) {
	"use strict";

	function field(context, path, properties, Class) {
		var field = primitiveBuilder(context, path, properties, (Class || Field));
		(properties.calculator !== undefined) ? field.setCalculator(properties.calculator) : null;

		return field;
	}

	return field;
});