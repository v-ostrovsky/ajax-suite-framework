define([ './class' ], function(ButtonToggle) {
	"use strict";

	function buttonToggle(context, name, properties, Class) {
		var arr = name.split('/'), method = arr[arr.length - 1], handler = (typeof properties.handler === 'function') ? properties.handler.bind(context) : (context[method] ? context[method].bind(context) : function() {});
		var buttonToggle = new (Class || ButtonToggle)(context, name, handler, properties.tooltip, properties.image);
		(properties.defaultValue != undefined) ? buttonToggle.setValue(properties.defaultValue) : null;
		buttonToggle.toggle(properties.defaultState);

		return buttonToggle;
	}

	return buttonToggle;
});