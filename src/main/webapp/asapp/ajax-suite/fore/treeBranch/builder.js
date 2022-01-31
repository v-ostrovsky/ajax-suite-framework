define([ './class' ], function(TreeBranch) {
	"use strict";

	function treeBranch(context, path, properties, Class) {
		return new (Class || TreeBranch)(context, path, properties.template, properties);
	}

	return treeBranch;
});