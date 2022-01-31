define([ 'as', './class', 'text!./template.htpl', './selector/builder' ], function(as, Class, template, selectorBuilder) {
	"use strict";

	function form(context, path, propertiesExt) {

		var controls = [].concat().concat([ 'subhref' ].map(function(item) {
			var properties = {
				text : as.locale.editor['localLink'].subSelectForm[item],
				validator : function(self) {
					return self.getValue() ? 'ok' : 'error'
				},
				selectorBuilder : function(context) {
					return selectorBuilder(context, '', propertiesExt.attributes);
				}
			};

			return {
				name : item,
				builder : as.utils.bindBuilder('*/' + item, as.generics.selectorBox.builder, properties)
			};
		}));

		var properties = Object.assign(propertiesExt, {
			template : template,
			controls : controls,
			header : as.locale.editor['localLink'].subSelectForm.title
		});

		return as.generics.form.builder(context, path, properties, Class);
	}

	return form;
});