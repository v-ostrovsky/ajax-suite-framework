define([ 'core/TreeBranch', 'core/primitives', 'icons/dir' ], function(Class, primitives, icons) {
	"use strict";

	/*
	 * ------------- GENEGIC TREE BRANCH CLASS --------------
	 */
	function TreeBranch(context, name, template, container, entryBuilder) {
		Class.call(this, context, name, template, container, entryBuilder);

		this.btnExpand = new primitives.Button(this, '*/expand', this.setState.bind(this, 'expanded'), '', icons.expand);
		this.btnCollapse = new primitives.Button(this, '*/collapse', this.setState.bind(this, 'collapsed'), '', icons.collapse);
	}
	TreeBranch.prototype = Object.create(Class.prototype);
	TreeBranch.prototype.constructor = TreeBranch;

	TreeBranch.prototype.setState = function(state) {
		Class.prototype.setState.call(this, state);

		this.btnExpand.setVisibility(this.state != 'expanded' && this.state != 'none');
		this.btnCollapse.setVisibility(this.state != 'collapsed' && this.state != 'none');
	}

	return TreeBranch;
});