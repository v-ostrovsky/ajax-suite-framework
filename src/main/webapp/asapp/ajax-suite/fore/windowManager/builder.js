define([ './class' ], function(WindowManager) {
	"use strict";

	function windowManager(context, path, properties, Class) {
		return new (Class || WindowManager)(context, path);
	}

	return windowManager;
});