define(['../class', 'ajax-suite/utils/@dir'], function(Class, utils) {
	"use strict";

	/*
	 * ------------- GENEGIC EDITABLE TREE CLASS --------------
	 */
	function TreeEditable(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	TreeEditable.prototype = Object.create(Class.prototype);
	TreeEditable.prototype.constructor = TreeEditable;

	TreeEditable.prototype._onWarn_ = function(confirmFormBuilder, accomplish, form) {
		this.application.showDialog(utils.assignProperties(confirmFormBuilder, {
			onOk: function(confirmWindowContent) {
				confirmWindowContent.send('control:destroy');
				accomplish(form);
			},
			onNo: function(confirmWindowContent) { }
		}));
	}

	TreeEditable.prototype.createContentBuilder = function(attributes, editFormBuilder, confirmFormBuilder) {

		var accomplish = function(form) {
			var attrs = Object.assign(form.attributes, {
				code: attributes.code
			});

			this.dao = this.dao.create(attrs).execute(function(response) {
				form.destroyContainer();
				var parentBranch = this.getEntry(response.node.code).context.refresh(response).setState('expanded');
				var entry = parentBranch.collection[parentBranch.collection.length - 1].entry;
				if (entry) {
					entry.element.hide().slideDown(400, function() {
						entry.focus();
						this.send('control:refresh', {
							method: 'create',
							entry: entry
						});
					}.bind(this));
				}
			}.bind(this));
		}.bind(this);

		return utils.assignProperties(editFormBuilder, {
			attributes: Object.assign(this.dao.dataspec(), attributes || {}, {
				id: null,
				code: attributes.code + '*.'
			}),
			onOk: accomplish,
			onWarn: confirmFormBuilder ? this._onWarn_.bind(this, confirmFormBuilder, accomplish) : null
		});
	}

	TreeEditable.prototype.create = function(attributes, editFormBuilder, confirmFormBuilder) {
		this.application.showDialog(this.createContentBuilder(attributes, editFormBuilder, confirmFormBuilder));
	}

	TreeEditable.prototype.editContentBuilder = function(attributes, editFormBuilder, confirmFormBuilder) {

		var accomplish = function(form) {
			this.dao = this.dao.edit(form.attributes).execute(function(response) {
				form.destroyContainer();
				var entry = this.getEntry(response.node.code).fillContent(response.node);
				this.send('control:refresh', {
					method: 'edit',
					entry: entry
				});
			}.bind(this));
		}.bind(this);

		return utils.assignProperties(editFormBuilder, {
			attributes: Object.assign({}, attributes),
			onOk: accomplish,
			onWarn: confirmFormBuilder ? this._onWarn_.bind(this, confirmFormBuilder, accomplish) : null
		});
	}

	TreeEditable.prototype.edit = function(attributes, editFormBuilder, confirmFormBuilder) {
		this.application.showDialog(this.editContentBuilder(attributes, editFormBuilder, confirmFormBuilder));
	}

	TreeEditable.prototype.moveBranchContentBuilder = function(attributes, selectFormBuilder) {

		var accomplish = function(form) {
			var attributes = {
				id: form.attributes.what
			};

			var urlParams = '?position=' + form.attributes.position + '&whereId=' + form.attributes.where;

			this.dao = this.dao.moveBranch(attributes, urlParams).execute(function(response) {
				form.destroyContainer();
				var parentBranch = this.getEntry(response.node.code).context.refresh(response);
				var entry = this.getEntryById(form.attributes.what);
				entry.context.expandUp();
				entry.focus();
				this.send('control:refresh', {
					method: 'moveBranch',
					entry: entry
				});
			}.bind(this));
		}.bind(this);

		return utils.assignProperties(selectFormBuilder, {
			attributes: {
				what: attributes.id,
				position: 'inside',
				where: this.entry.attributes.id
			},
			onOk: accomplish,
			data: this.getData()
		});
	}

	TreeEditable.prototype.moveBranch = function(attributes, selectFormBuilder) {
		this.application.showDialog(this.moveBranchContentBuilder(attributes, selectFormBuilder));
	}

	TreeEditable.prototype.removeBranchContentBuilder = function(attributes, confirmFormBuilder) {

		var accomplish = function(form) {
			form.destroyContainer();
			this.dao = this.dao.removeBranch(form.attributes).execute(function(response) {
				var entry = this.getEntryById(attributes.id);
				entry.element.slideUp(300, function() {
					var parentBranch = this.getEntry(response.node.code).context.refresh(response);
					parentBranch.entry.focus();
					this.send('control:refresh', {
						method: 'removeBranch',
						entry: entry
					});
				}.bind(this));
			}.bind(this));
		}.bind(this);

		return utils.assignProperties(confirmFormBuilder, {
			attributes: Object.assign({}, attributes),
			onOk: accomplish,
			onNo: function(form) { }
		});
	}

	TreeEditable.prototype.removeBranch = function(attributes, confirmFormBuilder) {
		this.application.showDialog(this.removeBranchContentBuilder(attributes, confirmFormBuilder));
	}

	return TreeEditable;
});