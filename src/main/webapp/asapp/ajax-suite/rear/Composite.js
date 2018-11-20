define([ './rear' ], function(rear) {
	"use strict";

	/*
	 * ------------- COMPOSE ABSTRACT CLASS --------------
	 */
	function Composite(parameters) {
		rear.Suspended.call(this, parameters);
	}
	Composite.prototype = Object.create(rear.Suspended.prototype);
	Composite.prototype.constructor = Composite;

	Composite.prototype.sendRequestSync = function(requestBuilders) {
		var compositeResponse = [];

		var doRequest = function(index) {
			return requestBuilders[index]().execute(function(response) {
				compositeResponse.push(response);
				index += 1;
				if (requestBuilders[index]) {
					doRequest(index);
				}
			});
		};

		return this.execute(function(response) {
			doRequest(0);
			return compositeResponse;
		});
	}

	Composite.prototype.sendRequestAsync = function(requestBuilders) {
		return this.execute(function() {
			var compositeResponse = [];

			requestBuilders.forEach(function(item, index) {
				item().execute(function(response) {
					compositeResponse[index] = response;
				}.bind(this));
			}.bind(this));

			return compositeResponse;
		});
	}

	return Composite;
});