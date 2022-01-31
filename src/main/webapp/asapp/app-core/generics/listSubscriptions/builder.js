define(['as', './class'], function(as, ListSubscriptions) {
	"use strict";

	function listSubscriptions(context, path, properties, Class) {
		return as.generics.list.builder(context, path, properties, (Class || ListSubscriptions));
	}

	return listSubscriptions;
});