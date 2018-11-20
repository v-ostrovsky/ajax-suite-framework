({
	appDir : '../asapp/ajax-suite',
	urlArgs : 'bust=v2.0.0',
	baseUrl : '.',
	paths : {
		'normalize' : 'lib/require-css/normalize',
		'css-builder' : 'lib/require-css/css-builder',
		'css' : 'lib/require-css/css',
		'text' : 'lib/text',
		'i18n' : 'lib/i18n',
		'nls' : 'config/nls',
		'icons' : 'config/icons',
		'objects' : 'config/objects',
		'rear' : 'rear',
		'core' : 'core',
		'fore' : 'fore',
		'plugins' : 'plugins'
	},
	dir : './dist',
	modules : [ {
		name : 'as'
	} ],
	inlineText : true,
	optimizeCss : 'standard',
	wrap : true
})