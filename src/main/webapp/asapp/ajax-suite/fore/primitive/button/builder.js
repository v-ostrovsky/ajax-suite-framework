define(['./class', '../builder'], function(Button, primitiveBuilder) {
	"use strict";

	function button(context, path, properties, Class) {
		var button = primitiveBuilder(context, path, properties, (Class || Button));
		var handler = (typeof properties.handler === 'function') ? properties.handler.bind(context) : ((typeof context[button.name] === 'function') ? context[button.name].bind(context) : null);
		(typeof handler === 'function') ? button.setHandler(handler) : null;
		(properties.content !== undefined) ? button.setView(properties.content) : null;

		return button;
	}

	return button;
});