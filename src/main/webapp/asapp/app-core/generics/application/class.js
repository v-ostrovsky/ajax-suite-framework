define(['as'], function(as) {
	"use strict";

	var Class = as.generics.application.Class;

	/*
	 * ------------- GENEGIC CORE APPLICATION CLASS --------------
	 */
	function CoreApplication(template) {
		Class.call(this, template);

		this.suspended = [];
	}
	CoreApplication.prototype = Object.create(Class.prototype);
	CoreApplication.prototype.constructor = CoreApplication;

	CoreApplication.prototype.suspendRequest = function(instanceId, onSuspend) {
		this.suspended.push(instanceId);

		if (this.suspended.length === 1) {
			var spinner = $('<div>')
				.css({
					'margin': 'auto'
				})
				.append($('<div>')
					.addClass('spinner'));

			this.backdrop = $('<div>').css({
				'position': 'absolute',
				'left': '0',
				'right': '0',
				'width': '100%',
				'height': '100%',
				'display': 'flex'
			}).appendTo(this.element);

			setTimeout(function() {
				if (this.suspended.includes(instanceId)) {
					(typeof onSuspend === 'function') ? onSuspend(this.backdrop) : this.backdrop.append(spinner);
				};
			}.bind(this), 800);
		}
	}

	CoreApplication.prototype.releaseRequest = function(instanceId, onRelease) {
		this.suspended = this.suspended.filter(function(item) {
			return (item !== instanceId);
		});

		if (!this.suspended.length) {
			(typeof onRelease === 'function') ? onRelease(this.backdrop) : null;
			this.backdrop.remove();
			delete this.backdrop;
		}
	}

	CoreApplication.prototype.showErrorMessage = function(response, onOk, css) {
		if (!this.suspended.length) {
			var message = as.locale.message[response.status];

			var arrContent = response.content ? response.content.split('.') : ['default'];
			var text = (arrContent.length > 1) ? message[arrContent[0]](arrContent) : message[arrContent[0]];

			this.showDialog(function(context, path, propertiesExt) {
				return as.uio.frmDialogBuilder(context, path, Object.assign(propertiesExt, {
					message: text,
					onOk: onOk || propertiesExt.onOk,
				}));
			}, message.header, css);
		}

		return false;
	}

	return CoreApplication;
});