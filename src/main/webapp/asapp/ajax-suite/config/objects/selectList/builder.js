define([ './class', 'text!./template.htpl', './entry/builder', 'i18n!nls/root' ], function(List, template, entryBuilder, locale) {
	"use strict";

	function list(context, name, textId, isDescended) {

		var fields = [].concat([ 'textId' ].map(function(item) {
			return {
				name : item,
				comparator : locale.localeCompare.bind(null, 'string'),
				sortOrder : (isDescended) ? 'desc' : ''
			};
		}));

		function entryBuilderBound(context, attributes) {
			var attrs = Object.assign({}, attributes, {
				textId : attributes[textId]
			});

			return entryBuilder(context, attrs);
		}

		return new List(context, name, template, 'selectListCollection', entryBuilderBound).sort([ fields[0] ]);
	}

	return list;
});