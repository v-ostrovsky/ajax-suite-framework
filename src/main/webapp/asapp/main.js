//define([ 'ajax-suite/main' ], function() {
define([ '../lib/as.min' ], function() {
	"use strict";

	var appRequire = require.config({
		urlArgs : 'bust=v1.0.0'
	});

	appRequire([ 'as', 'i18n!application/config/nls/root', 'application/config/icons/dir', 'application/shared/dao/dir', 'application/shared/uio/dir', 'application/body/builder' ], function(as, locale, icons, dao, uio, bodyBuilder) {
		Object.assign(as.icons, icons);
		Object.assign(as.locale, locale);
		Object.assign(as.dao, dao);
		as.uio = uio;

		require([ 'css!application/config/css/style', 'css!application/config/css/editor' ], function() {
			console.log('application', bodyBuilder());
		});
	});
});