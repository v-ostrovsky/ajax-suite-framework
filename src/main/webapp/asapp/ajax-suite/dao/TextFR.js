define([ 'rear/FR' ], function(FR) {
	"use strict";

	/*
	 * ------------- TEXT FILE READER ABSTRACT CLASS --------------
	 */
	function TextFR() {
		FR.call(this);
	}
	TextFR.prototype = Object.create(FR.prototype);
	TextFR.prototype.constructor = TextFR;

	TextFR.prototype.getData = function(file, encoding) {
		var requestParams = {
			method : 'readAsText',
			file : file,
			encoding : encoding
		};

		return this.fetch(requestParams);
	}

	return TextFR;
});