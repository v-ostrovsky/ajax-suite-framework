define([ 'as', './class' ], function(as, Class) {
	"use strict";

	function button(context, path, propertiesExt) {
		return as.generics.button.builder(context, path, propertiesExt, Class).init(propertiesExt.editor);
	}

	return button;
});