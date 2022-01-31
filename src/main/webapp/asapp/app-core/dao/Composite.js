define(['as'], function(as) {
	"use strict";

	var Fetcher = as.rear.Fetcher;

	/*
	 * ------------- COMPOSITE CLASS --------------
	 */
	function Composite() {
		Fetcher.call(this);
	}
	Composite.prototype = Object.create(Fetcher.prototype);
	Composite.prototype.constructor = Composite;

	Composite.prototype.setComponents = function(components) {
		return this.execute(function() {
			var compositeResponse = {};
			Object.keys(components).forEach(function(key) {
				components[key]().execute(function(response) {
					compositeResponse[key] = response;
				});
			});

			return compositeResponse;
		});
	}

	return Composite;
});