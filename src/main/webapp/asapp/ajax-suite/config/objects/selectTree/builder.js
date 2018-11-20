define([ './class', 'text!./template.htpl', './branch/entry/builder', './branch/builder' ], function(Tree, template, rootEntryBuilder, branchBuilder) {
	"use strict";

	function tree(context, name, textId) {
		return new Tree(context, name, template, 'node', rootEntryBuilder, branchBuilder);
	}

	return tree;
});