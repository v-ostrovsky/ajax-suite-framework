define(['as', 'text!app-core/config/css/properties.css', 'text!app-core/config/css/style.css', 'text!app-core/config/css/editor.css', 'i18n!app-core/config/nls/root', 'app-core/generics/@dir', 'app-core/utils/@dir', 'app-core/dao/@dir', 'app-core/config/icons/@dir', 'app-core/report/@dir', 'app-core/uio/@dir'],
	function(as, properties, style, editorstyle, locale, generics, utils, dao, icons, report, uio) {
		"use strict";

		as.style = as.style.concat(properties).concat(style).concat(editorstyle);
		Object.assign(as.locale, locale);

		as.dao = dao;
		as.icons = icons;
		as.report = report;
		as.uio = uio;

		as.IMAGE_MAX_SIZE = 5242880;
		as.RECAPTCHA_SITE_KEY = '6LeDOkEdAAAAALz89_MYE9GpxP_GjZ3RdhBc27Gm';
		as.NEWSFEED_COMPONENT = '0';
		as.FEEDBACK_COMPONENT = '1';
		as.FEEDBACK_DEFAULT_ROUTE = '!' + as.FEEDBACK_COMPONENT + ':0';

		return as;
	});