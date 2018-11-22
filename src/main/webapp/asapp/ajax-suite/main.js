define([], function() {
	"use strict";

	require.config({
		urlArgs : 'bust=vv2.1.7',
		paths : {
			'normalize' : 'ajax-suite/lib/require-css/normalize',
			'css-builder' : 'ajax-suite/lib/require-css/css-builder',
			'css' : 'ajax-suite/lib/require-css/css',
			'text' : 'ajax-suite/lib/text',
			'i18n' : 'ajax-suite/lib/i18n',
			'nls' : 'ajax-suite/config/nls',
			'icons' : 'ajax-suite/config/icons',
			'objects' : 'ajax-suite/config/objects',
			'rear' : 'ajax-suite/rear',
			'core' : 'ajax-suite/core',
			'fore' : 'ajax-suite/fore',
			'dao' : 'ajax-suite/dao',
			'plugins' : 'ajax-suite/plugins'
		},
		map : {
			'*' : {
				'as' : 'ajax-suite/as'
			}
		}
	});
});