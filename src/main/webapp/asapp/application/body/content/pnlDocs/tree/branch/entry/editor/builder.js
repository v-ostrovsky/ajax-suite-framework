define([ 'as', './class', 'text!./template.htpl', './pnlToolbar.ROLE_ADMIN/builder', './content/builder' ], function(as, Class, template, toolbarBuilder, contentBuilder) {
	"use strict";

	function editor(context, name) {

		var builders = {
			toolbar : toolbarBuilder,
			content : contentBuilder
		}

		var controls = [].concat([ 'toolbar', 'content' ].map(function(item) {
			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, builders[item])
			};
		}));

		return new Class(context, name, template).setContent(controls);
	}

	return editor;
});