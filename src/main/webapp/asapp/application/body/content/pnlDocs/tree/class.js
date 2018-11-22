define([ 'as', './frmEdit/builder', './frmSelect/builder' ], function(as, frmEditBuilder, frmSelectBuilder) {
	"use strict";

	var Class = as.generics.tree.Class;

	/*
	 * ------------- DOCS TREE CLASS --------------
	 */
	function Tree(context, name, template, container, rootEntryBuilder, branchBuilder, daoBuilder) {
		Class.call(this, context, name, template, container, rootEntryBuilder, branchBuilder, daoBuilder);
	}
	Tree.prototype = Object.create(Class.prototype);
	Tree.prototype.constructor = Tree;

	Tree.prototype.create = function() {
		if (this.activeElement) {
			var attributes = {
				id : this.activeElement.attributes.id,
				code : this.activeElement.attributes.code
			};

			Class.prototype.create.call(this, frmEditBuilder, attributes);
		}
	}

	Tree.prototype.edit = function() {
		Class.prototype.edit.call(this, frmEditBuilder, this.activeElement.attributes);
	}

	Tree.prototype.moveBranch = function() {
		Class.prototype.moveBranch.call(this, frmSelectBuilder, this.activeElement.attributes);
	}

	Tree.prototype.removeBranch = function() {
		var header = as.locale.form.titleRemove;
		var message = as.locale.frmBranchRemove.message + '<br>{ ' + this.activeElement.attributes.textId + ' } ?';

		Class.prototype.removeBranch.call(this, as.uio.frmConfirmBuilder, this.activeElement.attributes, header, message);
	}

	return Tree;
});