define([ 'as', './class' ], function(as, RouterContent) {
	"use strict";

	function routerContent(context, path, properties, Class) {
		return as.generics.panel.builder(context, path, properties, Class || RouterContent).init();
	}

	return routerContent;
});