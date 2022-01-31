define(['as', './class', 'text!./template.htpl'], function(as, Class, template) {
	"use strict";

	function entry(context, path, attributes, viewBuilder) {

		var controls = ['textId'].map(function(item) {
			return {
				name: item,
				builder: function(context) {
					return viewBuilder(context, '*/' + item).setHandler(function(self) {
						self.context.focus().send('item:selected');
					}).setVisibility(attributes[item]);
				}
			};
		});

		var properties = {
			template: template,
			controls: controls,
			attributes: attributes
		};

		return as.generics.entry.builder(context, path, properties, Class);
	}

	return entry;
});