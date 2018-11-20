define([ './class', '../tableHeader/builder' ], function(TableListHeader, tableHeaderBuilder) {
	"use strict";

	function tableListHeader(context, name, properties, Class) {
		return tableHeaderBuilder(context, name, properties, (Class || TableListHeader));
	}

	return tableListHeader;
});