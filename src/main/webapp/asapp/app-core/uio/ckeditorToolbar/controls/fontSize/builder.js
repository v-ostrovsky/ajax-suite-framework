define([ 'as', './class' ], function(as, Class) {
	"use strict";

	function fontSize(context, path, propertiesExt) {
		var properties = Object.assign(propertiesExt, {
			displayBuilder : function(context) {
				return as.generics.button.builder(context, '', {
					template : 'create:<div></div>',
					tooltip : as.locale.editor['fontSize'].title,
					formatter : function(value) {
						return as.locale.editor['fontSize'].options[value] || value;
					}
				});
			},
			handler : function(self, data) {
				self.send('control:changed').executeCommand();
			}
		});

		return as.generics.selectorDropdown.builder(context, path, properties, Class).init(propertiesExt.editor);
	}

	return fontSize;
});