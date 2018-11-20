define([ './class' ], function(Entry) {
	"use strict";

	function entry(context, properties, Class) {
		return new (Class || Entry)(context, properties.template).setContent(properties.controls).fillContent(properties.attributes).setContextmenu(properties.contextmenuItems);
	}

	return entry;
});