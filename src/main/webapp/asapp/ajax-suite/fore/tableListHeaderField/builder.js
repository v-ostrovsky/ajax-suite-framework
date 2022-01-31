define([ './class', '../tableHeaderField/builder' ], function(TableListHeaderField, tableHeaderFieldBuilder) {
	"use strict";

	function headerField(context, path, properties, Class) {
		headerField = tableHeaderFieldBuilder(context, path, properties, (Class || TableListHeaderField)).setSortButton(properties.comparator);
		headerField.sortOrder = properties.sortOrder;

		return headerField;
	}

	return headerField;
});