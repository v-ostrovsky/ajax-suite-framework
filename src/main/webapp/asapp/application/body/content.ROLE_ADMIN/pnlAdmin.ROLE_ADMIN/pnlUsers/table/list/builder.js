define([ 'as', './class', 'text!./template.htpl', './entry/builder' ], function(as, Class, template, entryBuilder) {
	"use strict";

	function list(context, name) {

		var properties = {
			template : template,
			container : 'collection',
			sortFields : [ context.fields[0] ],
			entryBuilder : entryBuilder,
			daoBuilder : as.dao.users
		};

		return as.generics.list.builder(context, name, properties, Class);
	}

	return list;
});