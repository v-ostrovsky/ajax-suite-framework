define([ 'core/List' ], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC LIST CLASS --------------
	 */
	function List(context, name, template, container, entryBuilder, daoBuilder) {
		Class.call(this, context, name, template, container, entryBuilder);

		(daoBuilder) ? this.dao = daoBuilder(this.application) : null;

		this.parameters = '';
	}
	List.prototype = Object.create(Class.prototype);
	List.prototype.constructor = List;

	List.prototype.getDefaultActiveElement = function() {
		var firstEntry = this.firstEntry();

		if (firstEntry) {
			return firstEntry;
		} else {
			this.execute(function(response) {
				this.firstEntry().focus();
			}.bind(this));
		}

		return undefined;
	}

	List.prototype.create = function(formBuilder, attributes) {
		var windowContentBuilder = function(context) {
			var properties = {
				attributes : Object.assign(this.dao.parse(attributes), attributes || {}, {
					id : null
				}),
				onSubmit : function(windowContent) {
					this.dao = this.dao.create(windowContent.attributes, this.parameters).execute(function(response) {
						var entry = this.crud(-attributes.id, response);
						(entry) ? entry.focus() : null;
					}.bind(this));
				}.bind(this)
			};

			return formBuilder(context, '*/content', properties);
		}.bind(this);

		this.application.addWindow(windowContentBuilder, true);
	}

	List.prototype.copy = function(formBuilder, attributes) {
		var windowContentBuilder = function(context) {
			var properties = {
				attributes : Object.assign({}, attributes, {
					id : null
				}),
				onSubmit : function(windowContent) {
					this.dao = this.dao.create(windowContent.attributes, this.parameters).execute(function(response) {
						var entry = this.crud(-attributes.id, response);
						(entry) ? entry.focus() : null;
					}.bind(this));
				}.bind(this)
			};

			return formBuilder(context, '*/content', properties);
		}.bind(this);

		this.application.addWindow(windowContentBuilder, true);
	}

	List.prototype.edit = function(formBuilder, attributes) {
		var windowContentBuilder = function(context) {
			var properties = {
				attributes : Object.assign({}, attributes),
				onSubmit : function(windowContent) {
					this.dao = this.dao.edit(windowContent.attributes, this.parameters).execute(function(response) {
						var entry = this.crud(attributes.id, response);
						(entry) ? entry.focus() : null;
					}.bind(this));
				}.bind(this)
			};

			return formBuilder(context, '*/content', properties);
		}.bind(this);

		this.application.addWindow(windowContentBuilder, true);
	}

	List.prototype.remove = function(formBuilder, attributes, header, message) {
		var windowContentBuilder = function(context) {
			var properties = {
				attributes : Object.assign({}, attributes),
				onSubmit : function(windowContent) {
					this.dao = this.dao.remove(attributes).execute(function(response) {
						var entry = this.crud(attributes.id);
						(entry) ? entry.focus() : null;
					}.bind(this));
				}.bind(this),
				onNo : function(windowContent) {},
				header : header,
				message : message
			};

			return formBuilder(context, '*/content', properties);
		}.bind(this);

		this.application.addWindow(windowContentBuilder, true);
	}

	List.prototype.fetchContent = function(method, parameters) {
		this.parameters = parameters;

		this.dao = this.dao[method](this.parameters).execute(function(response) {
			this.setContent(response);
		}.bind(this));

		return this;
	};

	List.prototype.execute = function(callback) {
		if (this.dao) {
			this.dao = this.dao.execute(function(response) {
				callback.call(this, this.getData());
			}.bind(this));
		} else {
			callback.call(this, this.getData());
		}

		return this;
	}

	return List;
});