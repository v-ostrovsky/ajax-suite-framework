define(['ajax-suite/core/Control'], function(Control) {
	'use strict';

	function pad(num, size) {
		var s = num + '';
		while (s.length < size)
			s = '0' + s;
		return s;
	}

	function assignProperties(builder, properties) {
		return function(context, path, propertiesExt) {
			return builder(context, path, Object.assign(propertiesExt, properties));
		}.bind(this);
	}

	function bindBuilder(path, builder, properties) {
		properties = properties || {};

		return function(context) {
			if (properties.supress) {
				Control.prototype.getElement(context.element, path, properties.template).remove();
				return null;
			} else {
				return builder(context, path, properties);
			}
		};
	}

	return {
		pad: pad,
		assignProperties: assignProperties,
		bindBuilder: bindBuilder
	};
});