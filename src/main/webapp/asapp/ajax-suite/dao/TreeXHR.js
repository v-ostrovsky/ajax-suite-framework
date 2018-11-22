define([ 'rear/XHR' ], function(XHR) {
	"use strict";

	/*
	 * ------------- UTILITIES --------------
	 */
	function forEach(branch, handler) {
		branch.node = handler(branch.node);
		branch.collection.forEach(function(item) {
			forEach(item, handler)
		});
	}

	/*
	 * ------------- TREE XHR ABSTRACT CLASS --------------
	 */
	function TreeXHR(parameters) {
		XHR.call(this, parameters);
	}
	TreeXHR.prototype = Object.create(XHR.prototype);
	TreeXHR.prototype.constructor = TreeXHR;

	TreeXHR.prototype._postProcessor = function(response) {
		var result = response;

		if (this.status === 200) {
			result = JSON.parse(response);
			forEach(result, function(item) {
				return this.parse(item);
			}.bind(this));
		}

		return result;
	}

	TreeXHR.prototype.parse = function(attributes) {
		return attributes;
	}

	TreeXHR.prototype.unparse = function(attributes) {
		return attributes;
	}

	TreeXHR.prototype.create = function(attributes, parameters) {
		var requestParams = {
			type : 'POST',
			url : this.parameters.rootUrl + (parameters || ''),
			data : this.unparse(attributes)
		};

		return this.fetch(requestParams);
	}

	TreeXHR.prototype.edit = function(attributes, parameters) {
		var requestParams = {
			type : 'PUT',
			url : this.parameters.rootUrl + (parameters || ''),
			data : this.unparse(attributes)
		};

		return this.fetch(requestParams);
	}

	TreeXHR.prototype.moveBranch = function(attributes, parameters) {
		parameters = '?whatId=' + attributes.what + '&position=' + attributes.position + '&whereId=' + attributes.where + (parameters || '');

		var requestParams = {
			type : 'POST',
			url : this.parameters.rootUrl + 'move/' + parameters
		};

		return this.fetch(requestParams);
	}

	TreeXHR.prototype.removeBranch = function(attributes, parameters) {
		var requestParams = {
			type : 'DELETE',
			url : this.parameters.rootUrl,
			data : this.unparse(attributes)
		};

		return this.fetch(requestParams);
	}

	TreeXHR.prototype.getData = function(parameters, preventCash) {
		var requestParams = {
			type : 'GET',
			url : this.parameters.rootUrl + (parameters || ((parseInt(parameters) === 0) ? '0' : ''))
		};

		// To prevent caching of the XMLHttpRequest response in IE:
		if (preventCash !== false) {
			requestParams.url += ((requestParams.url.search('\\?') > -1) ? '&' : '?') + 'timestamp=' + new Date().getTime();
		}

		return this.fetch(requestParams);
	}

	return TreeXHR;
});