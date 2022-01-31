define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.tree.Class;

	function Tree(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	Tree.prototype = Object.create(Class.prototype);
	Tree.prototype.constructor = Tree;

	Tree.prototype.on = function(control, eventType, data) {
		if ([ 'item:selected', 'control:tabulate', 'control:escape' ].includes(eventType) && (control.root === this)) {
			this.send(eventType, data);
			return false;
		}

		return Class.prototype.on.call(this, control, eventType, data);
	}

	Tree.prototype.getDefaultActiveElement = function() {
		return this.entry;
	}

	Tree.prototype.getItem = function(value) {
		return (value !== undefined) ? this.getEntryById(value) : this.activeElement;
	}

	return Tree;
});