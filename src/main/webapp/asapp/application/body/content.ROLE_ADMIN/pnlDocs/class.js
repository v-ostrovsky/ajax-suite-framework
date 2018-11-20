define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.panel.Class;

	/*
	 * ------------- DOCUMENTS PANEL CLASS --------------
	 */
	function Panel(context, name, template) {
		Class.call(this, context, name, template);
	}
	Panel.prototype = Object.create(Class.prototype);
	Panel.prototype.constructor = Panel;

	Panel.prototype.on = function(control, eventType, data) {
		if ([ 'control:tabulate' ].includes(eventType) && (control.context === this)) {
			this.send(eventType, data);
			return false;
		}
		if ([ 'crud:execute' ].includes(eventType)) {
			this.controls['tree'][data]();
			return false;
		}
		if ([ 'control:changed' ].includes(eventType)) {
			if (control.activeElement) {
				[ 'moveBranch', 'removeBranch' ].forEach(function(item) {
					this.controls['crud'].controls[item].setVisibility(control.activeElement.attributes.code);
				}.bind(this));
			}
		}

		return Class.prototype.on.call(this, control, eventType, data);
	}

	Panel.prototype.setActiveStatus = function(state) {
		this.element.toggleClass('control-active', [ 'active' ].includes(state));
		return Class.prototype.setActiveStatus.call(this, state);
	}

	Panel.prototype.getDefaultActiveElement = function() {
		return this.controls['tree'];
	}

	return Panel;
});