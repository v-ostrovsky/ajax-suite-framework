define(['as'], function(as) {
	"use strict";

	var Class = as.generics.list.Class;

	/*
	 * ------------- GENEGIC SUBSCRIPTIONS LIST CLASS --------------
	 */
	function List(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);

		this.messaging = parameters.messaging;
		this.onPermissionDeniedMessage = parameters.onPermissionDeniedMessage;

		// navigator.permissions.query({
		// name : 'notifications'
		// }).then(function(permission) {
		// permission.onchange = function() {
		// if (permission.state !== 'granted') {
		// this.forEach(function(entry) {
		// if (entry.attributes.id) {
		// this._toggleSubscription_(entry, null);
		// }
		// }.bind(this));
		// }
		// }.bind(this);
		// }.bind(this));
	}
	List.prototype = Object.create(Class.prototype);
	List.prototype.constructor = List;

	List.prototype._toggleSubscription_ = function(entry, currentToken) {
		var defaultAttributes = Object.assign({}, entry.attributes, {
			id: null,
			token: null,
			chrome: false
		});

		if (['granted'].includes(Notification.permission)) {
			var method = currentToken ? 'create' : 'remove';
			var attributes = Object.assign({}, entry.attributes, {
				token: currentToken
			});

			this.dao = this.dao[method](attributes, '').execute(function(response) {
				entry.fillContent(Object.assign(defaultAttributes, response[0] || {}));
			}, function(response) {
				entry.fillContent(Object.assign(defaultAttributes, response[0] || {}));
				this.application.showErrorMessage.bind(this.application)(response);
			}.bind(this));
		} else if (['default'].includes(Notification.permission)) {
			entry.fillContent(defaultAttributes);

			if (this.messaging.currentToken) {
				var attributes = Object.assign({}, entry.attributes, {
					token: this.messaging.currentToken
				});

				this.dao = this.dao['remove'](attributes, '');
			}
		} else if (['denied'].includes(Notification.permission)) {
			var onOk = function(form) {
				form.destroyContainer();
				entry.fillContent(defaultAttributes);

				if (this.messaging.currentToken) {
					var attributes = Object.assign({}, entry.attributes, {
						token: this.messaging.currentToken
					});

					this.dao = this.dao['remove'](attributes, '');
				}
			}.bind(this);

			this.application.showDialog(as.utils.assignProperties(as.uio.frmDialogBuilder, {
				onOk: onOk,
				message: this.onPermissionDeniedMessage.text
			}), this.onPermissionDeniedMessage.title);
		}
	}

	List.prototype.on = function(control, eventType, data) {
		if (['control:changed'].includes(eventType) && (['chrome'].includes(control.name))) {
			this.messaging.setToken().then(function(currentToken) {
				this._toggleSubscription_(control.context, control.getValue() ? currentToken : null);
			}.bind(this));
			return false;
		}

		return Class.prototype.on.call(this, control, eventType, data);
	}

	List.prototype.getDefaultActiveElement = function() {
		return this.firstEntry();
	}

	List.prototype.setContent = function(daoBuilder, filter) {
		this.token = this.messaging.getToken().then(function(currentToken) {
			Class.prototype.setContent.call(this, daoBuilder, filter);
		}.bind(this));

		return this;
	}

	List.prototype.execute = function(callback) {
		this.token.then(function(currentToken) {
			Class.prototype.execute(function(response) {
				callback(response, this);
			}.bind(this));
		}.bind(this));

		return this;
	}

	return List;
});