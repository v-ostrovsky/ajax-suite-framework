define(['as', './class', 'text!./template.htpl'], function(as, Class, template) {
	"use strict";

	function entry(context, path, attributes) {

		function formatter(fieldName) {
			var type = 'string';

			if (['time'].includes(fieldName)) {
				type = 'date(long)';
			}

			return as.locale.formatter.bind(null, type);
		}

		var controls = [].concat(['time', 'userText'].map(function(item) {
			var properties = {
				formatter: formatter(item)
			};

			return {
				name: item,
				builder: as.utils.bindBuilder('*/' + item, as.generics.field.builder, properties)
			};
		})).concat(['content'].map(function(item) {
			return {
				name: item,
				builder: as.utils.bindBuilder('*/' + item, as.generics.textContent.builder)
			};
		}));

		var properties = {
			template: template,
			controls: controls,
			attributes: attributes
		};

		return as.generics.entry.builder(context, path, properties, Class);
	}

	return entry;
});