define([ 'rear/IDB' ], function(IDB) {
	"use strict";

	/*
	 * ------------- LIST IDB ABSTRACT CLASS --------------
	 */
	function ListIDB(parameters) {
		IDB.call(this, parameters);
	}
	ListIDB.prototype = Object.create(IDB.prototype);
	ListIDB.prototype.constructor = ListIDB;

	ListIDB.prototype._postProcessor = function(response) {
		var result = response;
		if (Array.isArray(response)) {
			result = response.map(function(item) {
				return this.parse(item);
			}.bind(this));
		}

		return result;
	}

	ListIDB.prototype.parse = function(attributes) {
		return attributes;
	}

	ListIDB.prototype.unparse = function(attributes) {
		if (!attributes.id) {
			delete attributes.id;
		}

		return attributes;
	}

	ListIDB.prototype.create = function(attributes, parameters) {
		var createParams = {
			type : 'add',
			data : this.unparse(attributes)
		};

		var getParams = function(response) {
			return {
				type : 'get',
				data : response
			};
		};

		return this.fetch(createParams).fetch(getParams).execute(function(response) {
			return [ response ];
		});
	}

	ListIDB.prototype.edit = function(attributes, parameters) {
		var editParams = {
			type : 'put',
			data : this.unparse(attributes)
		};

		var getParams = function(response) {
			return {
				type : 'get',
				data : response
			};
		};

		return this.fetch(editParams).fetch(getParams).execute(function(response) {
			return [ response ];
		});
	}

	ListIDB.prototype.remove = function(attributes) {
		var removeParams = {
			type : 'delete',
			data : attributes.id
		};

		return this.fetch(removeParams);
	}

	ListIDB.prototype.getData = function(parameters) {
		var requestParams = {
			type : 'getAll'
		};

		if (parameters) {
			requestParams = {
				type : 'get',
				data : parseInt(parameters)
			};
		}

		return this.fetch(requestParams);
	}

	return ListIDB;
});