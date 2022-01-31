define(['as', './frmSelect/builder'], function(as, formBuilder) {
	"use strict";

	var Class = as.generics.form.Class;

	/*
	 * ------------- LOCAL LINK SELECT FORM CLASS --------------
	 */
	function Form(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	Form.prototype = Object.create(Class.prototype);
	Form.prototype.constructor = Form;

	Form.prototype._showForm_ = function() {
		this.application.showDialog(as.utils.assignProperties(formBuilder, {
			attributes: {
				theme: this.controls['href'].getValue(),
				subhref: null
			},
			onOk: function(windowContent) {
				this.controls['subhref'].setValue(windowContent.controls['subhref'].getItem().attributes.code);
				windowContent.send('control:destroy');
			}.bind(this)
		}), null);
	}

	Form.prototype.on = function(control, eventType, data) {
		if (['control:changed'].includes(eventType) && ['href'].includes(control.name)) {
			['newsfeed'].includes(control.getItem().attributes.form) ? this._showForm_() : null;
			return false;
		}

		return Class.prototype.on.call(this, control, eventType, data);
	}

	return Form;
});