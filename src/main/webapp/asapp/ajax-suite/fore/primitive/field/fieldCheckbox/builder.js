define([ './class', '../builder' ], function(FieldCheckbox, fieldBuilder) {
	"use strict";

	function fieldCheckbox(context, path, properties, Class) {
		return fieldBuilder(context, path, properties, (Class || FieldCheckbox));
	}

	return fieldCheckbox;
});