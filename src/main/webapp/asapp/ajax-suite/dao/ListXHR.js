define([ 'rear/XHR' ], function(XHR) {
	"use strict";

	/*
	 * ------------- LIST XHR ABSTRACT CLASS --------------
	 */
	function ListXHR(parameters) {
		XHR.call(this, parameters);
	}
	ListXHR.prototype = Object.create(XHR.prototype);
	ListXHR.prototype.constructor = ListXHR;

	ListXHR.prototype._postProcessor = function(response) {
		var result = response;

		if (this.status === 200) {
			result = JSON.parse(response || []).map(function(item) {
				return this.parse(item);
			}.bind(this));
		}

		return result;
	}

	ListXHR.prototype.parse = function(attributes) {
		return attributes;
	}

	ListXHR.prototype.unparse = function(attributes) {
		return attributes;
	}

	ListXHR.prototype.create = function(attributes, parameters) {
		var requestParams = {
			type : 'POST',
			url : this.parameters.rootUrl + (parameters || ''),
			data : this.unparse(attributes)
		};

		return this.fetch(requestParams);
	}

	ListXHR.prototype.edit = function(attributes, parameters) {
		var requestParams = {
			type : 'PUT',
			url : this.parameters.rootUrl + (parameters || ''),
			data : this.unparse(attributes)
		};

		return this.fetch(requestParams);
	}

	ListXHR.prototype.remove = function(attributes) {
		var requestParams = {
			type : 'DELETE',
			url : this.parameters.rootUrl,
			data : this.unparse(attributes)
		};

		return this.fetch(requestParams);
	}

	ListXHR.prototype.getData = function(parameters, preventCash) {
		var requestParams = {
			type : 'GET',
			url : this.parameters.rootUrl + (parameters || ((parseInt(parameters) === 0) ? '0' : ''))
		};

		// In order to prevent caching of the XMLHttpRequest response in IE:
		if (preventCash !== false) {
			requestParams.url += ((requestParams.url.search('\\?') > -1) ? '&' : '?') + 'timestamp=' + new Date().getTime();
		}

		return this.fetch(requestParams);
	}

	return ListXHR;
});