define([ 'as', './class', 'text!./template.htpl', './pnlToolbar.ROLE_ADMIN/builder' ], function(as, Class, template, toolbarBuilder) {
	"use strict";

	function editor(context, name) {

		var controls = [].concat([ 'content' ].map(function(item) {
			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, as.generics.control.builder)
			};
		})).concat([ 'toolbar' ].map(function(item) {
			function toolbarBuilderBound(context, name) {
				return toolbarBuilder(context, name);
			}

			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, toolbarBuilderBound)
			};
		}));

		return new Class(context, name, template).setContent(controls);
	}

	return editor;
});