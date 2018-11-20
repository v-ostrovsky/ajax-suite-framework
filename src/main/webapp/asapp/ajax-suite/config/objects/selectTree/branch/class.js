define([ 'core/TreeBranch', 'core/primitives', 'icons/dir' ], function(TreeBranch, primitives, icons) {
	"use strict";

	/*
	 * ------------- CUSTOM TREE BRANCH CLASS --------------
	 */
	function CustomTreeBranch(context, name, template, container, entryBuilder) {
		TreeBranch.call(this, context, name, template, container, entryBuilder);

		this.btnExpand = new primitives.Button(this, '*/expand', this.setState.bind(this, 'expanded'), '', icons.expand);
		this.btnCollapse = new primitives.Button(this, '*/collapse', this.setState.bind(this, 'collapsed'), '', icons.collapse);
	}
	CustomTreeBranch.prototype = Object.create(TreeBranch.prototype);
	CustomTreeBranch.prototype.constructor = CustomTreeBranch;

	CustomTreeBranch.prototype.setState = function(state) {
		TreeBranch.prototype.setState.call(this, state);

		this.btnExpand.setVisibility(this.state != 'expanded' && this.state != 'none');
		this.btnCollapse.setVisibility(this.state != 'collapsed' && this.state != 'none');
	}

	return CustomTreeBranch;
});