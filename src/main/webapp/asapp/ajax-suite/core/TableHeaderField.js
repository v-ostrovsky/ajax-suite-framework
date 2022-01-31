define([ './Control' ], function(Control) {
	"use strict";

	/*
	 * ------------- TABLE HEADER FIELD CLASS --------------
	 */
	function TableHeaderField(context, path) {
		Control.call(this, context, path);

		this.isInvisible = false;

		this.element.on({
			mousedown : function(event) {
				if (event.shiftKey) {
					event.preventDefault();
				}
				if (event.which === 1) {
					this.send('field:mousedown', event);
				}
			}.bind(this)
		});
	}
	TableHeaderField.prototype = Object.create(Control.prototype);
	TableHeaderField.prototype.constructor = TableHeaderField;

	TableHeaderField.prototype.setInvisible = function(flag) {
		this.isInvisible = flag;
		return this.setVisibility(!this.isInvisible);
	}

	TableHeaderField.prototype.setValue = function(text) {
		this.title = text;
		this.element.find('label').remove();
		this.element.prepend('<label>' + this.title + '</label>');

		return this;
	}

	TableHeaderField.prototype.getValue = function() {
		return this.title;
	}

	return TableHeaderField;
});