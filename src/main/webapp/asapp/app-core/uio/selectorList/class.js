define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.list.Class;

	function List(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	List.prototype = Object.create(Class.prototype);
	List.prototype.constructor = List;

	List.prototype.on = function(control, eventType, data) {
		if ([ 'item:selected', 'control:tabulate', 'control:escape' ].includes(eventType) && (control.root === this)) {
			this.send(eventType, data);
			return false;
		}

		return Class.prototype.on.call(this, control, eventType, data);
	}

	List.prototype.getDefaultActiveElement = function() {
		return this.firstEntry();
	}

	List.prototype.getItem = function(value) {
		return (value !== undefined) ? this.getEntryById(value) : this.activeElement;
	}

	return List;
});