define([ './class' ], function(Table) {
	"use strict";

	function table(context, path, properties, Class) {
		var table = new (Class || Table)(context, path, properties.template, properties);
		(typeof properties.text === 'string') ? table.setLabel(name, properties.text) : null;
		(properties.visible !== undefined) ? table.setVisibility(properties.visible) : null;

		return table;
	}

	return table;
});