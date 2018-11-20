define([ './class', 'i18n!nls/root' ], function(TableHeader, locale) {
	"use strict";

	function tableHeader(context, name, properties, Class) {

		var handleBuilder = function(context) {
			return properties.handleBuilder(context).setContextmenu(contextmenuItems);
		}

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

		return new (Class || TableHeader)(context, name, properties.template, handleBuilder).setContent(properties.fields);
	}

	return tableHeader;
});