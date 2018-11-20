define([ 'core/Tree' ], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC TREE CLASS --------------
	 */
	function Tree(context, name, template, container, rootEntryBuilder, branchBuilder, daoBuilder) {
		Class.call(this, context, name, template, container, rootEntryBuilder, branchBuilder);

		(daoBuilder) ? this.dao = daoBuilder(this.application) : null;

		this.parameters = '';
	}
	Tree.prototype = Object.create(Class.prototype);
	Tree.prototype.constructor = Tree;

	Tree.prototype.getDefaultActiveElement = function() {
		if (this.entry) {
			return this.entry;
		} else {
			this.execute(function(response) {
				this.entry.focus();
			}.bind(this));
		}

		return undefined;
	}

	Tree.prototype.setState = function(state) {
		Class.prototype.setState.call(this, 'expanded');
	}

	Tree.prototype.create = function(formBuilder, attributes) {
		var windowContentBuilder = function(context) {
			var properties = {
				attributes : Object.assign(this.dao.parse(attributes), attributes || {}, {
					id : null,
					code : attributes.code + '*.'
				}),
				onSubmit : function(windowContent) {
					var attrs = Object.assign(windowContent.attributes, {
						code : attributes.code
					});

					this.dao = this.dao.create(attrs, this.parameters).execute(function(response) {
						Class.prototype.create.call(this, response);
					}.bind(this));
				}.bind(this)
			};

			return formBuilder(context, '*/content', properties);
		}.bind(this);

		this.application.addWindow(windowContentBuilder, true);
	}

	Tree.prototype.edit = function(formBuilder, attributes) {
		var windowContentBuilder = function(context) {
			var properties = {
				attributes : Object.assign({}, attributes),
				onSubmit : function(windowContent) {
					this.dao = this.dao.edit(windowContent.attributes, this.parameters).execute(function(response) {
						Class.prototype.edit.call(this, response);
					}.bind(this));
				}.bind(this)
			};

			return formBuilder(context, '*/content', properties);
		}.bind(this);

		this.application.addWindow(windowContentBuilder, true);
	}

	Tree.prototype.moveBranch = function(formBuilder, attributes, message) {
		var windowContentBuilder = function(context) {
			var properties = {
				attributes : {
					what : attributes.id,
					position : 'inside',
					where : this.entry.attributes.id
				},
				onSubmit : function(windowContent) {
					this.dao = this.dao.moveBranch(windowContent.attributes, this.parameters).execute(function(response) {
						Class.prototype.moveBranch.call(this, response, windowContent.attributes.what);
					}.bind(this));
				}.bind(this),
				data : this.getData()
			};

			return formBuilder(context, '*/content', properties);
		}.bind(this);

		this.application.addWindow(windowContentBuilder, true);
	}

	Tree.prototype.removeBranch = function(formBuilder, attributes, header, message) {
		var windowContentBuilder = function(context) {
			var properties = {
				attributes : Object.assign({}, attributes),
				onSubmit : function(windowContent) {
					this.dao = this.dao.removeBranch(windowContent.attributes, this.parameters).execute(function(response) {
						Class.prototype.removeBranch.call(this, response);
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

	Tree.prototype.fetchContent = function(method, parameters) {
		this.parameters = parameters;

		this.dao = this.dao[method](parameters).execute(function(response) {
			this.setActiveElement(undefined);
			this.setContent(response);
		}.bind(this));

		return this;
	};

	Tree.prototype.execute = function(callback) {
		if (this.dao) {
			this.dao = this.dao.execute(function(response) {
				callback.call(this, this.getData());
			}.bind(this));
		} else {
			callback.call(this, this.getData());
		}

		return this;
	}

	return Tree;
});