define(['ajax-suite/core/Tree'], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC TREE CLASS --------------
	 */
	function Tree(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	Tree.prototype = Object.create(Class.prototype);
	Tree.prototype.constructor = Tree;

	Tree.prototype.setContent = function(daoBuilder, filter, state) {
		this.dao = daoBuilder(this.application).getData(filter).execute(function(response) {
			Class.prototype.setContent.call(this, response, state);
		}.bind(this));

		return this;
	}

	Tree.prototype.execute = function(callback) {
		if (this.dao) {
			this.dao = this.dao.execute(function(response) {
				callback(response, this);
			}.bind(this));
		}

		return this;
	}

	return Tree;
});