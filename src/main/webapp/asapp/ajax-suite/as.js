define(['text!ajax-suite/config/css/properties.css', 'text!ajax-suite/config/css/style.css', 'i18n!ajax-suite/config/nls/root', 'ajax-suite/fore/@dir', 'ajax-suite/rear/rear', 'ajax-suite/utils/@dir'],
	function(properties, style, locale, fore, rear, utils) {
		"use strict";

		return {
			style: properties.concat(style),
			locale: locale,
			generics: fore,
			rear: rear,
			utils: utils
		};
	});