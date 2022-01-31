define(['./Button'], function(Button) {
	"use strict";

	/*
	 * ------------- BUTTON CHECKBOX CLASS --------------
	 */
	function ButtonCheckbox(context, path, template, parameters) {
		Button.call(this, context, path, template, parameters);

		this.element.addClass('checkbox');

		this.formatter = function(value) {
			return value ? '&#x2713' : ''
		}

		this.setValue(false);

		this.element.on({
			keydown: function(event) {
				if ([32].includes(event.which)) {
					!this.isDisabled() ? this.fire() : null;
				}
			}.bind(this),
			mousedown: function(event) {
				(((event.which || 1) === 1) && !this.isDisabled()) ? this.focus() : null;
			}.bind(this)
		});
	}
	ButtonCheckbox.prototype = Object.create(Button.prototype);
	ButtonCheckbox.prototype.constructor = ButtonCheckbox;

	ButtonCheckbox.prototype.fire = function(data) {
		this.setValue(!this.getValue());
		return Button.prototype.fire.call(this, data);
	}

	return ButtonCheckbox;
});