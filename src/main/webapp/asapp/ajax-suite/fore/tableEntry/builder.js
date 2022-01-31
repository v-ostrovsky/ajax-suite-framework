define(['./class', 'i18n!ajax-suite/config/nls/root'], function(TableEntry, locale) {
	"use strict";

	function entry(context, path, properties, Class) {

		var cellContextmenuItems = ['copyTable', 'copyData'].map(function(item) {
			return {
				name: item,
				text: locale.contextmenu[item].text,
				hotkey: locale.contextmenu[item].hotkey,
				handler: function(source) {
					source.send('contextmenu:execute', item);
				},
				onSetSelectedStatus: function(self, flag) {
					self.disabled = !flag;
				},
				disabled: true
			};
		});

		var handleBuilder = function(context) {
			return properties.handleBuilder(context).setContextmenu(cellContextmenuItems);
		}

		var controls = properties.controls.map(function(item) {
			return {
				name: item.name,
				builder: function(context) {
					return item.builder(context).setContextmenu(cellContextmenuItems);
				}
			};
		});

		return new (Class || TableEntry)(context, path, properties.template, handleBuilder).setContent(controls).fillContent(properties.attributes).setContextmenu(properties.contextmenuItems);
	}

	return entry;
});