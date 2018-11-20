define([ './class', 'text!./template.htpl', './entry/builder' ], function(TreeBranch, template, entryBuilder) {
	"use strict";

	function treeBranch(context) {
		return new TreeBranch(context, 'selectTreeCollection', template, 'node', entryBuilder);
	}

	return treeBranch;
});