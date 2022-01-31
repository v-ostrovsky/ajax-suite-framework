define([ 'ajax-suite/core/List' ], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC LIST CLASS --------------
	 */
	function List(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	List.prototype = Object.create(Class.prototype);
	List.prototype.constructor = List;

	List.prototype.setContent = function(daoBuilder, filter) {
		this.dao = daoBuilder(this.application).getData(filter).execute(function(response) {
			Class.prototype.setContent.call(this, response);
		}.bind(this));

		return this;
	}

	List.prototype.execute = function(callback) {
		if (this.dao) {
			this.dao = this.dao.execute(function(response) {
				callback(response, this);
			}.bind(this));
		}

		return this;
	}

	return List;
});