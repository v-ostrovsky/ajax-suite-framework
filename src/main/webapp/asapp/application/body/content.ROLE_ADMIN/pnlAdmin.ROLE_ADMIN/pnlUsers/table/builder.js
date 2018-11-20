define([ 'as', './class', 'text!./template.htpl', './header/builder', './list/builder' ], function(as, Class, template, headerBuilder, contentBuilder) {
	"use strict";

	function table(context, name) {

		function headerBuilderBound(context) {
			return headerBuilder(context, '*/header');
		}

		function contentBuilderBound(context) {
			return contentBuilder(context, 'content');
		}

		var properties = {
			template : template,
			headerBuilder : headerBuilderBound,
			contentBuilder : contentBuilderBound
		};

		return as.generics.tableList.builder(context, name, properties, Class);
	}

	return table;
});