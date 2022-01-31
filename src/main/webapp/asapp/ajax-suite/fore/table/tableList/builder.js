define([ './class', '../builder' ], function(TableList, tableBuilder) {
	"use strict";

	function tableList(context, path, properties, Class) {
		return tableBuilder(context, path, properties, (Class || TableList));
	}

	return tableList;
});