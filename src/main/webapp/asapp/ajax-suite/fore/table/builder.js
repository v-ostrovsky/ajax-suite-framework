define([ './class' ], function(Table) {
	"use strict";

	function table(context, name, properties, Class) {
		return new (Class || Table)(context, name, properties.template, properties.headerBuilder, properties.contentBuilder, properties.footerBuilder);
	}

	return table;
});