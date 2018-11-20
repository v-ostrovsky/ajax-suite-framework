define([ 'core/Entry' ], function(Entry) {
	"use strict";

	/*
	 * ------------- CUSTOM TREE ENTRY CLASS --------------
	 */
	function CustomTreeEntry(context, template) {
		Entry.call(this, context, template);
	}
	CustomTreeEntry.prototype = Object.create(Entry.prototype);
	CustomTreeEntry.prototype.constructor = CustomTreeEntry;

	CustomTreeEntry.prototype.setActiveStatus = function(state) {
		this.controls['textId'].element.toggleClass('button-active', [ 'active' ].includes(state));
		this.controls['textId'].element.toggleClass('button-inactive', [ 'inactive' ].includes(state));

		return Entry.prototype.setActiveStatus.call(this, state);
	}

	return CustomTreeEntry;
});