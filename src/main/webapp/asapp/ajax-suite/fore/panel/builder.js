define([ './class' ], function(Panel) {
	"use strict";

	function panel(context, name, properties, Class) {
		return new (Class || Panel)(context, name, properties.template).setContent(properties.controls).send('setHeader', properties.header || '');
	}

	return panel;
});