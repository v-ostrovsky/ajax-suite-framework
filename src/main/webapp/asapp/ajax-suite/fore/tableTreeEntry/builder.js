define([ './class', '../tableEntry/builder' ], function(TableTreeEntry, tableEntryBuilder) {
	"use strict";

	function tableEntry(context, name, properties, Class) {
		return tableEntryBuilder(context, name, properties, (Class || TableTreeEntry));
	}

	return tableEntry;
});