define(['as', './class', 'text!./template.htpl'], function(as, Class, template) {
	"use strict";

	function entry(context, path, attributes) {

		var controls = [].concat(['textId'].map(function(item) {
			var properties = {
				handler: function(self) {
					self.context.focus().send('item:selected');
				}
			};

			return {
				name: item,
				builder: as.utils.bindBuilder('*/' + item, as.generics.button.builder, properties)
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