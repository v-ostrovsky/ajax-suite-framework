define([ './class', '../tableEntry/builder' ], function(TableListEntry, tableEntryBuilder) {
	"use strict";

	function tableEntry(context, name, properties, Class) {
		return tableEntryBuilder(context, name, properties, (Class || TableListEntry));
	}

	return tableEntry;
});