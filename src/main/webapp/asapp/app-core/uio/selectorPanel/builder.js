define([ 'as', './class', 'text!./template.htpl' ], function(as, Class, template) {
	"use strict";

	function panel(context) {

		var properties = {
			template : 'create:' + template
		};

		return as.generics.panel.builder(context, '', properties, Class);
	}

	return panel;
});