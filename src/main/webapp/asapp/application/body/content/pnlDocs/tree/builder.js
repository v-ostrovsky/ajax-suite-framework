define([ 'as', './class', 'text!./template.htpl', './branch/entry/builder', './branch/builder' ], function(as, Class, template, rootEntryBuilder, branchBuilder) {
	"use strict";

	function tree(context, name) {
		var properties = {
			template : template,
			container : 'node',
			rootEntryBuilder : rootEntryBuilder,
			branchBuilder : branchBuilder,
			daoBuilder : as.dao.docs
		};

		return as.generics.tree.builder(context, name, properties, Class);
	}

	return tree;
});