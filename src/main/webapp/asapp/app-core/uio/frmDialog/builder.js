define(['as', './class', 'text!./template.htpl'], function(as, Class, template) {
	"use strict";

	function form(context, path, propertiesExt) {
		context.handle.btnClose.setVisibility(false);

		var controls = [].concat(['message'].map(function(item) {
			var properties = {
				text: propertiesExt.message
			};

			return {
				name: item,
				builder: as.utils.bindBuilder('*/' + item, as.generics.label.builder, properties)
			};
		})).concat(['no'].map(function(item) {
			var properties = {
				content: as.locale.form.no,
				handler: function(self) {
					self.context.send('control:destroy');
					propertiesExt.onNo(self.context);
				},
				supress: (typeof propertiesExt.onNo !== 'function')
			};

			return {
				name: item,
				builder: as.utils.bindBuilder('*/' + item, as.generics.button.builder, properties)
			};
		}));

		var properties = Object.assign(propertiesExt, {
			template: template,
			controls: controls,
			onOk: propertiesExt.onOk,
			header: propertiesExt.header
		});

		return as.generics.form.builder(context, path, properties, Class);
	};

	return form;
});