define([ './class', '../builder' ], function(RouterNotifications, routerBuilder) {
	"use strict";

	function routerNotifications(context, path, properties, Class) {
		return routerBuilder(context, path, properties, (Class || RouterNotifications));
	}

	return routerNotifications;
});