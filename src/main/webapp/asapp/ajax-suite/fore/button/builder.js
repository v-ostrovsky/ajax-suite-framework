define([ './class' ], function(Button) {
	"use strict";

	function button(context, name, properties, Class) {
		var arr = name.split('/'), method = arr[arr.length - 1], handler = (typeof properties.handler === 'function') ? properties.handler.bind(context) : (context[method] ? context[method].bind(context) : function() {});
		var button = new (Class || Button)(context, name, handler, properties.tooltip, properties.image);
		(properties.defaultValue != undefined) ? button.setValue(properties.defaultValue) : null;

		return button;
	}

	return button;
});