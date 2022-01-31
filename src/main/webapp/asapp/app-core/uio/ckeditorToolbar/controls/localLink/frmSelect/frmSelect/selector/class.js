define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.list.Class;

	function List(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	List.prototype = Object.create(Class.prototype);
	List.prototype.constructor = List;

	List.prototype.getItem = function(value) {
		return (value !== undefined) ? this.getEntryById(value) : this.activeElement;
	}

	return List;
});