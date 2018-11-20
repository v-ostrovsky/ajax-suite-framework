define([ 'as', './class', 'text!./template.htpl', './pnlWhere/builder' ], function(as, Form, template, pnlWhereBuilder) {
	"use strict";

	function form(context, name, propertiesExt, Class) {

		var controls = [].concat([ 'position' ].map(function(item) {
			var entry = propertiesExt.data.find(function(item) {
				return (item.id === propertiesExt.attributes.what);
			});

			var properties = {
				text : as.locale.docs.selectForm[item].text + '<br>[ ' + entry.textId + ' ]:',
				labels : [ as.locale.docs.selectForm[item].labels.inside, as.locale.docs.selectForm[item].labels.before ]
			};

			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, as.generics.radio.builder, properties)
			};
		})).concat([ 'where' ].map(function(item) {
			return {
				name : item,
				builder : function(context) {
					return pnlWhereBuilder(context, '*/' + item, propertiesExt.data);
				}
			};
		}));

		var properties = {
			template : template,
			controls : controls,
			attributes : propertiesExt.attributes,
			onSubmit : propertiesExt.onSubmit,
			header : as.locale.form.titleSelect
		};

		return as.generics.form.builder(context, name, properties, (Class || Form));
	}

	return form;
});