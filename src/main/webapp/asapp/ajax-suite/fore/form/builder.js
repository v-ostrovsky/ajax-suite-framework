define([ './class', '../primitive/button/builder', 'i18n!ajax-suite/config/nls/root' ], function(Form, button, locale) {
	"use strict";

	function form(context, path, properties, Class) {

		properties.controls = properties.controls.concat([ 'submit' ].map(function(item) {
			var props = {
				defaultValue : locale.form[item],
				handler : function(self) {
					self.context.submit(properties.onOk, properties.onWarn);
				}
			};

			return {
				name : item,
				builder : function(context) {
					return button(context, '*/' + item, props || {});
				}
			};
		}));

		var form = new (Class || Form)(context, path, properties.template).setContent(properties.controls).fillContent(properties.attributes || {});
		(properties.visible !== undefined) ? form.setVisibility(properties.visible) : null;
		(properties.header !== undefined) ? form.send('setHeader', properties.header) : null;

		return form;
	}

	return form;
});