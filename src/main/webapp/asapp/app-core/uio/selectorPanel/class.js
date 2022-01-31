define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.panel.Class;

	function Panel(context, path, template) {
		Class.call(this, context, path, template);
	}
	Panel.prototype = Object.create(Class.prototype);
	Panel.prototype.constructor = Panel;

	Panel.prototype.on = function(control, eventType, data) {
		if ([ 'control:changed' ].includes(eventType) && Object.keys(this.controls).includes(control.name)) {
			this.setValue(control.name).send('item:selected', data);
			return false;
		}
		if ([ 'control:tabulate', 'control:escape' ].includes(eventType) && (control.context === this)) {
			this.send(eventType, data);
			return false;
		}

		return Class.prototype.on.call(this, control, eventType, data);
	}

	Panel.prototype.getItem = function(value) {
		return (value !== undefined) ? this.controls[value] : this.activeElement;
	}

	Panel.prototype.execute = function(callback) {
		callback([], this);
		return this;
	}

	Panel.prototype.setValue = function(value) {
		this.activeElement = this.getItem(value);
		Object.keys(this.controls).forEach(function(key) {
			this.getItem(key).element.toggleClass('button-pressed', (key === value));
		}.bind(this));

		return this;
	}

	Panel.prototype.getValue = function() {
		return this.getItem() ? this.getItem().name : null;
	}

	return Panel;
});