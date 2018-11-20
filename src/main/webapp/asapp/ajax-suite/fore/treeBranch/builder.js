define([ './class' ], function(TreeBranch) {
	"use strict";

	function treeBranch(context, name, properties, Class) {
		return new (Class || TreeBranch)(context, name, properties.template, properties.container, properties.entryBuilder);
	}

	return treeBranch;
});