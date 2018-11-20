define([ 'as' ], function(as) {
	"use strict";

	var TreeXHR = as.dao.TreeXHR;

	/*
	 * ------------- DOCS XHR CLASS --------------
	 */
	function DocsXHR(parameters, application) {
		TreeXHR.call(this, parameters);

		this.application = application;
	}
	DocsXHR.prototype = Object.create(TreeXHR.prototype);
	DocsXHR.prototype.constructor = DocsXHR;

	DocsXHR.prototype.execute = function(onsuccess) {
		return TreeXHR.prototype.execute.call(this, onsuccess, this.application.errorMessage.bind(this.application));
	}

	DocsXHR.prototype.parse = function(attributes) {
		attributes = Object.assign({}, attributes);

		function textId(attributes) {
			return attributes.name;
		}

		return {
			id : attributes.id,
			code : attributes.code,
			name : attributes.name,
			content : attributes.content,
			textId : textId(attributes)
		};
	}

	DocsXHR.prototype.unparse = function(attributes) {
		return {
			id : attributes.id,
			code : attributes.code,
			name : attributes.name,
			content : attributes.content
		};
	}

	return function(application) {
		return new DocsXHR({
			rootUrl : window.location.pathname + 'api/doc/'
		}, application);
	};
});