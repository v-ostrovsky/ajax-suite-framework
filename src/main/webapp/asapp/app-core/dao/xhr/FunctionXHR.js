define(['as', '../XHR'], function(as, XHR) {
	"use strict";

	/*
	 * ------------- FUNCTION XHR ABSTRACT CLASS --------------
	 */
	function FunctionXHR(rootUrl, application) {
		XHR.call(this, rootUrl, application);
	}
	FunctionXHR.prototype = Object.create(XHR.prototype);
	FunctionXHR.prototype.constructor = FunctionXHR;

	FunctionXHR.prototype._postProcessor = function(response) {
		if (response.status === 200) {
			try {
				response.content = JSON.parse(response.content);
			} catch (e) { }
		}

		return XHR.prototype._postProcessor.call(this, response);
	}

	FunctionXHR.prototype.get = function(urlParams, preventCash) {
		return this.retrieve('GET', urlParams, preventCash);
	}

	FunctionXHR.prototype.post = function(attributes, urlParams) {
		return this.modify('POST', attributes, urlParams);
	}

	FunctionXHR.prototype.put = function(attributes, urlParams) {
		return this.modify('PUT', attributes, urlParams);
	}

	FunctionXHR.prototype.patch = function(attributes, urlParams) {
		return this.modify('PATCH', attributes, urlParams);
	}

	return FunctionXHR;
});