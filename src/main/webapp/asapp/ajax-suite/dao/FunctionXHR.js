define([ 'rear/XHR' ], function(XHR) {
	"use strict";

	/*
	 * ------------- FUNCTION XHR ABSTRACT CLASS --------------
	 */
	function FunctionXHR(parameters) {
		XHR.call(this, parameters);
	}
	FunctionXHR.prototype = Object.create(XHR.prototype);
	FunctionXHR.prototype.constructor = FunctionXHR;

	FunctionXHR.prototype.post = function(parameters, attributes) {
		var requestParams = {
			type : 'POST',
			url : this.parameters.rootUrl + (parameters || ''),
			data : attributes
		};

		return this.fetch(requestParams);
	}

	FunctionXHR.prototype.getValue = function(parameters, preventCash) {
		var requestParams = {
			type : 'GET',
			url : this.parameters.rootUrl + (parameters || '')
		}

		// In order to prevent caching of the XMLHttpRequest response in IE:
		if (preventCash !== false) {
			requestParams.url += ((requestParams.url.search('\\?') > -1) ? '&' : '?') + 'timestamp=' + new Date().getTime();
		}

		return this.fetch(requestParams);
	}

	return FunctionXHR;
});