define(['as', '../XHR'], function(as, XHR) {
	"use strict";

	/*
	 * ------------- TREE XHR ABSTRACT CLASS --------------
	 */
	function TreeXHR(rootUrl, application) {
		XHR.call(this, rootUrl, application);
	}
	TreeXHR.prototype = Object.create(XHR.prototype);
	TreeXHR.prototype.constructor = TreeXHR;

	TreeXHR.prototype._postProcessor = function(response) {
		if (response.status === 200) {
			response.content = as.utils.parseTree(JSON.parse(response.content)).map(function(item) {
				return this.parse(item);
			}.bind(this));
		}

		return XHR.prototype._postProcessor.call(this, response);
	}

	TreeXHR.prototype.dataspec = function() {
		return this.parse({});
	}

	TreeXHR.prototype.getData = function(urlParams, preventCash) {
		return this.retrieve('GET', urlParams, preventCash);
	}

	TreeXHR.prototype.create = function(attributes, urlParams) {
		return this.modify('POST', attributes, urlParams);
	}

	TreeXHR.prototype.edit = function(attributes, urlParams) {
		return this.modify('PUT', attributes, urlParams);
	}

	TreeXHR.prototype.moveBranch = function(attributes, urlParams) {
		return this.modify('PATCH', attributes, urlParams);
	}

	TreeXHR.prototype.removeBranch = function(attributes, urlParams) {
		return this.modify('DELETE', attributes, urlParams);
	}

	return TreeXHR;
});