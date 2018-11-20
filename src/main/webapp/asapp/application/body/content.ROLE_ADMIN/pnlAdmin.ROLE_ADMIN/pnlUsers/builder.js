define([ 'as', './class', 'text!./template.htpl', './table/builder' ], function(as, Class, template, tableBuilder) {
	"use strict";

	function panel(context) {

		var controls = [].concat([ 'table' ].map(function(item) {
			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, tableBuilder)
			};
		})).concat([ 'create', 'edit', 'remove' ].map(function(item) {
			var properties = {
				tooltip : as.locale.tooltip[item].text,
				image : as.icons[item],
				handler : function(self) {
					return self.context.controls['table'].content[item]();
				}
			};

			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, as.generics.button.builder, properties)
			};
		}));

		var properties = {
			template : template,
			controls : controls,
			header : as.locale.users.name
		};

		return as.generics.panel.builder(context, '*/content', properties, Class);
	}

	return panel;
});