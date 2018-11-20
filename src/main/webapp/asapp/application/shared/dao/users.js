define([ 'as' ], function(as) {
	"use strict";

	var ListXHR = as.dao.ListXHR;

	/*
	 * ------------- USERS XHR CLASS --------------
	 */
	function UsersXHR(parameters, application) {
		ListXHR.call(this, parameters);

		this.application = application;
	}
	UsersXHR.prototype = Object.create(ListXHR.prototype);
	UsersXHR.prototype.constructor = UsersXHR;

	UsersXHR.prototype.execute = function(onsuccess) {
		return ListXHR.prototype.execute.call(this, onsuccess, this.application.errorMessage.bind(this.application));
	}

	UsersXHR.prototype.parse = function(attributes) {
		attributes = Object.assign({
			role : {}
		}, attributes);

		function textId(attributes) {
			return attributes.username + ' (' + attributes.lastName + ((attributes.firstName) ? (' ' + attributes.firstName.charAt(0) + '.') : '') + ')';
		}

		return {
			id : attributes.id,
			firstName : attributes.firstName,
			lastName : attributes.lastName,
			username : attributes.username,
			password : null,
			role : (attributes.role) ? attributes.role.id : null,
			roleText : (attributes.role) ? attributes.role.name : null,
			textId : textId(attributes)
		};
	}

	UsersXHR.prototype.unparse = function(attributes) {
		return {
			id : attributes.id,
			firstName : attributes.firstName,
			lastName : attributes.lastName,
			username : attributes.username,
			password : attributes.password,
			role : (attributes.role) ? {
				id : attributes.role
			} : null
		};
	}

	return function(application) {
		return new UsersXHR({
			rootUrl : window.location.pathname + 'api/user/'
		}, application);
	};
});