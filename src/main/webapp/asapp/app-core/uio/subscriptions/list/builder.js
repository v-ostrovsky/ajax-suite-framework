define(['as', './class', 'text!./template.htpl', './entry/builder', 'i18n!ajax-suite/config/nls/root'], function(as, Class, template, entryBuilder, locale) {
	"use strict";

	function list(context, path) {
		var properties = {
			template: template,
			entryBuilder: entryBuilder,
			daoBuilder: as.dao['fcmSubscriptions'],
			filter: '&forms=newsfeed&forms=adminFeedback',
			sortFields: [{
				name: 'textId',
				comparator: as.locale.localeCompare.bind(null, 'string')
			}],
			messaging: as.firebaseMessaging,
			onPermissionDeniedMessage: {
				title: as.locale.form.titleWarn,
				text: as.locale.subscriptions.warning
			}
		};

		return as.generics.listSubscriptions.builder(context, path, properties, Class);
	}

	return list;
});