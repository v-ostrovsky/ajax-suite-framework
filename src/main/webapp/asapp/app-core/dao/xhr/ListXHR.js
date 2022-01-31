define(['as', '../XHR'], function(as, XHR) {
	"use strict";

	/*
	 * ------------- LIST XHR ABSTRACT CLASS --------------
	 */
	function ListXHR(rootUrl, application) {
		XHR.call(this, rootUrl, application);
	}
	ListXHR.prototype = Object.create(XHR.prototype);
	ListXHR.prototype.constructor = ListXHR;

	ListXHR.prototype._postProcessor = function(response) {
		if (response.status === 200) {
			response.content = JSON.parse(response.content || '[]').map(function(item) {
				return this.parse(item);
			}.bind(this));
		}

		return XHR.prototype._postProcessor.call(this, response);
	}

	ListXHR.prototype.dataspec = function() {
		return this.parse({});
	}

	ListXHR.prototype.getData = function(urlParams, preventCash) {
		return this.retrieve('GET', urlParams, preventCash);
	}

	ListXHR.prototype.create = function(attributes, urlParams) {
		return this.modify('POST', attributes, urlParams);
	}

	ListXHR.prototype.edit = function(attributes, urlParams) {
		return this.modify('PUT', attributes, urlParams);
	}

	ListXHR.prototype.remove = function(attributes, urlParams) {
		return this.modify('DELETE', attributes, urlParams);
	}

	return ListXHR;
});