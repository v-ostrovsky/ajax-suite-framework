define([ './class' ], function(List) {
	"use strict";

	function list(context, path, properties, Class) {
		var list = new (Class || List)(context, path, properties.template, properties);
		(properties.visible !== undefined) ? list.setVisibility(properties.visible) : null;
		list.sortFields = properties.sortFields;
		properties.daoBuilder ? list.setContent(properties.daoBuilder, properties.filter) : null;

		return list;
	}

	return list;
});