define(['as', './class', 'text!./template.htpl'], function(as, Class, template) {
	"use strict";

	function entry(context, path, attributes) {

		var controls = [].concat(['chrome'].map(function(item) {
			var properties = {
				text: as.locale.subscriptions.feedbackPanel[item],
				disabled: !("Notification" in window)
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