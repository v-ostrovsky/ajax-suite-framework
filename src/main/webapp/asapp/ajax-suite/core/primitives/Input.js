define([ '../Primitive' ], function(Primitive) {
	"use strict";

	/*
	 * ------------- INPUT CLASS --------------
	 */
	function Input(context, path, template, parameters) {
		Primitive.call(this, context, path, template, parameters);

		this.value = null;

		this.ondropfocus(function(event) {
			this.setSelectionRange(null, null);
		}.bind(this));

		this.element.attr('autocomplete', 'off').on({
			keydown : function(event) {
				if ([ 27 ].includes(event.which)) {
					event.stopPropagation();
					if (this.backup !== undefined) {
						this.setValue(this.backup);
						this.backup = undefined;
					}
					this.setSelectionRange();
				}
			}.bind(this),
			input : function(event) {
				event.stopPropagation();
				if (this.backup === undefined) {
					this.backup = this.value;
				}
				this.send('control:input');
			}.bind(this),
			change : function(event) {
				event.stopPropagation();
				this.setValue(this.formatter(this.element.val(), this));
				this.backup = undefined;
				this.fire();
			}.bind(this)
		});
	}
	Input.prototype = Object.create(Primitive.prototype);
	Input.prototype.constructor = Input;

	Input.prototype._allowedTags = function() {
		return [ 'INPUT', 'TEXTAREA' ];
	}

	Input.prototype.setSelectionRange = function(start, finish) {
		(this.element.attr('type') !== 'date') ? this.element[0].setSelectionRange(start || 0, finish || this.element.val().length) : null;
	}

	Input.prototype.setInputMask = function(inputMaskBuilder) {
		inputMaskBuilder(this);
		return this;
	}

	Input.prototype.change = function() {
		this.element.trigger('change');
		return this;
	}

	Input.prototype.disable = function(flag) {
		this.element.prop('disabled', flag);
		return this;
	}

	Input.prototype.isDisabled = function() {
		return this.element.prop('disabled');
	}

	Input.prototype.setHandler = function(handler) {
		this.handler = handler;
		return this;
	}

	Input.prototype.fire = function() {
		this.element.removeClass('warn');
		this.element.removeClass('error');
		(typeof this.handler === 'function') ? this.handler(this) : this.send('control:changed');

		return this;
	}

	Input.prototype.validate = function() {
		(this.backup !== undefined) ? this.change() : null;

		return Primitive.prototype.validate.call(this);
	}

	Input.prototype.setValue = function(value) {
		this.value = (value === undefined) ? null : value;
		this.element.val(this.formatter(this.value, this));

		return this;
	}

	return Input;
});