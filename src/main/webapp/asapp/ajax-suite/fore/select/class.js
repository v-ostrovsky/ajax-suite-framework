define([ 'core/Select', 'core/primitives' ], function(Class, primitives) {
	"use strict";

	/*
	 * ------------- GENEGIC SELECT CLASS --------------
	 */
	function Select(context, name, dataProcessor) {
		Class.call(this, context, name);
	}
	Select.prototype = Object.create(Class.prototype);
	Select.prototype.constructor = Select;

	Select.prototype.setActiveStatus = function(state) {
		this.element.toggleClass('control-active', [ 'active' ].includes(state));
		return Class.prototype.setActiveStatus.call(this, state);
	}

	Select.prototype.setContent = function(data) {
		if (typeof data.execute === 'function') {
			this.dao = data.execute(function(response) {
				Class.prototype.setContent.call(this, response);
				if (this.getValue()) {
					this.setValue(this.value);
				}
			}.bind(this));
		} else {
			Class.prototype.setContent.call(this, data);
		}

		return this;
	}

	Select.prototype.execute = function(callback) {
		if (this.dao) {
			this.dao = this.dao.execute(function(response) {
				callback.call(this, this.content.getData());
			}.bind(this));
		} else {
			callback.call(this, this.content.getData());
		}

		return this;
	}

	Select.prototype.setValue = function(value) {
		if (this.content && this.content.collection) {
			Class.prototype.setValue.call(this, value);
		} else {
			this.value = value;
		}

		return this;
	}

	Select.prototype.setLabel = function(text) {
		if (text) {
			this.label = new primitives.Label(this.context, '*/' + this.name + '-label', text);
		}

		return this;
	}

	return Select;
});