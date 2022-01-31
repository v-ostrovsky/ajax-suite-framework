define([ 'as', './class', 'text!./template.htpl', './header/builder', './list/builder' ], function(as, Class, template, headerBuilder, listBuilder) {
	"use strict";

	function control(context, path) {

		function headerBuilderBound(context) {
			return headerBuilder(context, '*/header');
		}

		function contentBuilder(context) {
			return listBuilder(context, '*/list');
		}

		return new Class(context, path, template, headerBuilderBound, contentBuilder);
	}

	return control;
});