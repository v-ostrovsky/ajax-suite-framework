define([ 'as', './class', 'text!./template.htpl' ], function(as, Class, template) {
	"use strict";

	function panel(context, name) {

		var controls = [].concat([ 'create', 'edit', 'moveBranch', 'removeBranch' ].map(function(item) {
			var properties = {
				tooltip : as.locale.tooltip[item].text,
				image : as.icons[item],
				handler : function(self) {
					self.send('crud:execute', item);
				}
			};

			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, as.generics.button.builder, properties)
			};
		}));

		var properties = {
			template : template,
			controls : controls
		};

		return as.generics.panel.builder(context, name, properties, Class);
	}

	return panel;
});