define([ './class' ], function(Tabs) {
	"use strict";

	function tabs(context, path, properties, Class) {
		var tabs = new (Class || Tabs)(context, path);
		(properties.visible !== undefined) ? tabs.setVisibility(properties.visible) : null;

		return tabs;
	}

	return tabs;
});