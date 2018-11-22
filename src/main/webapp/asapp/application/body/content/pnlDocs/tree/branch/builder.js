define([ 'as', './class', 'text!./template.htpl', './entry/builder' ], function(as, Class, template, entryBuilder) {
	"use strict";

	function treeBranch(context) {

		var properties = {
			template : template,
			container : 'node',
			entryBuilder : entryBuilder
		};

		return new as.generics.treeBranch.builder(context, 'collection', properties, Class);
	}

	return treeBranch;
});