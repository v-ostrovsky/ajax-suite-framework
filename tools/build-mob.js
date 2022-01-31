({
	appDir : '../src/main/webapp/asapp',
	baseUrl : '.',
	dir : './dist',
	paths : {
		'text' : 'lib/text',
		'i18n' : 'lib/i18n',
		'as' : 'ajax-suite/as',
		'ac' : 'app-core/ac',
		'firebaseMessaging' : 'firebaseMessaging',
		'app' : 'appMobile/app'
	},
	modules : [ {
		name : 'appMobile/builder',
		insertRequire : [ 'appMobile/builder' ]
	} ],
	inlineText : true,
	optimizeCss : 'standard'
})