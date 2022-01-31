define([ 'as', './class', 'text!./template.htpl' ], function(as, Class, template) {
	"use strict";

	function form(context, path, propertiesExt) {

		var controls = [].concat([ 'href' ].map(function(item) {
			return {
				name : item,
				builder : as.utils.bindBuilder('*/' + item, as.generics.input.builder)
			};
		}));

		var properties = Object.assign(propertiesExt, {
			template : template,
			controls : controls,
			header : as.locale.editor['link'].title
		});

		return as.generics.form.builder(context, path, properties, Class);
	}

	return form;
});