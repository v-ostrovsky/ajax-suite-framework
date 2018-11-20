define([ './Form' ], function(Form) {
	"use strict";

	/*
	 * ------------- ENTRY CLASS --------------
	 */
	function Entry(context, template) {
		Form.call(this, context, '*/' + context.container.attr('name'), 'create:' + template);
	}
	Entry.prototype = Object.create(Form.prototype);
	Entry.prototype.constructor = Entry;

	Entry.prototype.on = function(control, eventType, data) {
		if ([ 'control:tabulate' ].includes(eventType) && (control.context === this)) {
			this.root.send(eventType, data);
			return false;
		}
		if ([ 'control:into', 'control:updown', 'control:escape' ].includes(eventType) && (control.context === this)) {
			this.send(eventType, data);
			return false;
		}

		return Form.prototype.on.call(this, control, eventType, data);
	}

	Entry.prototype.getText = function() {
		return this.tabLoop[0].getValue();
	}

	Entry.prototype.getValue = function() {
		return this.attributes.id;
	}

	return Entry;
});