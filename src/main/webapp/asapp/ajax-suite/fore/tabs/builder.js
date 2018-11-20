define([ './class' ], function(Tabs) {
	"use strict";

	function tabs(context, name, properties, Class) {
		return new (Class || Tabs)(context, name);
	}

	return tabs;
});