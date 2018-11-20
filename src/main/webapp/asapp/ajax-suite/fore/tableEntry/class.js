define([ 'core/TableEntry' ], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC TABLE ENTRY CLASS --------------
	 */
	function TableEntry(context, template, handleBuilder) {
		Class.call(this, context, template, handleBuilder);
	}
	TableEntry.prototype = Object.create(Class.prototype);
	TableEntry.prototype.constructor = TableEntry;

	TableEntry.prototype.setActiveStatus = function(state) {
		this.element.toggleClass('table-row-active', [ 'active' ].includes(state));
		this.element.toggleClass('table-row-inactive', [ 'inactive' ].includes(state));

		this.contextmenuItems.forEach(function(menuItem) {
			menuItem.disabled = ![ 'active', 'inactive' ].includes(state);
		});

		return Class.prototype.setActiveStatus.call(this, state);
	}

	return TableEntry;
});