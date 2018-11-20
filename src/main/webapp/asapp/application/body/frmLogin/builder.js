define([ 'as', './class', 'text!./template.htpl' ], function(as, Form, template) {
	"use strict";

	function form(context, name, propertiesExt, Class) {

		var controls = [].concat([ 'username', 'password' ].map(function(item) {
			var properties = {
				text : as.locale.mainmenu.loginform[item]
			};

			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, as.generics.field.builder, properties)
			};
		}));

		var properties = {
			template : template,
			controls : controls,
			attributes : propertiesExt.attributes,
			onSubmit : propertiesExt.onSubmit,
			header : as.locale.mainmenu.loginform['title']
		};

		return as.generics.form.builder(context, name, properties, (Class || Form));
	}

	return form;
});