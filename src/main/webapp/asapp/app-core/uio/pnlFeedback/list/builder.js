define(['as', './class', 'text!./template.htpl', './entry/builder'], function(as, Class, template, entryBuilder) {
	"use strict";

	function list(context, path, propertiesExt) {

		var properties = Object.assign(propertiesExt, {
			template: template,
			entryBuilder: entryBuilder,
			sortFields: [{
				name: 'time',
				comparator: as.locale.localeCompare.bind(null, 'date')
			}]
		});

		return as.generics.listEditable.builder(context, path, properties, Class).init();
	}

	return list;
});