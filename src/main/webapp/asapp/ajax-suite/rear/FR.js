define([ './rear' ], function(rear) {
	"use strict";

	/* УСТАРЕВШИЙ!!! */

	/*
	 * ------------- FILE READER CLASS --------------
	 */
	function FR(parameters) {
		rear.Suspended.call(this, parameters);
	}
	FR.prototype = Object.create(rear.Suspended.prototype);
	FR.prototype.constructor = FR;

	FR.prototype._sendRequest = function() {
		var reader = new FileReader();

		reader.onload = function(event) {
			this._oncomplete(reader.result);
		}.bind(this);

		reader[this._requestParams.method](this._requestParams.file, this._requestParams.encoding);
	}

	return FR;
});