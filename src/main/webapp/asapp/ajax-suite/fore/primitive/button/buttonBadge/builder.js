define([ './class', '../builder' ], function(ButtonBadge, buttonBuilder) {
	"use strict";

	function buttonBadge(context, path, properties, Class) {
		return buttonBuilder(context, path, properties, (Class || ButtonBadge));
	}

	return buttonBadge;
});