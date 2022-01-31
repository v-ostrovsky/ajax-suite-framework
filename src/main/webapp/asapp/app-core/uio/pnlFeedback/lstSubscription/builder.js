define(['as', './class', 'text!./template.htpl', './entry/builder'], function(as, Class, template, entryBuilder) {
	"use strict";

	function list(context, path, propertiesExt) {

		var properties = Object.assign(propertiesExt, {
			template: template,
			entryBuilder: entryBuilder,
			sortFields: [{
				name: 'textId',
				comparator: as.locale.localeCompare.bind(null, 'string')
			}],
			messaging: as.firebaseMessaging,
			onPermissionDeniedMessage: {
				title: as.locale.form.titleWarn,
				text: as.locale.subscriptions.warning
			}
		});

		return as.generics.listSubscriptions.builder(context, path, properties, Class);
	}

	return list;
});