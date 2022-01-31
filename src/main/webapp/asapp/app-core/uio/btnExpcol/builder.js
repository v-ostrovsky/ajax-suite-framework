define(['as', './class', 'text!./template.htpl'], function(as, Class, template) {
	"use strict";

	function expcol(context, path) {
		var properties = {
			template: 'create:' + template,
			handler: function(self) {
				self.send('control:changed', {
					duration: 200
				});
			}
		};

		return as.generics.button.builder(context, path, properties, Class);
	}

	return expcol;
});