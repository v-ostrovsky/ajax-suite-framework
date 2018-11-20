define([ 'as' ], function(as) {
	"use strict";

	var ListXHR = as.dao.ListXHR;

	/*
	 * ------------- USERS XHR CLASS --------------
	 */
	function RolesXHR(parameters, application) {
		ListXHR.call(this, parameters);

		this.application = application;
	}
	RolesXHR.prototype = Object.create(ListXHR.prototype);
	RolesXHR.prototype.constructor = RolesXHR;

	RolesXHR.prototype.execute = function(onsuccess) {
		return ListXHR.prototype.execute.call(this, onsuccess, this.application.errorMessage.bind(this.application));
	}

	RolesXHR.prototype.parse = function(attributes) {
		attributes = Object.assign({}, attributes);

		return {
			id : attributes.id,
			name : attributes.name,
			textId : attributes.name
		};
	}

	RolesXHR.prototype.unparse = function(attributes) {
		return {
			id : attributes.id,
			name : attributes.name
		};
	}

	return function(application) {
		return new RolesXHR({
			rootUrl : window.location.pathname + 'api/role/'
		}, application);
	};
});