define(['as', '../Sync'], function(as, Sync) {
	"use strict";

	/*
	 * ------------- TREE SYNCHRONIC ABSTRACT CLASS --------------
	 */
	function TreeSync(data) {
		Sync.call(this, as.utils.parseTree(data));
	}
	TreeSync.prototype = Object.create(Sync.prototype);
	TreeSync.prototype.constructor = TreeSync;

	TreeSync.prototype.unparse = function(attributes) {
		return attributes;
	}

	TreeSync.prototype.create = function(attributes) {
		this.response = null;

		return this;
	}

	TreeSync.prototype.edit = function(attributes) {
		this.response = null;

		return this;
	}

	TreeSync.prototype.moveBranch = function(attributes) {
		this.response = null;

		return this;
	}

	TreeSync.prototype.removeBranch = function(attributes) {
		this.response = null;

		return this;
	}

	return TreeSync;
});