define(['../class'], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC TABS ROUTER CONTENT CLASS --------------
	 */
	function TabsRouterContent(context, path) {
		Class.call(this, context, path);
	}
	TabsRouterContent.prototype = Object.create(Class.prototype);
	TabsRouterContent.prototype.constructor = TabsRouterContent;

	TabsRouterContent.prototype.setComponentIndex = function(index) {
		this.componentIndex = index;
		return this;
	}

	TabsRouterContent.prototype.getComponentIndex = function() {
		return this.componentIndex;
	}

	TabsRouterContent.prototype.getItemByRoute = function(route) {
		return this.tabs.find(function(item) {
			return (item.route === route);
		});
	}

	TabsRouterContent.prototype.addItem = function(objBuilder) {
		return this.addTab(objBuilder.contentBuilder);
	}

	TabsRouterContent.prototype.removeItem = function(route) {
		var tab = this.getItemByRoute(route);
		return tab ? this.removeTab(tab) : null;
	}

	return TabsRouterContent;
});