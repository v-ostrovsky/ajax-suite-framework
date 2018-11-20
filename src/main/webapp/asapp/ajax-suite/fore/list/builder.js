define([ './class' ], function(List) {
	"use strict";

	function list(context, name, properties, Class) {
		var list = new (Class || List)(context, name, properties.template, properties.container, properties.entryBuilder, properties.daoBuilder);
		list.sortFields = properties.sortFields;
		(properties.daoBuilder && properties.method != 'none') ? list.fetchContent(properties.method || 'getData', properties.filter || '') : null;

		return list;
	}

	return list;
});