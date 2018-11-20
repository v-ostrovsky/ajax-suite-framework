define([ 'as', './class', 'text!./template.htpl' ], function(as, Class, template) {
	"use strict";

	function panel(context, name) {

		var controls = [].concat([ 'edit', 'cancel' ].map(function(item) {
			var properties = {
				tooltip : as.locale.ckEditor[item],
				image : as.icons[item]
			};

			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, as.generics.button.builder, properties)
			};
		})).concat([ 'submit' ].map(function(item) {
			var properties = {
				handler : function(self) {
					return self.context.submit();
				},
				defaultValue : as.locale.ckEditor[item]
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