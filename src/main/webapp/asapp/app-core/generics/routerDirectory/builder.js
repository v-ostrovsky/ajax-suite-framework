define([ 'as', './class' ], function(as, Directory) {
	"use strict";

	function directory(context, path, properties, Class) {
		return as.generics.panel.builder(context, path, properties, Class || Directory).init();
	}

	return directory;
});