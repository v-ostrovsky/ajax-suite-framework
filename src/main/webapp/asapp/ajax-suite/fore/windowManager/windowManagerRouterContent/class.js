define(['../class'], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC WINDOW MANAGER ROUTER CONTENT CLASS --------------
	 */
	function WindowManagerRouterContent(context, path) {
		Class.call(this, context, path);
	}
	WindowManagerRouterContent.prototype = Object.create(Class.prototype);
	WindowManagerRouterContent.prototype.constructor = WindowManagerRouterContent;

	WindowManagerRouterContent.prototype.setComponentIndex = function(index) {
		this.componentIndex = index;
		return this;
	}

	WindowManagerRouterContent.prototype.getComponentIndex = function() {
		return this.componentIndex;
	}

	WindowManagerRouterContent.prototype.getItemByRoute = function(route) {
		return this.windows.find(function(item) {
			return (item.route === route);
		});
	}

	WindowManagerRouterContent.prototype.addItem = function(objBuilder) {
		return this.addWindow(objBuilder.contentBuilder, objBuilder.isDialog, objBuilder.position);
	}

	WindowManagerRouterContent.prototype.removeItem = function(route) {
		var window = this.getItemByRoute(route);
		return window ? this.removeWindow(window) : null;
	}

	return WindowManagerRouterContent;
});