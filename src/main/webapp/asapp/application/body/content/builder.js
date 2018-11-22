define([ 'as', './class', 'text!./template.htpl', './pnlAdmin.ROLE_ADMIN/builder', './pnlDocs/builder' ], function(as, Class, template, pnlAdminBuilder, pnlDocsBuilder) {
	"use strict";

	var builders = {
		pnlAdmin : pnlAdminBuilder,
		pnlDocs : pnlDocsBuilder
	};

	function panel(context, name) {

		var controls = [].concat([ 'pnlAdmin', 'pnlDocs' ].map(function(item) {
			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, builders[item])
			};
		})).concat([ 'mainContent' ].map(function(item) {
			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, as.generics.tabs.builder)
			};
		}));

		var properties = {
			template : template,
			controls : controls,
			getSidemenu : function(context) {
				return context.controls['pnlDocs'].controls['tree'];
			},
			getContent : function(context) {
				return context.controls['mainContent'];
			}
		};

		return as.generics.router.builder(context, name, properties, Class);
	}

	return panel;
});