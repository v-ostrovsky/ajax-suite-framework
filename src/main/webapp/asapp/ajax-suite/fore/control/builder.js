define([ './class' ], function(Control) {
	"use strict";

	function control(context, name, properties, Class) {
		return new (Class || Control)(context, name, properties.template);
	}

	return control;
});