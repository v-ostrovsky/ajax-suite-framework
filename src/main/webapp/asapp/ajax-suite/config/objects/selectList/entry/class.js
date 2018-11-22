define([ 'core/Entry' ], function(Entry) {
	"use strict";

	/*
	 * ------------- CUSTOM LIST ENTRY CLASS --------------
	 */
	function CustomListEntry(context, template) {
		Entry.call(this, context, template);
	}
	CustomListEntry.prototype = Object.create(Entry.prototype);
	CustomListEntry.prototype.constructor = CustomListEntry;

	CustomListEntry.prototype.setActiveStatus = function(state) {
		this.controls['textId'].element.toggleClass('control-active', [ 'active' ].includes(state));
		this.controls['textId'].element.toggleClass('control-inactive', [ 'inactive' ].includes(state));

		return Entry.prototype.setActiveStatus.call(this, state);
	}

	return CustomListEntry;
});