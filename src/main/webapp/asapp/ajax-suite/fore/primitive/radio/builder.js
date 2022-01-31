define([ './class', '../builder' ], function(Radio, primitiveBuilder) {
	"use strict";

	function radio(context, path, properties, Class) {
		var radio = primitiveBuilder(context, path, properties, (Class || Radio));
		radio.setLabels(name, properties.text, properties.labels);

		return radio;
	}

	return radio;
});