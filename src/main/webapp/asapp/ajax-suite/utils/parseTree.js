define([], function() {
	"use strict";

	/*
	 * ------------- TREE DATA CLASS --------------
	 */
	function TreeData(data) {
		this.node = data.node;
		this.collection = data.collection.map(function(item) {
			return new TreeData(item);
		});
	}

	TreeData.prototype.map = function(handler) {
		function forEachSubBranch(branch) {
			return {
				node : handler(branch.node),
				collection : branch.collection.map(function(item) {
					return forEachSubBranch(item);
				})
			};
		}

		return forEachSubBranch(this);
	}

	TreeData.prototype.forEachBranch = function(handler) {
		function forEachSubBranch(branch) {
			for ( var key in branch.collection) {
				var result = handler(branch.collection[key], key) || forEachSubBranch(branch.collection[key]);
				if (result) {
					return result;
				}
			}
		}

		return handler(this, 0) || forEachSubBranch(this);
	}

	TreeData.prototype.findBranch = function(handler) {
		return this.forEachBranch(function(branch) {
			if (handler(branch)) {
				return branch;
			}
		});
	}

	TreeData.prototype.forEach = function(handler) {
		return this.forEachBranch(function(branch, index) {
			return handler(branch.node, index, branch);
		});
	}

	TreeData.prototype.applyMask = function(ids) {
		var collection = [];
		this.forEachBranch(function(item) {
			ids.includes(item.node.id) ? collection.push(item) : null;
		});
		this.collection = collection;

		return this;
	}

	return function(data) {
		return new TreeData(data);
	};
});