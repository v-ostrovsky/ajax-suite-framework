define(['as', './class', 'text!./template.htpl'], function(as, Class, template) {
	"use strict";

	function entry(context, path, controls, attributes, viewBuilder) {

		var controls = controls.map(function(item) {
			return {
				name: item.name,
				builder: function(context) {
					return viewBuilder(context, '*/' + item.name).setHandler(function(self) {
						self.context.focus().send('item:selected');
					});
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