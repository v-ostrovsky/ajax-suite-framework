define(['./Panel'], function(Panel) {
	"use strict";

	/*
	 * ------------- FORM CLASS --------------
	 */
	function Form(context, path, template) {
		Panel.call(this, context, path, template);

		this.isChanged = false;
	}
	Form.prototype = Object.create(Panel.prototype);
	Form.prototype.constructor = Form;

	Form.prototype._forEach_ = function(handler) {
		for (var item in this.attributes) {
			if (this.controls[item]) {
				var result = handler(item);
				if (result !== undefined) {
					return result;
				}
			}
		}
	}

	Form.prototype._hasStatus_ = function(status) {
		return !!Object.values(this.validationStatuses).filter(function(value) {
			return (value === status);
		}).length;
	}

	Form.prototype.fillContent = function(attributes) {
		this.attributes = Object.assign({}, attributes);
		Object.keys(this.controls).sort(function(aKey, bKey) {
			var aIndex = this.controls[aKey].calculator ? this.controls[aKey].calculator.index : -1, bIndex = this.controls[bKey].calculator ? this.controls[bKey].calculator.index : -1;
			return (aIndex - bIndex);
		}.bind(this)).forEach(function(item) {
			if (this.attributes[item] !== undefined) {
				this.controls[item].setValue(this.attributes[item]);
			} else if (this.controls[item].calculator) {
				this.controls[item].setValue(this.controls[item].getValue());
			}
		}.bind(this));

		return this;
	}

	Form.prototype.submit = function(onOk, onWarn) {
		this.validationStatuses = {};
		this._forEach_(function(item) {
			this.validationStatuses[item] = (typeof this.controls[item].validate === 'function') ? this.controls[item].validate() : 'ok';

			if (this.attributes[item] !== this.controls[item].getValue()) {
				this.attributes[item] = this.controls[item].getValue();
				this.isChanged = true;
			}
		}.bind(this));

		if (!this._hasStatus_('error')) {
			if (!this._hasStatus_('warn')) {
				(typeof onOk === 'function') ? onOk(this) : null;
			} else {
				(typeof onWarn === 'function') ? onWarn(this) : null;
			}
		}

		return this;
	}

	Form.prototype.cancel = function(handler) {
		this.fillContent(this.attributes);
		(typeof handler === 'function') ? handler(this) : null;

		return this;
	}

	return Form;
});