define(['./class', '../builder'], function(Link, primitiveBuilder) {
	"use strict";

	function link(context, path, properties, Class) {
		var link = primitiveBuilder(context, path, properties, (Class || Link));
		var handler = (typeof properties.handler === 'function') ? properties.handler.bind(context) : ((typeof context[link.name] === 'function') ? context[link.name].bind(context) : null);
		(typeof handler === 'function') ? link.setHandler(handler) : null;
		(properties.href !== undefined) ? link.setHref(properties.href) : null;

		return link;
	}

	return link;
});