define([ './class' ], function(Tree) {
	"use strict";

	function tree(context, name, properties, Class) {
		var tree = new (Class || Tree)(context, name, properties.template, properties.container, properties.rootEntryBuilder, properties.branchBuilder, properties.daoBuilder);
		(properties.daoBuilder && properties.method != 'none') ? tree.fetchContent(properties.method || 'getData', properties.filter || '') : null;

		return tree;
	}

	return tree;
});