define([ 'as', './class', 'text!./template.htpl', './content.ROLE_ADMIN/builder' ], function(as, Class, template, contentBuilder) {
	"use strict";

	function application() {

		var controls = [].concat([ 'login', 'logout' ].map(function(item) {
			var properties = {
				defaultValue : as.locale.mainmenu[item]
			};

			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, as.generics.button.builder, properties)
			};
		})).concat([ 'content' ].map(function(item) {
			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, contentBuilder)
			};
		}));

		var properties = {
			template : template,
			daoBuilder : as.dao.application,
			controls : controls
		};

		return as.generics.application.builder(properties, Class);
	}

	return application;
});