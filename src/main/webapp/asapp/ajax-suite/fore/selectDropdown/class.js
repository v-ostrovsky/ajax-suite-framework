define([ 'core/SelectDropdown', 'core/primitives' ], function(Class, primitives) {
	"use strict";

	/*
	 * ------------- GENEGIC SELECT DDROPDOWN CLASS --------------
	 */
	function SelectDropdown(context, name, dataProcessor) {
		Class.call(this, context, name);
	}
	SelectDropdown.prototype = Object.create(Class.prototype);
	SelectDropdown.prototype.constructor = SelectDropdown;

	SelectDropdown.prototype.setActiveStatus = function(state) {
		this.input.element.toggleClass('control-active', [ 'active' ].includes(state));
		return Class.prototype.setActiveStatus.call(this, state);
	}

	SelectDropdown.prototype.setContent = function(data) {
		if (typeof data.execute === 'function') {
			this.dao = data.execute(function(response) {
				Class.prototype.setContent.call(this, response);
				if (this.getValue()) {
					this.setValue(this.value);
					if (this.isActive) {
						this.input.setSelectionRange();
					}
				}
			}.bind(this));
		} else {
			Class.prototype.setContent.call(this, data);
		}

		return this;
	}

	SelectDropdown.prototype.execute = function(callback) {
		if (this.dao) {
			this.dao = this.dao.execute(function(response) {
				callback.call(this, this.dropdown.content.getData());
			}.bind(this));
		} else {
			callback.call(this, this.dropdown.content.getData());
		}

		return this;
	}

	SelectDropdown.prototype.setValue = function(value) {
		if (this.dropdown.content && this.dropdown.content.collection) {
			Class.prototype.setValue.call(this, value);
		} else {
			this.value = value;
		}

		return this;
	}

	SelectDropdown.prototype.setLabel = function(text) {
		if (text) {
			this.label = new primitives.Label(this.context, '*/' + this.name + '-label', text);
		}

		return this;
	}

	return SelectDropdown;
});