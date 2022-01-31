define(['./class', '../builder'], function(SelectorDropdown, primitiveBuilder) {
	"use strict";

	function selectorDropdown(context, path, properties, Class) {
		var selectorDropdown = primitiveBuilder(context, path, properties, (Class || SelectorDropdown));
		(typeof properties.displayBuilder === 'function') ? selectorDropdown.setDisplay(properties.displayBuilder) : null;
		(typeof properties.selectorBuilder === 'function') ? selectorDropdown.setSelector(properties.selectorBuilder, properties.updown) : null;
		(properties.withClear === true) ? selectorDropdown.showClear() : null;
		var handler = (typeof properties.handler === 'function') ? properties.handler.bind(context) : ((typeof context[selectorDropdown.name] === 'function') ? context[selectorDropdown.name].bind(context) : null);
		(typeof handler === 'function') ? selectorDropdown.setHandler(properties.handler) : null;

		return selectorDropdown;
	}

	return selectorDropdown;
});