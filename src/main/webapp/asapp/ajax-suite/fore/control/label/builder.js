define([ './class', '../builder' ], function(Label, controlBuilder) {
	"use strict";

	function label(context, path, properties, Class) {
		var label = controlBuilder(context, path, properties, (Class || Label));
		(properties.text !== undefined) ? label.setText(properties.text) : null;

		return label;
	}

	return label;
});