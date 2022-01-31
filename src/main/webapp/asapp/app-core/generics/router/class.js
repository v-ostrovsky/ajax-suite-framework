define(['as'], function(as) {
	"use strict";

	var Class = as.generics.control.Class;

	/*
	 * ------------- GENEGIC ROUTER SINGLETON --------------
	 */
	function Router(context, path, template, parameters) {
		Class.call(this, context, path, template);

		this.element.attr({
			'tabindex': this.element.attr('tabindex') || 0
		});

		this.application.router = this;

		this.content = parameters.contentBuilder(this);
		this.directory = parameters.directoryBuilder(this);

		window.onpopstate = function(event) {
			this._onUrlChange_();
			this._onConfigChange_();
			this.config = as.utils.config(window.location.search);
		}.bind(this);

		this.directory.require().execute(function(response) {
			this.config = as.utils.config();
			this._onUrlChange_();
			this._onConfigChange_();
			this.config = as.utils.config(window.location.search);
		}.bind(this));
	}
	Router.prototype = Object.create(Class.prototype);
	Router.prototype.constructor = Router;

	Router.prototype._onUrlChange_ = function() {
		var configResult = this.config.clone();
		var configLocation = as.utils.config(window.location.search);

		var excessRoutes = this.config.getExtraRoutes(configLocation);
		excessRoutes.forEach(function(item) {
			configResult = configResult.removeRoutes(item);
			this.content.components[configResult.getComponent(item)].removeItem(item);
		}.bind(this));

		var extraRoutes = configLocation.getExtraRoutes(this.config);
		this.directory.getBuilders(extraRoutes).forEach(function(item) {
			configResult = configResult.addRoutes(item.route);
			this.content.components[configResult.getComponent(item.route)].addItem(item);
		}.bind(this));

		configResult.setActiveRoute(configLocation.getActiveRoute());
		configResult.active = (configResult.active > -1) ? configResult.active : (configResult.routes.length - 1);
		if (configResult.getActiveRoute()) {
			configResult.getActiveRoute(), this.content.setActiveItem(configResult.getActiveRoute());
		}

		configResult.replaceState();
	}

	Router.prototype._onConfigChange_ = function() {
		var configLocation = as.utils.config(window.location.search);

		var activeRoute = configLocation.getActiveRoute();
		if (activeRoute) {
			this.directory.setActiveEntry(this.directory.findEntry(activeRoute));
		} else {
			this.directory.focus();
		}
	}

	Router.prototype.on = function(control, eventType, data) {
		if (['panel:loopend'].includes(eventType)) {
			control.nextControl(null, data);
			return false;
		}
		if (['control:addroute'].includes(eventType)) {
			this.addRoute(data);
			return false;
		}
		if (['config:changed'].includes(eventType)) {
			this.refreshConfig(control.getComponentIndex(), control.getConfig());
			return false;
		}

		return Class.prototype.on.call(this, control, eventType, data);
	}

	Router.prototype.addRoute = function(route) {
		var newConfig = this.config.addRoutes(route);
		if (!newConfig.equals(this.config)) {
			newConfig.pushState();
			this._onUrlChange_();
		}

		this.config = as.utils.config(window.location.search);
	}

	Router.prototype.refreshConfig = function(componentIndex, newConfig) {
		var newConfig = this.config.updateWithComponentConfig(componentIndex, newConfig);
		if (!newConfig.equals(this.config)) {
			if (newConfig.active < 0) {
				var activeRoute = this.content.components.find(function(item) {
					return item.getConfig().active || (item.getConfig().active === 0);
				}).getConfig().getActiveRoute();

				newConfig.setActiveRoute(activeRoute || (newConfig.routes.length - 1));
				this.content.getItemByRoute(newConfig.getActiveRoute()).focus();
			}

			newConfig.pushState();
			this._onConfigChange_();
		}

		this.config = as.utils.config(window.location.search);
	}

	return Router;
});