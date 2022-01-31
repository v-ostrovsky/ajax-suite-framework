define([ 'as', './class', 'text!./template.htpl' ], function(as, Class, template) {
	"use strict";

	function form(context, path, propertiesExt) {

		var controls = [].concat([ 'href' ].map(function(item) {
			var properties = {
				text : as.locale.editor['localLink'].selectForm[item],
				selectorBuilder : function(context) {
					var tree = as.utils.syncSelectors.tree(propertiesExt.data)(context);
					tree.forEach(function(entry) {
						entry.controls['textId'].element.css({
							'white-space' : 'normal'
						});
					});

					return tree;
				}
			};

			return {
				name : item,
				builder : as.utils.bindBuilder('*/' + item, as.generics.selectorBox.builder, properties)
			};
		})).concat([ 'subhref' ].map(function(item) {
			var properties = {
				visible : false
			};

			return {
				name : item,
				builder : as.utils.bindBuilder('*/' + item, as.generics.field.builder, properties)
			};
		}));

		var properties = Object.assign(propertiesExt, {
			template : template,
			controls : controls,
			header : as.locale.editor['localLink'].selectForm.title
		});

		return as.generics.form.builder(context, path, properties, Class);
	}

	return form;
});