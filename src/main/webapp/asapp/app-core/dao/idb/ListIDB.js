define(['as', '../IDB'], function(as, IDB) {
	"use strict";

	// TODO Актуализировать в связи с включением status в параметр response метода _oncomplete класса Pendent

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

	ListIDB.prototype.dataspec = function() {
		return this.parse({});
	}

	ListIDB.prototype.create = function(attributes) {
		var createParams = {
			storeName: this.parameters.storeName,
			type: 'add',
			data: this.unparse(attributes)
		};

		var getParams = function(response) {
			return {
				storeName: this.parameters.storeName,
				type: 'get',
				data: response
			};
		};

		return this.fetch(createParams).fetch(getParams).execute(function(response) {
			return [this.parse(response)];
		}.bind(this));
	}

	ListIDB.prototype.edit = function(attributes) {
		var editParams = {
			storeName: this.parameters.storeName,
			type: 'put',
			data: this.unparse(attributes)
		};

		var getParams = function(response) {
			return {
				storeName: this.parameters.storeName,
				type: 'get',
				data: response
			};
		};

		return this.fetch(editParams).fetch(getParams).execute(function(response) {
			return [this.parse(response)];
		}.bind(this));
	}

	ListIDB.prototype.remove = function(attributes) {
		var removeParams = {
			storeName: this.parameters.storeName,
			type: 'delete',
			data: attributes.id
		};

		return this.fetch(removeParams);
	}

	ListIDB.prototype.getData = function(parameters) {
		var requestParams = {
			storeName: this.parameters.storeName,
			type: 'getAll'
		};

		if (parameters) {
			requestParams = {
				storeName: this.parameters.storeName,
				type: 'get',
				data: parameters
			};
		}

		return this.fetch(requestParams);
	}

	return ListIDB;
});