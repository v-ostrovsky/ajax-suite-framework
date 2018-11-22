define([ 'as', './class', 'text!./template.htpl' ], function(as, Class, template) {
	"use strict";

	function header(context, name) {

		var fields = [].concat([ 'firstName', 'lastName', 'username', 'roleText' ].map(function(item) {
			var properties = {
				text : as.locale.users.table[item],
				comparator : as.locale.localeCompare.bind(null, 'string')
			};

			return as.generics.bindBuilder('*/' + item, as.generics.tableListHeaderField.builder, properties);
		}));

		var properties = {
			template : template,
			fields : fields,
			handleBuilder : as.generics.tableHandle.builder
		};

		return as.generics.tableListHeader.builder(context, name, properties, Class);
	}

	return header;
});