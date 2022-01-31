define(['as', './class', 'text!./template.htpl'], function(as, Class, template) {
	"use strict";

	function entry(context, path, attributes) {

		var controls = [].concat(['textId'].map(function(item) {
			var properties = {};

			return {
				name: item,
				builder: as.utils.bindBuilder('*/' + item, as.generics.field.builder, properties)
			};
		})).concat(['chrome', 'telegram'].map(function(item) {
			var properties = {
				disabled: (['chrome'].includes(item) && !("Notification" in window)) || ['telegram'].includes(item),
				visible: !['telegram'].includes(item)
			};

			return {
				name: item,
				builder: as.utils.bindBuilder('*/' + item, as.generics.buttonCheckbox.builder, properties)
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