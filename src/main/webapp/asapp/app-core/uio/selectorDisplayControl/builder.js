define([ 'as', './class', 'text!./template.htpl' ], function(as, Class, template) {
	"use strict";

	function control(context, propertiesExt) {

		var properties = {
			template : 'create:' + template,
			content : propertiesExt.content
		};

		var control = as.generics.control.builder(context, '', properties, Class);
		(properties.content !== undefined) ? control.setView(properties.content) : null;
		return control;
	}

	return control;
});