define(['as', './class', 'text!./template.htpl', './controls/@dir'], function(as, Class, template, toolbarControls) {
	"use strict";

	function toolbar(context, path, propertiesExt) {
		var exclude = propertiesExt.exclude || [];

		var controls = [].concat(['bold', 'italic', 'underline', 'strikethrough', 'outdent', 'indent', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo'].map(function(item) {
			var properties = {
				tooltip: as.locale.editor[item].title,
				content: as.icons.editor[item],
				handler: function(self) {
					self.executeCommand();
				},
				editor: propertiesExt.editor,
				supress: exclude.includes(item)
			};

			return {
				name: item,
				builder: as.utils.bindBuilder('*/' + item, toolbarControls['button'].builder, properties)
			};
		})).concat(['red', 'fontFamily', 'fontSize', 'heading', 'alignment', 'link', 'localLink', 'flexSection', 'image', 'imageStyled'].map(function(item) {
			var properties = {
				updown: propertiesExt.updown,
				editor: propertiesExt.editor,
				supress: exclude.includes(item)
			};

			return {
				name: item,
				builder: as.utils.bindBuilder('*/' + item, toolbarControls[item].builder, properties)
			};
		}));

		var properties = {
			template: template,
			controls: controls
		};

		return as.generics.panel.builder(context, path, properties, Class);
	}

	return toolbar;
});