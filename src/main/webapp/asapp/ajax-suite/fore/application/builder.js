define([ './class' ], function(Application) {
	"use strict";

	function application(properties, Class) {
		return new (Class || Application)(properties.template).setContent(properties.controls || []);
	}

	return application;
});