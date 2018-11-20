define([ './class', '../button/builder', 'i18n!nls/root' ], function(Form, button, locale) {
	"use strict";

	function form(context, name, properties, Class) {

		properties.controls = properties.controls.concat([ 'submit' ].map(function(item) {
			var props = {
				defaultValue : locale.form[item],
				handler : function(self) {
					self.context.send('execute', 'destroy');
					return self.context.submit(properties.onSubmit);
				}
			};

			return {
				name : item,
				builder : function(context) {
					return button(context, '*/' + item, props || {});
				}
			};
		}));

		return new (Class || Form)(context, name, properties.template).setContent(properties.controls).fillContent(properties.attributes).send('setHeader', properties.header || '');
	}

	return form;
});