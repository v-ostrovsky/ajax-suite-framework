define([ './class' ], function(TableHeaderField) {
	"use strict";

	function headerField(context, name, properties, Class) {
		return new (Class || TableHeaderField)(context, name, properties.msoFormatter).setValue(properties.text);
	}

	return headerField;
});