define([ './class', 'i18n!nls/root' ], function(TableListFooter, locale) {
	"use strict";

	function tableListFooter(context, name, properties, Class) {

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
		}

		return new (Class || TableListFooter)(context, name, properties.template, handleBuilder).setContent(properties.controls);
	}

	return tableListFooter;
});