define([ './class' ], function(Panel) {
	"use strict";

	function panel(context, path, properties, Class) {
		var panel = new (Class || Panel)(context, path, properties.template);
		(Array.isArray(properties.controls)) ? panel.setContent(properties.controls) : null;
		(properties.visible !== undefined) ? panel.setVisibility(properties.visible) : null;
		(properties.header !== undefined) ? panel.send('setHeader', properties.header) : null;

		return panel;
	}

	return panel;
});