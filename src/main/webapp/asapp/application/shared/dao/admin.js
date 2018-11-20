define([ 'as' ], function(as) {
	"use strict";

	var FunctionXHR = as.dao.FunctionXHR;

	/*
	 * ------------- ADMIN XHR CLASS --------------
	 */
	function AdminXHR(parameters, application) {
		FunctionXHR.call(this, parameters);

		this.application = application;
	}
	AdminXHR.prototype = Object.create(FunctionXHR.prototype);
	AdminXHR.prototype.constructor = AdminXHR;

	AdminXHR.prototype.execute = function(onsuccess) {
		return FunctionXHR.prototype.execute.call(this, onsuccess, this.application.errorMessage.bind(this.application));
	}

	AdminXHR.prototype.dumpDb = function() {
		return this.getValue('api/dumpdb/');
	}

	return function(application) {
		return new AdminXHR({
			rootUrl : window.location.pathname
		}, application);
	};
});