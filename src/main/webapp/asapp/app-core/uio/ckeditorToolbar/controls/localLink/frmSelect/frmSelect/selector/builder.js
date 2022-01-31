define(['as', './class', 'text!./template.htpl', './entry/builder'], function(as, Class, template, entryBuilder) {
	"use strict";

	function list(context, path, propertiesExt) {

		var properties = {
			template: template,
			sortFields: [{
				name: 'created',
				comparator: as.locale.localeCompare.bind(null, 'date'),
				sortOrder: 'desc'
			}],
			entryBuilder: entryBuilder,
			daoBuilder: as.dao['newsfeed'],
			filter: '&theme=' + propertiesExt.theme
		};

		return as.generics.list.builder(context, path, properties, Class);
	}

	return list;
});