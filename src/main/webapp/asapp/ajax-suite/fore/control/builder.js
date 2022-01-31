define([ './class' ], function(Control) {
	"use strict";

	function control(context, path, properties, Class) {
		var control = new (Class || Control)(context, path, properties.template);
		(properties.visible !== undefined) ? control.setVisibility(properties.visible) : null;

		return control;
	}

	return control;
});