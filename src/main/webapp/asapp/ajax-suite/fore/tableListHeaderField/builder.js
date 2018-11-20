define([ './class', '../tableHeaderField/builder' ], function(TableListHeaderField, tableHeaderFieldBuilder) {
	"use strict";

	function headerField(context, name, properties, Class) {
		headerField = tableHeaderFieldBuilder(context, name, properties, (Class || TableListHeaderField)).setSortButton(properties.comparator);
		headerField.sortOrder = properties.sortOrder;

		return headerField;
	}

	return headerField;
});