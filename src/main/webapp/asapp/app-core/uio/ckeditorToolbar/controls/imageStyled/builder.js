define(['as', './class'], function(as, Class) {
	"use strict";

	function imageStyled(context, path, propertiesExt) {
		var properties = Object.assign(propertiesExt, {
			displayBuilder: function(context) {
				var display = as.generics.button.builder(context, '', {
					template: 'create:<div></div>',
					tooltip: as.locale.editor['image'].title,
					formatter: function(value) {
						return as.icons.editor['image'][value || 'image'];
					}
				});

				display.element.css({
					'height': '100%'
				});

				return display;
			},
			selectorBuilder: function(context) {
				var selector = as.uio.selectorPanel(context);

				selector.element.css({
					'flex-direction': 'row',
					'padding': '4px 3px'
				});

				return selector;
			},
			handler: function(self, data) {
				self.send('control:changed').executeCommand();
			}
		});

		return as.generics.selectorDropdown.builder(context, path, properties, Class).init(propertiesExt.editor);
	}

	return imageStyled;
});