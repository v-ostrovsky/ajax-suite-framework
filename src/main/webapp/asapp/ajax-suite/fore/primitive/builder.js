define([ './class' ], function(Primitive) {
	"use strict";

	function primitive(context, path, properties, Class) {
		var primitive = new (Class || Primitive)(context, path, properties.template, {
			text : properties.text
		});

		(properties.contextmenuItems !== undefined) ? primitive.setContextmenu(properties.contextmenuItems) : null;
		(properties.visible !== undefined) ? primitive.setVisibility(properties.visible) : null;
		(properties.disabled !== undefined) ? primitive.disable(properties.disabled) : null;
		(typeof properties.tooltip === 'string') ? primitive.setTooltip(properties.tooltip) : null;
		(typeof properties.formatter === 'function') ? primitive.setFormatter(properties.formatter) : null;
		(typeof properties.validator === 'function') ? primitive.setValidator(properties.validator) : null;
		(properties.defaultValue !== undefined) ? primitive.setValue(properties.defaultValue) : null;

		return primitive;
	}

	return primitive;
});