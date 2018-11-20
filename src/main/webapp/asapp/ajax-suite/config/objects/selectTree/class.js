define([ 'core/Tree' ], function(Tree) {
	"use strict";

	/*
	 * ------------- CUSTOM TREE CLASS --------------
	 */
	function CustomTree(context, name, template, container, rootEntryBuilder, branchBuilder) {
		Tree.call(this, context, name, template, container, rootEntryBuilder, branchBuilder);
	}
	CustomTree.prototype = Object.create(Tree.prototype);
	CustomTree.prototype.constructor = CustomTree;

	CustomTree.prototype.setState = function(state) {
		Tree.prototype.setState.call(this, 'expanded');
	}

	return CustomTree;
});