define([ 'as', './class', 'text!./template.htpl', './tree/builder', './pnlToolbar.ROLE_ADMIN/builder' ], function(as, Class, template, treeBuilder, crudBuilder) {
	"use strict";

	function panel(context, name) {

		var controls = [].concat([ 'tree' ].map(function(item) {
			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, treeBuilder)
			};
		})).concat([ 'expandDown', 'collapseDown' ].map(function(item) {
			var properties = {
				tooltip : as.locale.tooltip[item].text,
				image : as.icons[item],
				handler : function(self) {
					var tree = self.context.controls.tree;
					return (tree.activeElement) ? tree.activeElement.context[item]() : null;
				}
			};

			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, as.generics.button.builder, properties)
			};
		})).concat([ 'crud' ].map(function(item) {
			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, crudBuilder)
			};
		}));

		var properties = {
			template : template,
			controls : controls
		};

		return as.generics.panel.builder(context, name, properties, Class);
	}

	return panel;
});