define([ 'as', './class', 'text!./template.htpl' ], function(as, Class, template) {
	"use strict";

	function header(context, path) {

		var controls = [].concat([ 'textId' ].map(function(item) {
			var properties = {
				text : as.locale.subscriptions.table[item]
			};

			return {
				name : item,
				builder : as.utils.bindBuilder('*/' + item, as.generics.label.builder, properties)
			};
		})).concat([ 'chrome', 'telegram' ].map(function(item) {
			var properties = {
				text : as.icons[item],
				visible : ![ 'telegram' ].includes(item)
			};

			return {
				name : item,
				builder : as.utils.bindBuilder('*/' + item, as.generics.label.builder, properties)
			};
		}));

		var properties = {
			template : template,
			controls : controls
		};

		return as.generics.panel.builder(context, path, properties, Class);
	}

	return header;
});