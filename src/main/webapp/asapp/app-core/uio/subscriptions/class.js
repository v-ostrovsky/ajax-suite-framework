define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.control.Class;

	/*
	 * ------------- SUBSCRIPTIONS TABLE CLASS --------------
	 */
	function Subscriptions(context, path, template, headerBuilder, contentBuilder) {
		Class.call(this, context, path, template);

		this.header = headerBuilder(this);
		this.content = contentBuilder(this);
	}
	Subscriptions.prototype = Object.create(Class.prototype);
	Subscriptions.prototype.constructor = Subscriptions;

	Subscriptions.prototype.execute = function(callback) {
		this.content.execute(function(response) {
			callback(response, this);
		}.bind(this));

		return this;
	}

	return Subscriptions;
});