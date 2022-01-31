define([ './class' ], function(TableHeaderField) {
	"use strict";

	function headerField(context, path, properties, Class) {
		return new (Class || TableHeaderField)(context, path, properties.msoFormatter).setInvisible(properties.isInvisible).setValue(properties.text);
	}

	return headerField;
});