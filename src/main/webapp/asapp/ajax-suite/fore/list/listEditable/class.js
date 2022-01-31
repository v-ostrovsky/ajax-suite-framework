define(['../class', 'ajax-suite/utils/@dir'], function(Class, utils) {
	"use strict";

	/*
	 * ------------- GENEGIC EDITABLE LIST CLASS --------------
	 */
	function ListEditable(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	ListEditable.prototype = Object.create(Class.prototype);
	ListEditable.prototype.constructor = ListEditable;

	ListEditable.prototype._onWarn_ = function(confirmFormBuilder, accomplish, form) {
		this.application.showDialog(utils.assignProperties(confirmFormBuilder, {
			onOk: function(confirmWindowContent) {
				confirmWindowContent.send('control:destroy');
				accomplish(form);
			},
			onNo: function(confirmWindowContent) { }
		}));
	}

	ListEditable.prototype.crud = function(defaultEntryId, data) {
		var eventType = '', method = '';
		if (defaultEntryId < 0) {
			eventType = 'control:refresh', method = 'create';
		} else if (data) {
			eventType = 'control:refresh', method = 'edit';
		} else {
			eventType = 'control:refresh', method = 'remove';
		}

		var defaultEntry = this.collection.find(function(item) {
			return item.attributes.id === Math.abs(defaultEntryId);
		});

		var entries = [], collection = this.collection.slice();
		this.collection = [];
		collection.forEach(function(item) {
			if (item.attributes.id === defaultEntryId) {
				entries.push(item);
				item.element.remove();
			} else {
				this.collection.push(item);
				item.setItemId(this, this.collection.length - 1);
			}
		}.bind(this));

		var entry = (defaultEntry) ? (this.collection[defaultEntry.itemId] || this.collection[defaultEntry.itemId - 1]) : null;
		if (data && data.length) {
			entry = this.addContent(data)[0];
		}
		this.send(eventType, {
			method: method,
			entry: ['create', 'edit'].includes(method) ? entry : null
		});

		return entry;
	}

	ListEditable.prototype.createContentBuilder = function(attributes, editFormBuilder, confirmFormBuilder) {

		var accomplish = function(form) {
			this.dao = this.dao.create(form.attributes).execute(function(response) {
				form.destroyContainer();
				var entry = this.crud(-attributes.id, response);
				if (entry) {
					entry.element.hide().slideDown(400, function() {
						entry.focus()
					});
				}
			}.bind(this));
		}.bind(this);

		return utils.assignProperties(editFormBuilder, {
			attributes: Object.assign(this.dao.dataspec(), attributes || {}, {
				id: null
			}),
			onOk: accomplish,
			onWarn: confirmFormBuilder ? this._onWarn_.bind(this, confirmFormBuilder, accomplish) : null
		});
	}

	ListEditable.prototype.create = function(attributes, editFormBuilder, confirmFormBuilder) {
		this.application.showDialog(this.createContentBuilder(attributes, editFormBuilder, confirmFormBuilder));
	}

	ListEditable.prototype.copyContentBuilder = function(attributes, editFormBuilder, confirmFormBuilder) {

		var accomplish = function(form) {
			this.dao = this.dao.create(form.attributes).execute(function(response) {
				form.destroyContainer();
				var entry = this.crud(-attributes.id, response);
				if (entry) {
					entry.element.hide().slideDown(400, function() {
						entry.focus()
					});
				}
			}.bind(this));
		}.bind(this);

		return utils.assignProperties(editFormBuilder, {
			attributes: Object.assign({}, attributes, {
				id: null
			}),
			onOk: accomplish,
			onWarn: confirmFormBuilder ? this._onWarn_.bind(this, confirmFormBuilder, accomplish) : null
		});
	}

	ListEditable.prototype.copy = function(attributes, editFormBuilder, confirmFormBuilder) {
		this.application.showDialog(this.copyContentBuilder(attributes, editFormBuilder, confirmFormBuilder));
	}

	ListEditable.prototype.editContentBuilder = function(attributes, editFormBuilder, confirmFormBuilder) {

		var accomplish = function(form) {
			if (form.isChanged) {
				this.dao = this.dao.edit(form.attributes).execute(function(response) {
					form.destroyContainer();
					var entry = this.crud(attributes.id, response);
					(entry) ? entry.focus() : this.focus().setActiveElement(null);
				}.bind(this));
			} else {
				form.destroyContainer();
			}
		}.bind(this);

		return utils.assignProperties(editFormBuilder, {
			attributes: Object.assign({}, attributes),
			onOk: accomplish,
			onWarn: confirmFormBuilder ? this._onWarn_.bind(this, confirmFormBuilder, accomplish) : null
		});
	}

	ListEditable.prototype.edit = function(attributes, editFormBuilder, confirmFormBuilder) {
		this.application.showDialog(this.editContentBuilder(attributes, editFormBuilder, confirmFormBuilder));
	}

	ListEditable.prototype.removeContentBuilder = function(attributes, confirmFormBuilder) {

		var accomplish = function(form) {
			form.destroyContainer();
			this.dao = this.dao.remove(attributes).execute(function(response) {
				this.getEntryById(attributes.id).element.slideUp(300, function() {
					var entry = this.crud(attributes.id);
					(entry) ? entry.focus() : this.focus().setActiveElement(null);
				}.bind(this));
			}.bind(this));
		}.bind(this);

		return utils.assignProperties(confirmFormBuilder, {
			attributes: Object.assign({}, attributes),
			onOk: accomplish,
			onNo: function(form) { }
		});
	}

	ListEditable.prototype.remove = function(attributes, confirmFormBuilder) {
		this.application.showDialog(this.removeContentBuilder(attributes, confirmFormBuilder));
	}

	return ListEditable;
});