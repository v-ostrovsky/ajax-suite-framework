define([ 'ajax-suite/core/primitives/@dir' ], function(primitives) {
	"use strict";

	var Class = primitives.SelectorBox;

	/*
	 * ------------- GENEGIC SELECTOR BOX CLASS --------------
	 */
	function SelectorBox(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	SelectorBox.prototype = Object.create(Class.prototype);
	SelectorBox.prototype.constructor = SelectorBox;

	SelectorBox.prototype.execute = function(callback) {
		this.selector.execute(function(response) {
			callback(response, this);
		}.bind(this));

		return this;
	}

	SelectorBox.prototype.setValue = function(value) {
		return this.execute(function(response) {
			Class.prototype.setValue.call(this, (typeof value === 'function') ? value(response) : value);
		}.bind(this));
	}

	return SelectorBox;
});