define([ './class', '../builder' ], function(ButtonFile, buttonBuilder) {
	"use strict";

	function buttonFile(context, path, properties, Class) {
		return buttonBuilder(context, path, properties, (Class || ButtonFile));
	}

	return buttonFile;
});