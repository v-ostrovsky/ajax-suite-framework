define(['as', './application/@dir', './listSubscriptions/@dir', './router/@dir', './router/routerNotifications/@dir', './routerContent/@dir', './routerDirectory/@dir', './textContent/@dir'],
	function(as, application, listSubscriptions, router, routerNotifications, routerContent, routerDirectory, textContent) {
		"use strict";

		return Object.assign(as.generics, {
			coreApplication: application,
			listSubscriptions: listSubscriptions,
			router: router,
			routerNotifications: routerNotifications,
			routerContent: routerContent,
			routerDirectory: routerDirectory,
			textContent: textContent
		});
	});