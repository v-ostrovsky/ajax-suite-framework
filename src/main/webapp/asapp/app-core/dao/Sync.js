define([], function() {
	"use strict";

	/*
	 * ------------- SYNCHRONIC ABSTRACT CLASS --------------
	 */
	function Sync(data) {
		this.data = data;
	}

	Sync.prototype.execute = function(callback) {
		var response = callback(this.response);
		this.response = (response !== undefined) ? response : this.response;

		return this;
	}

	Sync.prototype.parse = function(attributes) {
		return attributes;
	}

	Sync.prototype.dataspec = function() {
		return this.parse({});
	}

	Sync.prototype.getData = function() {
		this.response = this.data.map(function(item) {
			return this.parse(item);
		}.bind(this));

		return this;
	}

	return Sync;
});