define(['./class', '../tableEntry/builder'], function(TableTreeEntry, tableEntryBuilder) {
	"use strict";

	function tableEntry(context, path, properties, Class) {
		return tableEntryBuilder(context, path, properties, (Class || TableTreeEntry));
	}

	return tableEntry;
});