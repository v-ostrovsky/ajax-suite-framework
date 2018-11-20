define([ 'css!./config/css/style', 'i18n!nls/root', 'icons/dir', 'dao/dir', 'fore/dir', 'plugins/dir' ], function(css, locale, icons, dao, fore, plugins) {
	"use strict";

	return {
		locale : locale,
		icons : icons,
		dao : dao,
		generics : fore,
		plugins : plugins
	};
});