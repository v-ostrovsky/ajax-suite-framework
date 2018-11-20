define([ './class' ], function(TableListField) {
	"use strict";

	function tableListField(context, name, properties, Class) {
		var field = new (Class || TableListField)(context, name, properties.formatter, properties.calculator, properties.inputMaskBuilder);
		(properties.defaultValue != undefined) ? field.setValue(properties.defaultValue) : null;

		return field;
	}

	return tableListField;
});