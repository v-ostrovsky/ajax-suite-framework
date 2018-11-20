define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.panel.Class;

	/*
	 * ------------- USERS PANEL CLASS --------------
	 */
	function Panel(context, name, template) {
		Class.call(this, context, name, template);
	}
	Panel.prototype = Object.create(Class.prototype);
	Panel.prototype.constructor = Panel;

	Panel.prototype.getDefaultActiveElement = function() {
		return this.controls['table'];
	}

	return Panel;
});