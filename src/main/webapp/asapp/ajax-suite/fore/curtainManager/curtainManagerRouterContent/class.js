define(['../class'], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC CURTAIN MANAGER ROUTER CONTENT CLASS --------------
	 */
	function CurtainManagerRouterContent(context, path) {
		Class.call(this, context, path);
	}
	CurtainManagerRouterContent.prototype = Object.create(Class.prototype);
	CurtainManagerRouterContent.prototype.constructor = CurtainManagerRouterContent;

	CurtainManagerRouterContent.prototype.setComponentIndex = function(index) {
		this.componentIndex = index;
		return this;
	}

	CurtainManagerRouterContent.prototype.getComponentIndex = function() {
		return this.componentIndex;
	}

	CurtainManagerRouterContent.prototype.getItemByRoute = function(route) {
		return this.curtains.find(function(item) {
			return (item.route === route);
		});
	}

	CurtainManagerRouterContent.prototype.addItem = function(objBuilder) {
		return this.addCurtain(objBuilder.contentBuilder, objBuilder.animation);
	}

	CurtainManagerRouterContent.prototype.removeItem = function(route) {
		var curtain = this.getItemByRoute(route);
		return curtain ? this.removeCurtain(curtain) : null;
	}

	return CurtainManagerRouterContent;
});