define([ 'as' ], function(as) {
	"use strict";

	var FunctionXHR = as.dao.FunctionXHR;

	/*
	 * ------------- APPLICATION XHR CLASS --------------
	 */
	function ApplicationXHR(parameters, application) {
		FunctionXHR.call(this, parameters);

		this.application = application;
	}
	ApplicationXHR.prototype = Object.create(FunctionXHR.prototype);
	ApplicationXHR.prototype.constructor = ApplicationXHR;

	ApplicationXHR.prototype.execute = function(onsuccess) {
		return FunctionXHR.prototype.execute.call(this, onsuccess, this.application.errorMessage.bind(this.application));
	}

	ApplicationXHR.prototype.getAuthorities = function() {
		var parameters = 'api/authorities/';
		return this.getValue(parameters);
	}

	ApplicationXHR.prototype.login = function(attributes) {
		var parameters = 'login?username=' + attributes.username + '&password=' + encodeURIComponent(attributes.password);
		return this.post(parameters);
	}

	ApplicationXHR.prototype.logout = function() {
		return this.getValue('logout', false);
	}

	return function(application) {
		return new ApplicationXHR({
			rootUrl : window.location.pathname
		}, application);
	};
});