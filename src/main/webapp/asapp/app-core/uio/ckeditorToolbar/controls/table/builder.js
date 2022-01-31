define([ 'as', './class' ], function(as, Class) {
	"use strict";

	function table(context, path, propertiesExt) {
		var properties = Object.assign(propertiesExt, {
			displayBuilder : function(context) {
				var properties = {
					template : 'create:<div></div>'
				};

				return as.generics.button.builder(context, '', properties);
			},
			// selectorBuilder : function(context) {
			// var properties = {
			// template : 'create:<div name="select"></div>'
			// };
			//
			// return as.generics.panel.builder(context, '', properties);
			// },
			handler : function(self, data) {
				self.send('control:changed').executeCommand();
			}
		});

		return as.generics.selectorDropdown.builder(context, path, properties, Class).init(propertiesExt.editor);
	}

	return table;
});