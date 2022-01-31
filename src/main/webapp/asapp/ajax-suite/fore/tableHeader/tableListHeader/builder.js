define([ './class', '../builder' ], function(TableListHeader, tableHeaderBuilder) {
	"use strict";

	function tableListHeader(context, path, properties, Class) {
		return tableHeaderBuilder(context, path, properties, (Class || TableListHeader));
	}

	return tableListHeader;
});