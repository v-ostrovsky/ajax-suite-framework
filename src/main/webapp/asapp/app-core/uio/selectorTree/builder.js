define(['as', './class', 'text!./template.htpl', './entry/builder', './branch/builder'], function(as, Class, template, entryBuilder, branchBuilder) {
	"use strict";

	function tree(context, propertiesExt) {
		var viewBuilder = propertiesExt.viewBuilder || function(context, path) {
			return as.generics.button.builder(context, path, {});
		}

		var fields = [{
			name: 'textId'
		}];

		function entryBuilderBound(context, path, attributes) {
			return entryBuilder(context, path, fields, attributes, viewBuilder);
		}

		var properties = {
			template: template,
			entryBuilder: entryBuilderBound,
			branchBuilder: branchBuilder,
			daoBuilder: propertiesExt.daoBuilder,
			filter: propertiesExt.filter
		};

		var tree = as.generics.tree.builder(context, '', properties, Class);
		tree.execute(function(response) {
			tree.setState('expanded');
		});

		return tree;
	}

	return tree;
});