define([ 'as' ], function(as) {
	"use strict";

	var ListXHR = as.dao.ListXHR;

	/*
	 * ------------- USERS XHR CLASS --------------
	 */
	function ContentsXHR(parameters, application) {
		ListXHR.call(this, parameters);

		this.application = application;
	}
	ContentsXHR.prototype = Object.create(ListXHR.prototype);
	ContentsXHR.prototype.constructor = ContentsXHR;

	ContentsXHR.prototype.execute = function(onsuccess) {
		return ListXHR.prototype.execute.call(this, onsuccess, this.application.errorMessage.bind(this.application));
	}

	ContentsXHR.prototype.parse = function(attributes) {
		attributes = Object.assign({}, attributes);

		return {
			id : attributes.id,
			content : attributes.content
		};
	}

	ContentsXHR.prototype.unparse = function(attributes) {
		return {
			id : attributes.id,
			content : attributes.content
		};
	}

	return function(application) {
		return new ContentsXHR({
			rootUrl : window.location.pathname + 'api/content/'
		}, application);
	};
});