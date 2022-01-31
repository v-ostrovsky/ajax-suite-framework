define([ './class', '../builder' ], function(WindowManagerRouterContent, windowManagerBuilder) {
	"use strict";

	function windowManagerRouterContent(context, path, properties, Class) {
		return windowManagerBuilder(context, path, properties, Class || WindowManagerRouterContent);
	}

	return windowManagerRouterContent;
});