define(['./class', '../tableEntry/builder'], function(TableListEntry, tableEntryBuilder) {
	"use strict";

	function tableListEntry(context, path, properties, Class) {
		return tableEntryBuilder(context, path, properties, (Class || TableListEntry));
	}

	return tableListEntry;
});