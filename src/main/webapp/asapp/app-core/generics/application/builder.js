define(['as', './class'], function(as, Application) {
	"use strict";

	function application(properties, Class) {
		return as.generics.application.builder(properties, Class || Application);
	}

	return application;
});