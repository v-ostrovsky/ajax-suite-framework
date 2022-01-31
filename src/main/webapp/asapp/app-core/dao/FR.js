define(['as'], function(as) {
	"use strict";

	var Fetcher = as.rear.Fetcher;

	/*
	 * ------------- FILE READER CLASS --------------
	 */
	function FR() {
		Fetcher.call(this);
	}
	FR.prototype = Object.create(Fetcher.prototype);
	FR.prototype.constructor = FR;

	FR.prototype._sendRequest = function() {
		var reader = new FileReader();

		reader.onload = function(response) {
			this._oncomplete(response.target.result);
		}.bind(this);

		reader[this._requestParams.method](this._requestParams.file, this._requestParams.encoding);
	}

	return FR;
});