define(['./class', '../builder'], function(SelectorBox, primitiveBuilder) {
	"use strict";

	function selectorBox(context, path, properties, Class) {
		var selectorBox = primitiveBuilder(context, path, properties, (Class || SelectorBox));
		(typeof properties.selectorBuilder === 'function') ? selectorBox.setSelector(properties.selectorBuilder) : null;
		var handler = (typeof properties.handler === 'function') ? properties.handler.bind(context) : ((typeof context[selectorBox.name] === 'function') ? context[selectorBox.name].bind(context) : null);
		(typeof handler === 'function') ? selectorBox.setHandler(properties.handler) : null;

		return selectorBox;
	}

	return selectorBox;
});