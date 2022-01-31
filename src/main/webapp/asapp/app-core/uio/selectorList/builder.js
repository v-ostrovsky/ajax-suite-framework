define(['as', './class', 'text!./template.htpl', './entry/builder'], function(as, Class, template, entryBuilder) {
	"use strict";

	function list(context, propertiesExt) {
		var viewBuilder = propertiesExt.viewBuilder || function(context, path) {
			return as.generics.button.builder(context, path, {});
		}

		var fields = [{
			name: 'textId',
			comparator: as.locale.localeCompare.bind(null, 'string'),
			sortOrder: propertiesExt.sortOrder
		}];

		function entryBuilderBound(context, path, attributes) {
			return entryBuilder(context, path, fields, attributes, viewBuilder);
		}

		var properties = {
			template: 'create:' + template,
			entryBuilder: entryBuilderBound,
			sortFields: propertiesExt.sortFields || fields,
			daoBuilder: propertiesExt.daoBuilder,
			filter: propertiesExt.filter
		};

		return as.generics.list.builder(context, '', properties, Class);
	}

	return list;
});