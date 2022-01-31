define([ 'as', './class', 'text!./template.htpl' ], function(as, Class, template) {
	"use strict";

	function panel(context) {
		var controls = [].concat([ 'content' ].map(function(item) {
			return {
				name : item,
				builder : function(context) {
					var content = as.uio.selectPanel(context);
					content.element.css({
						'padding' : '0.5px'
					});

					return content;
				}
			};
		})).concat([ 'caption' ].map(function(item) {
			var element = $('<div>').css({
				'margin-top' : '4px',
				'textAlign' : 'center'
			}).attr({
				'name' : 'caption'
			});

			var properties = {
				template : 'create:' + element[0].outerHTML
			};

			return {
				name : item,
				builder : as.utils.bindBuilder('', as.generics.field.builder, properties)
			};
		}));

		var properties = {
			template : 'create:' + template,
			controls : controls
		};

		return as.generics.panel.builder(context, '', properties, Class);
	}

	return panel;
});