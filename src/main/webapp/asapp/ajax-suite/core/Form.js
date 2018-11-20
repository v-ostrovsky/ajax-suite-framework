define([ './Panel' ], function(Panel) {
	"use strict";

	/*
	 * ------------- FORM CLASS --------------
	 */
	function Form(context, name, template) {
		Panel.call(this, context, name, template);
	}
	Form.prototype = Object.create(Panel.prototype);
	Form.prototype.constructor = Form;

	Form.prototype._forEach_ = function(handler) {
		for ( var item in this.attributes) {
			if (this.controls[item]) {
				var result = handler(item);
				if (result != undefined) {
					return result;
				}
			}
		}
	}

	Form.prototype.fillContent = function(attributes) {
		this.attributes = Object.assign({}, attributes);
		for ( var item in this.controls) {
			if (this.attributes[item] != undefined) {
				this.controls[item].setValue(this.attributes[item]);
			}
		}

		return this.submit();
	}

	Form.prototype.isChanged = function() {
		return this._forEach_(function(item) {
			if (this.attributes[item] != this.controls[item].getValue()) {
				return true;
			}
		}.bind(this)) || false;
	}

	Form.prototype.submit = function(handler) {
		this._forEach_(function(item) {
			this.attributes[item] = this.controls[item].getValue();
		}.bind(this));

		(typeof handler === 'function') ? handler(this) : null;

		return this;
	}

	Form.prototype.cancel = function(handler) {
		this.fillContent(this.attributes);

		(typeof handler === 'function') ? handler(this) : null;

		return this;
	}

	return Form;
});