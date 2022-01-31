define([ 'as', './class' ], function(as, Class) {
	"use strict";

	function red(context, path, propertiesExt) {
		var properties = Object.assign(propertiesExt, {
			tooltip : as.locale.editor['red'].title,
			content : as.icons.editor['red'],
			handler : function(self) {
				self.executeCommand();
			}
		});

		return as.generics.button.builder(context, path, properties, Class).init(propertiesExt.editor);
	}

	return red;
});