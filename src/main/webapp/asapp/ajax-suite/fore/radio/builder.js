define([ './class' ], function(Radio) {
	"use strict";

	function radio(context, name, properties, Class) {
		return new (Class || Radio)(context, name).setLabels(properties.text, properties.labels);
	}

	return radio;
});