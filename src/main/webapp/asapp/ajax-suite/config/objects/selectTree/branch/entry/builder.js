define([ './class', 'text!./template.htpl', 'core/primitives' ], function(Entry, template, primitives) {
	"use strict";

	function entry(context, attributes) {

		var controls = [].concat([ 'textId' ].map(function(item) {
			return {
				name : item,
				builder : function(context) {
					return new primitives.Button(context, '*/' + item, function(self) {
						self.context.focus().send('entry:mousedown', attributes.handler);
					}).setVisibility(attributes[item]);
				}
			};
		}));

		return new Entry(context, template).setContent(controls).fillContent(attributes);
	}

	return entry;
});