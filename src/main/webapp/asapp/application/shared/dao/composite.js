define([ 'as' ], function(as) {
	"use strict";

	var Composite = as.dao.Composite;

	return function composite(parameters) {
		return new Composite(parameters);
	};
});