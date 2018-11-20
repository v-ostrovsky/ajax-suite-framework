define([ './class', '../table/builder' ], function(TableList, tableBuilder) {
	"use strict";

	function tableList(context, name, properties, Class) {
		return tableBuilder(context, name, properties, (Class || TableList));
	}

	return tableList;
});