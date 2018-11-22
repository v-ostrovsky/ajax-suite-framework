define([ 'as', './class', 'text!./template.htpl' ], function(as, Form, template) {
	"use strict";

	function form(context, name, propertiesExt, Class) {

		var controls = [].concat([ 'username', 'firstName', 'lastName', 'password' ].map(function(item) {
			var properties = {
				text : as.locale.users.editForm[item]
			};

			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, as.generics.field.builder, properties)
			};
		})).concat([ 'role' ].map(function(item) {
			var properties = {
				text : as.locale.users.editForm[item],
				typeOfContent : 'list',
				data : as.dao['roles'](context.application).getData('')
			};

			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, as.generics.selectDropdown.builder, properties)
			};
		}));

		var properties = {
			template : template,
			controls : controls,
			attributes : propertiesExt.attributes,
			onSubmit : propertiesExt.onSubmit,
			header : (propertiesExt.attributes.id) ? as.locale.form.titleEdit : as.locale.form.titleCreate
		};

		return as.generics.form.builder(context, name, properties, (Class || Form));
	}

	return form;
});