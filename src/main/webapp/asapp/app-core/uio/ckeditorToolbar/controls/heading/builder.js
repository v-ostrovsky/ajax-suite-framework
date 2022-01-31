define([ 'as', './class' ], function(as, Class) {
	"use strict";

	function heading(context, path, propertiesExt) {
		var properties = Object.assign(propertiesExt, {
			displayBuilder : function(context) {
				return as.generics.button.builder(context, '', {
					template : 'create:<div></div>',
					tooltip : as.locale.editor['heading'].title,
					formatter : function(value) {
						return as.locale.editor['heading'].options[value] || value;
					}
				});
			},
			selectorBuilder : as.uio.selectorPanel,
			handler : function(self, data) {
				self.send('control:changed').executeCommand();
			}
		});

		return as.generics.selectorDropdown.builder(context, path, properties, Class).init(propertiesExt.editor);
	}

	return heading;
});