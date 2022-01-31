define(['as', './class'], function(as, TextContent) {
	"use strict";

	function textContent(context, path, properties, Class) {
		return as.generics.control.builder(context, path, properties, Class || TextContent);
	}

	return textContent;
});