define([ './class', '../builder' ], function(TreeEditable, treeBuilder) {
	"use strict";

	function treeEditable(context, path, properties, Class) {
		return treeBuilder(context, path, properties, (Class || TreeEditable));
	}

	return treeEditable;
});