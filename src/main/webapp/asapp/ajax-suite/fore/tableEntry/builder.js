define([ './class', 'i18n!nls/root' ], function(TableEntry, locale) {
	"use strict";

	function entry(context, properties, Class) {

		var cellContextmenuItems = [ 'copyTable', 'copyData' ].map(function(item) {
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
			return properties.handleBuilder(context).setContextmenu(cellContextmenuItems);
		}

		return new (Class || TableEntry)(context, properties.template, handleBuilder).setContent(properties.controls).fillContent(properties.attributes).setContextmenu(properties.contextmenuItems);
	}

	return entry;
});