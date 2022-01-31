define([ './class', '../builder' ], function(ButtonCheckbox, buttonBuilder) {
	"use strict";

	function buttonCheckbox(context, path, properties, Class) {
		return buttonBuilder(context, path, properties, (Class || ButtonCheckbox));
	}

	return buttonCheckbox;
});
