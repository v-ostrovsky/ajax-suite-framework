define(['./Control', './Window', 'ajax-suite/utils/@dir'], function(Control, Window, utils) {
	"use strict";

	/*
	 * ------------- WINDOW MANAGER CLASS --------------
	 */
	function WindowManager(context, path) {
		Control.call(this, context, path);

		this.windows = [];
	}
	WindowManager.prototype = Object.create(Control.prototype);
	WindowManager.prototype.constructor = WindowManager;

	WindowManager.prototype.on = function(control, eventType, data) {
		if (['control:focusin'].includes(eventType) && (control.root === this)) {
			this.send(eventType, data).activeElement.focus();
			return false;
		}
		if (['control:destroy'].includes(eventType)) {
			this.removeWindow(control);
			this.send('config:changed');
			return false;
		}
		if (['handle:mousedown'].includes(eventType) && (control.root === this)) {
			this.setActiveElement(control).focus();
			this.send('config:changed');
			return false;
		}
	}

	WindowManager.prototype.setActiveElement = function(asWindow) {
		if (this.windows.includes(asWindow)) {
			if (asWindow && !asWindow.backdrop) {
				this.windows.splice(asWindow.itemId, 1);
				this.windows.push(asWindow);
				this.windows.forEach(function(item, i) {
					item.setItemId(this, i);
				}.bind(this));
				asWindow.element.appendTo(this.element);
			}

			return Control.prototype.setActiveElement.call(this, asWindow);
		} else {
			return null;
		}
	}

	WindowManager.prototype.addWindow = function(contentBuilder, isDialog, position) {
		var asWindow = new Window(this, contentBuilder, position).setItemId(this, this.windows.length);

		if (isDialog) {
			asWindow.backdrop = asWindow.element.wrap($('<div>').css({
				'position': 'absolute',
				'top': '0',
				'left': '0',
				'width': '100%',
				'height': '100%'
			}).on({
				mousedown: function(event) {
					if (event.cancelable) {
						event.preventDefault();
						event.stopPropagation();
					}
				}
			})).parent();
		}

		this.windows.push(asWindow);

		asWindow.element.hide().fadeTo('slow', 1);

		return asWindow.focus();
	}

	WindowManager.prototype.removeWindow = function(asWindow) {
		if (this.windows.includes(asWindow)) {
			this.windows = this.windows.filter(function(item) {
				return (item !== asWindow);
			});

			if (typeof asWindow.content.onContainerDestroy === 'function') {
				asWindow.content.onContainerDestroy();
			}

			if (asWindow.backdrop) {
				asWindow.backdrop.fadeOut(300, function() {
					asWindow.backdrop.remove();
				});
			} else {
				asWindow.element.fadeOut(300, function() {
					asWindow.element.remove();
				});
			}

			if (asWindow === this.activeElement) {
				this.windows.length ? this.setActiveElement(this.windows[this.windows.length - 1]).focus() : this.context.focus();
			}
		}

		return this.activeElement;
	}

	WindowManager.prototype.getConfig = function() {
		var config = utils.config();

		config.routes = this.windows.reduce(function(accumulator, item) {
			(item.route) ? accumulator.push(item.route) : null;
			return accumulator;
		}, []);

		if (config.routes.length) {
			config.setActiveRoute(this.activeElement.route);
		}

		return config;
	}

	return WindowManager;
});