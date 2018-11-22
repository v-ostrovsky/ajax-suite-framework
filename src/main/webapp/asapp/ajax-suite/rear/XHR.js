define([ './rear' ], function(rear) {
	"use strict";

	/*
	 * ------------- XHR CLASS --------------
	 */
	function XHR(parameters) {
		rear.Suspended.call(this, parameters);
	}
	XHR.prototype = Object.create(rear.Suspended.prototype);
	XHR.prototype.constructor = XHR;

	XHR.prototype._sendRequest = function() {
		if (typeof this._requestParams === 'string') {
			this._requestParams = {
				type : 'GET',
				url : this._requestParams
			}
		}

		var xhr = new XMLHttpRequest();

		xhr.onload = function(response) {
			var status = '000', rearResponse = {
				status : status
			};

			if (response.target) {
				status = response.target.status;
				if (status === 200) {
					rearResponse = response.target.response;
				} else {
					rearResponse = {
						status : status,
						code : response.target.getResponseHeader('ReturnCode')
					};
				}
			}

			this._oncomplete(status, rearResponse);
		}.bind(this);

		xhr.open(this._requestParams.type, this._requestParams.url, true);
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
		xhr.send(JSON.stringify(this._requestParams.data));

		return this;
	}

	XHR.prototype.execute = function(onsuccess, onfailure) {
		function callback(response) {
			return (this.status === 200) ? onsuccess.call(this, response) : onfailure.call(this, this.status, response);
		};

		return rear.Suspended.prototype.execute.call(this, callback);
	}

	return XHR;
});