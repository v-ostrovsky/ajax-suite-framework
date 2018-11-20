define([ 'core/Entry' ], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC ENTRY CLASS --------------
	 */
	function Entry(context, template) {
		Class.call(this, context, template);
	}
	Entry.prototype = Object.create(Class.prototype);
	Entry.prototype.constructor = Entry;

	Entry.prototype.setActiveStatus = function(state) {
		this.contextmenuItems.forEach(function(menuItem) {
			menuItem.disabled = ![ 'active', 'inactive' ].includes(state);
		});

		return Class.prototype.setActiveStatus.call(this, state);
	}

	return Entry;
});