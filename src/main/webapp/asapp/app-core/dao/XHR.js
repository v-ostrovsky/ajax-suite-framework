define(['as'], function(as) {
	"use strict";

	var Fetcher = as.rear.Fetcher;

	/*
	 * ------------- XHR CLASS --------------
	 */
	function XHR(rootUrl, application) {
		Fetcher.call(this);

		this.rootUrl = rootUrl;
		this.application = application;
	}
	XHR.prototype = Object.create(Fetcher.prototype);
	XHR.prototype.constructor = XHR;

	XHR.prototype._sendRequest = function() {
		var xhr = new XMLHttpRequest();

		xhr.onload = function(response) {
			var status = response.target.status;

			var rearResponse = {
				status: status,
				content: (status === 200) ? response.target.response : response.target.getResponseHeader('ReturnCode')
			};

			this._oncomplete(rearResponse);
		}.bind(this);

		// xhr.timeout = 10000;
		xhr.ontimeout = function(event) {
			console.error('Timeout error:', event);

			var rearResponse = {
				status: 'timeout'
			};

			this._oncomplete(rearResponse);
		}.bind(this);

		xhr.onerror = function(event) {
			console.error('Unknown error:', event);

			var rearResponse = {
				status: 'unknown'
			};

			this._oncomplete(rearResponse);
		}.bind(this);

		xhr.open(this._requestParams.type, this._requestParams.url, true);

		if (this._requestParams.data instanceof File) {
			var data = new FormData();
			data.append('file', this._requestParams.data);
			xhr.send(data);
		} else {
			xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
			xhr.send(JSON.stringify(this._requestParams.data));
		}

		this.application.suspendRequest(this.instanceId);

		return this;
	}

	XHR.prototype._postProcessor = function(response) {
		this.application.releaseRequest(this.instanceId);

		return response;
	}

	XHR.prototype.parse = function(attributes) {
		return attributes;
	}

	XHR.prototype.unparse = function(attributes) {
		return attributes;
	}

	XHR.prototype.retrieve = function(method, urlParams, preventCash) {
		this.urlParams = ((urlParams !== undefined) ? urlParams : this.urlParams) || '';

		var requestParams = {
			type: method,
			url: this.rootUrl + this.urlParams
		};

		if (preventCash !== false) {
			requestParams.url += ((requestParams.url.search('\\?') > -1) ? '&' : '?') + 'timestamp=' + new Date().getTime();
		}

		return this.fetch(requestParams);
	}

	XHR.prototype.modify = function(method, attributes, urlParams) {
		var requestParams = {
			type: method,
			url: this.rootUrl + (((urlParams !== undefined) ? urlParams : this.urlParams) || ''),
			data: this.unparse(attributes)
		};

		return this.fetch(requestParams);
	}

	XHR.prototype.execute = function(onsuccess, onfailure) {
		function callback(response) {
			if (response.status === 200) {
				var returnValue = onsuccess.call(this, response.content);
				return (returnValue !== undefined) ? Object.assign(response, {
					content: returnValue
				}) : response;
			} else {
				return (typeof onfailure === 'function') ? onfailure(response) : this.application.showErrorMessage.bind(this.application)(response);
			}
		};

		return Fetcher.prototype.execute.call(this, callback);
	}

	return XHR;
});