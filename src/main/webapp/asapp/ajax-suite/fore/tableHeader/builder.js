define([ './class', 'i18n!nls/root' ], function(TableHeader, locale) {
	"use strict";

	function tableHeader(context, name, properties, Class) {

		var contextmenuItems = [ 'copyTable', 'copyData' ].map(function(item) {
			return {
				name : item,
				text : locale.contextmenu[item].text,
				hotkey : locale.contextmenu[item].hotkey,
				handler : function(source) {
					source.send('contextmenu:execute', item);
				},
				disabled : true
			};
		});

		var handleBuilder = function(context) {
			return properties.handleBuilder(context).setContextmenu(contextmenuItems);
		};

		var fields = properties.fields.map(function(item) {
			return function(context) {
				return item(context).setContextmenu(contextmenuItems);
			};
		});

		return new (Class || TableHeader)(context, name, properties.template, handleBuilder).setContent(fields);
	}

	return tableHeader;
});