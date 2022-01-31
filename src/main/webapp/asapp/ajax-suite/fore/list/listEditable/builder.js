define([ './class', '../builder' ], function(ListEditable, listBuilder) {
	"use strict";

	function listEditable(context, path, properties, Class) {
		return listBuilder(context, path, properties, (Class || ListEditable));
	}

	return listEditable;
});