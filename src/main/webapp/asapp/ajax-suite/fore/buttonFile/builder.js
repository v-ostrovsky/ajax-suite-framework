define([ './class' ], function(ButtonFile) {
	"use strict";

	function buttonFile(context, name, properties, Class) {
		var arr = name.split('/'), method = arr[arr.length - 1], handler = (typeof properties.handler === 'function') ? properties.handler.bind(context) : (context[method] ? context[method].bind(context) : function() {});
		var buttonFile = new (Class || ButtonFile)(context, name, handler, properties.tooltip, properties.image);
		(properties.defaultValue != undefined) ? buttonToggle.buttonFile(properties.defaultValue) : null;

		return buttonFile;
	}

	return buttonFile;
});