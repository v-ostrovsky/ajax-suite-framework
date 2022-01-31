define(['./class', '../builder'], function(Input, primitiveBuilder) {
	"use strict";

	function input(context, path, properties, Class) {
		var input = primitiveBuilder(context, path, properties, (Class || Input));
		var handler = (typeof properties.handler === 'function') ? properties.handler.bind(context) : ((typeof context[input.name] === 'function') ? context[input.name].bind(context) : null);
		(typeof handler === 'function') ? input.setHandler(handler) : null;
		(typeof properties.inputMaskBuilder === 'function') ? input.setInputMask(properties.inputMaskBuilder) : null;

		return input;
	}

	return input;
});