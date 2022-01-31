define(['as', './class'], function(as, Class) {
	"use strict";

	function image(context, path, propertiesExt) {
		var properties = Object.assign(propertiesExt, {
			tooltip: as.locale.editor['image'].title,
			content: as.icons.editor['image']['image'],
			handler: function(self) {
				self.executeCommand();
			}
		});

		return as.generics.button.builder(context, path, properties, Class).init(propertiesExt.editor);
	}

	return image;
});