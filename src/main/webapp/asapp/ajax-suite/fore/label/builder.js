define([ './class' ], function(Label) {
	"use strict";

	function label(context, name, properties, Class) {
		return new (Class || Label)(context, name, properties.text);
	}

	return label;
});