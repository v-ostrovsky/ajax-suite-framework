define([ 'as', './class', 'text!./template.htpl' ], function(as, Class, template) {
	"use strict";

	function content(context, name) {
		var properties = {
			template : template
		};

		return as.generics.control.builder(context, name, properties, Class);
	}

	return content;
});