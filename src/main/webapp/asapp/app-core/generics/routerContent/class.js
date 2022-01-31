define(['as'], function(as) {
	"use strict";

	var Class = as.generics.panel.Class;

	/*
	 * ------------- GENEGIC ROUTER CONTENT CLASS --------------
	 */
	function RouterContent(context, path, template) {
		Class.call(this, context, path, template);

		this.root = this.context;
	}
	RouterContent.prototype = Object.create(Class.prototype);
	RouterContent.prototype.constructor = RouterContent;

	RouterContent.prototype._componentIndex = function(route) {
		return as.utils.config().getComponent(route);
	}

	RouterContent.prototype.getItemByRoute = function(route) {
		var component = this.components[this._componentIndex(route)];
		return component ? component.getItemByRoute(route) : null;
	}

	RouterContent.prototype.setActiveItem = function(route) {
		var component = this.components[this._componentIndex(route)];
		return component.setActiveElement(component.getItemByRoute(route) || null);
	}

	RouterContent.prototype.init = function() {
		this.components = Object.keys(this.controls).map(function(key, index) {
			return this.controls[key].setComponentIndex(index);
		}.bind(this));

		return this;
	}

	return RouterContent;
});