define(['./class'], function(Entry) {
	"use strict";

	function entry(context, path, properties, Class) {
		var entry = new (Class || Entry)(context, path, properties.template);
		(properties.controls !== undefined) ? entry.setContent(properties.controls) : null;
		(properties.attributes !== undefined) ? entry.fillContent(properties.attributes) : null;
		(properties.contextmenuItems !== undefined) ? entry.setContextmenu(properties.contextmenuItems) : null;

		return entry;
	}

	return entry;
});