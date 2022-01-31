define([ './class' ], function(Router) {
	"use strict";

	function router(context, path, properties, Class) {
		return new (Class || Router)(context, path, properties.template, properties);
	}

	return router;
});