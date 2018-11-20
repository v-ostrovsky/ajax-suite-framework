define([ 'as', './class', 'text!./template.htpl' ], function(as, Class, template) {
	"use strict";

	function entry(context, attributes) {

		var controls = [].concat([ 'textId' ].map(function(item) {

			var properties = {
				handler : function(self) {
					self.context.focus().send('entry:mousedown');
				}
			};

			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, as.generics.button.builder, properties)
			};
		}));

		var contextmenuItems = [ 'removeBranch', 'moveBranch', 'edit', 'create' ].map(function(item) {
			return {
				name : item,
				text : as.locale.contextmenu[item].text,
				hotkey : as.locale.contextmenu[item].hotkey,
				handler : function(source) {
					source.root[item]();
				},
				disabled : true
			};
		});

		var properties = {
			template : template,
			controls : controls,
			contextmenuItems : context.application.authorities ? contextmenuItems : [],
			attributes : attributes
		};

		return as.generics.entry.builder(context, properties, Class);
	}

	return entry;
});