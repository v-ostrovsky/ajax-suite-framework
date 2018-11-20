//define([ 'ajax-suite/main' ], function() {
define([ '../lib/as.min' ], function() {
	"use strict";

	var appRequire = require.config({
		urlArgs : 'bust=v1.1.2'
	});

	appRequire([ 'as', 'i18n!application/config/nls/root', 'application/config/icons/dir', 'application/shared/dao/dir', 'application/shared/uio/dir', 'application/body/builder' ], function(as, locale, icons, dao, uio, bodyBuilder) {
		Object.assign(as.icons, icons);
		Object.assign(as.locale, locale);
		Object.assign(as.dao, dao);
		as.uio = uio;

		require([ 'css!application/config/css/style' ], function() {
			console.log('application', bodyBuilder());
		});
	});
});