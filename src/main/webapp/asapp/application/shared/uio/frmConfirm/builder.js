define([ 'as', './class', 'text!./template.htpl' ], function(as, Form, template) {
	"use strict";

	function form(context, name, propertiesExt, Class) {

		var controls = [].concat([ 'message' ].map(function(item) {
			var properties = {
				text : propertiesExt.message
			};

			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, as.generics.label.builder, properties)
			};
		})).concat([ 'no' ].map(function(item) {
			if (typeof propertiesExt.onNo === 'function') {
				var properties = {
					defaultValue : as.locale.form.no,
					handler : function(self) {
						self.context.send('execute', 'destroy');
						propertiesExt.onNo(self.context);
					}
				};

				return {
					name : item,
					builder : as.generics.bindBuilder('*/' + item, as.generics.button.builder, properties)
				};
			} else {
				return {
					name : item,
					builder : function(context) {
						return as.generics.bindBuilder('*/' + item, as.generics.control.builder)(context).setVisibility(false);
					}
				};
			}
		}));

		var properties = {
			template : template,
			controls : controls,
			attributes : propertiesExt.attributes,
			onSubmit : propertiesExt.onSubmit,
			header : propertiesExt.header
		};

		return as.generics.form.builder(context, name, properties, (Class || Form));
	}

	return form;
});