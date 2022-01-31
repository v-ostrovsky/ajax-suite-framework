define([ 'ajax-suite/core/primitives/@dir' ], function(primitives) {
	"use strict";

	var Class = primitives.SelectorDropdown;

	/*
	 * ------------- GENEGIC SELECTOR DDROPDOWN CLASS --------------
	 */
	function SelectorDropdown(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	SelectorDropdown.prototype = Object.create(Class.prototype);
	SelectorDropdown.prototype.constructor = SelectorDropdown;

	SelectorDropdown.prototype.execute = function(callback) {
		this.selector.execute(function(response) {
			callback(response, this);
		}.bind(this));

		return this;
	}

	SelectorDropdown.prototype.setValue = function(value) {
		return this.execute(function(response) {
			Class.prototype.setValue.call(this, (typeof value === 'function') ? value(response) : value);
		}.bind(this));
	}

	return SelectorDropdown;
});