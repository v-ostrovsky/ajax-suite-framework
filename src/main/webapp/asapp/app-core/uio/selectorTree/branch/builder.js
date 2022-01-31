define(['as', './class', 'text!./template.htpl'], function(as, Class, template) {
	"use strict";

	function treeBranch(context, path) {

		var properties = {
			template: template,
			expcolBuilder: as.uio.btnExpcolBuilder
		};

		return new as.generics.treeBranch.builder(context, path, properties, Class);
	}

	return treeBranch;
});