define(['as', './class'], function(as, Class) {
	"use strict";

	function flexSection(context, path, propertiesExt) {
		var properties = Object.assign(propertiesExt, {
			tooltip: as.locale.editor['flexSection'].title,
			content: as.icons.editor['flexSection'],
			handler: function(self) {
				self.executeCommand();
			}
		});

		return as.generics.button.builder(context, path, propertiesExt, Class).init(propertiesExt.editor);
	}

	return flexSection;
});