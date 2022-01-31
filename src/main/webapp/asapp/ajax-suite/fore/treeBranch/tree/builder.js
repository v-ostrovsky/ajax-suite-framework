define(['./class', '../builder'], function(Tree, treeBranchBuilder) {
	"use strict";

	function tree(context, path, properties, Class) {
		var tree = treeBranchBuilder(context, path, properties, (Class || Tree));
		(properties.visible !== undefined) ? tree.setVisibility(properties.visible) : null;
		properties.daoBuilder ? tree.setContent(properties.daoBuilder, properties.filter, properties.state || 'collapsed') : null;

		return tree;
	}

	return tree;
});