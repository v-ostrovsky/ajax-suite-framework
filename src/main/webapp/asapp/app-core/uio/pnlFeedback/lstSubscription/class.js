define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.listSubscriptions.Class;

	/*
	 * ------------- SUBSCRIPTION LIST CLASS --------------
	 */
	function List(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	List.prototype = Object.create(Class.prototype);
	List.prototype.constructor = List;

	List.prototype.require = function() {
		return this.setContent(as.dao['fcmSubscriptions'], '&forms=adminFeedback');
	}

	return List;
});