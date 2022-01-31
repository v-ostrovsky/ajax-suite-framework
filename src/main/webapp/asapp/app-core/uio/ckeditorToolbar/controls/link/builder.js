define([ 'as', './class' ], function(as, Class) {
	"use strict";

	function link(context, path, propertiesExt) {
		var properties = Object.assign(propertiesExt, {
			tooltip : as.locale.editor['link'].title,
			content : as.icons.editor['link'],
			handler : function(self) {
				self.executeCommand();
			}
		});

		return as.generics.button.builder(context, path, properties, Class).init(propertiesExt.editor);
	}

	return link;
});