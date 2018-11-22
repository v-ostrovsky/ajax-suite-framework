define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.panel.Class;

	/*
	 * ------------- APPLICATION CONTENT PANEL CLASS --------------
	 */
	function Panel(context, name, template) {
		Class.call(this, context, name, template);
	}
	Panel.prototype = Object.create(Class.prototype);
	Panel.prototype.constructor = Panel;

	Panel.prototype.setValue = function(value) {
		this.controls['tree'].setValue(value);
		return this;
	}

	Panel.prototype.getValue = function() {
		return this.controls['tree'].getValue();
	}

	return Panel;
});