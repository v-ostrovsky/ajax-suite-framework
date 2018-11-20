define([ 'as', './class', 'text!./template.htpl' ], function(as, Class, template) {
	"use strict";

	function panel(context, name, data) {
		
		var controls = [].concat([ 'tree' ].map(function(item) {
			var properties = {
				typeOfContent : 'tree',
				data : data
			};

			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, as.generics.select.builder, properties)
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