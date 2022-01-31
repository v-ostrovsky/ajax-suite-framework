define([ './class', 'i18n!ajax-suite/config/nls/root' ], function(TableHeader, locale) {
	"use strict";

	function tableHeader(context, path, properties, Class) {

		var cellContextmenuItems = [ 'copyTable', 'copyData' ].map(function(item) {
			return {
				name : item,
				text : locale.contextmenu[item].text,
				hotkey : locale.contextmenu[item].hotkey,
				handler : function(source) {
					source.send('contextmenu:execute', item);
				},
				onSetSelectedStatus : function(self, flag) {
					self.disabled = !flag;
				},
				disabled : true
			};
		});

		var handleBuilder = function(context) {
			return properties.handleBuilder(context).setContextmenu(cellContextmenuItems);
		};

		var fields = properties.fields.map(function(item) {
			return function(context) {
				return item(context).setContextmenu(cellContextmenuItems);
			};
		});

		return new (Class || TableHeader)(context, path, properties.template, {
			handleBuilder : handleBuilder
		}).setContent(fields);
	}

	return tableHeader;
});