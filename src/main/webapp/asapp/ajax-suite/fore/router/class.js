define([ '../panel/class' ], function(Class) {
	"use strict";

	/*
	 * ------------- UTILITIES --------------
	 */
	function parseHash() {
		var result = {
			routes : [],
			active : null
		};

		var hash = (window.location.hash || '#').substr(1);
		if (hash) {
			var arr = hash.split(';');
			var routes = arr[0].split(',').map(function(item) {
				return parseInt(item);
			});
			var active = parseInt(arr[1]);

			result = {
				routes : routes,
				active : active || ((active === 0) ? 0 : null)
			};
		}

		return result;
	}

	function addRouteToHash(route) {
		var hash = parseHash();
		var increment = !hash.routes.includes(route) ? (hash.routes.length ? ',' : '') + route : '';
		window.location.hash = hash.routes.toString() + increment + ';' + route;
	}

	function buildHash(tabs) {
		var config = tabs.getConfig();
		return (config.length) ? (config.toString() + ';' + tabs.activeElement.route) : '';
	}

	/*
	 * ------------- GENEGIC ROUTER CLASS --------------
	 */
	function Router(context, name, template) {
		Class.call(this, context, name, template);
	}
	Router.prototype = Object.create(Class.prototype);
	Router.prototype.constructor = Router;

	Router.prototype._mapBuilders_ = function(routes) {
		var builders = [];
		this.sidemenu.forEach(function(item) {
			if (routes.includes(item.attributes.id)) {
				builders.push(item.attributes.builder);
			};
		});

		return builders;
	}

	Router.prototype._onHashChange_ = function() {
		var hash = parseHash(), configRoutes = this.content.getConfig();

		if (hash.routes.toString() !== configRoutes.toString()) {
			var excessTabs = this.content.tabs.filter(function(item) {
				return (item.route && !hash.routes.includes(item.route));
			});
			this.content.removeTabs.call(this.content, excessTabs);

			var extraRoutes = hash.routes.filter(function(item) {
				return (!configRoutes.includes(item));
			});
			this.content.addTabs(this._mapBuilders_(extraRoutes));
		}

		var activeElement = this.content.getTabByRoute(hash.active);
		(activeElement ? this.content.setActiveElement(activeElement) : this.sidemenu).focus();
	}

	Router.prototype._findEntry_ = function(route) {
		return this.sidemenu.forEach(function(entry) {
			if (entry.attributes.id === route) {
				return entry;
			}
		});
	}

	Router.prototype._onConfigChange_ = function() {
		if (this.content.activeElement) {
			var entry = this._findEntry_(this.content.activeElement.route);
			entry.root.setActiveElement(entry);
			entry.context.expandUp();
		} else {
			this.sidemenu.setActiveElement(this.sidemenu.entry);
		}
	}

	Router.prototype._removeRoutes_ = function() {
		var routes = [];
		this.sidemenu.forEach(function(item) {
			routes.push(item.attributes.id);
		});

		var hash = parseHash();
		var hashRoutes = hash.routes.filter(function(item) {
			return routes.includes(item);
		});
		var hashActive = routes.includes(hash.active) ? hash.active : hashRoutes[hashRoutes.length - 1];

		window.location.hash = hashRoutes.toString() + (hashRoutes.length ? ';' + hashActive : '');
	}

	Router.prototype.on = function(control, eventType, data) {
		if ([ 'control:tabulate' ].includes(eventType)) {
			control.nextControl(null, data);
			return false;
		}
		if ([ 'entry:mousedown' ].includes(eventType) && (control.root === this.sidemenu)) {
			addRouteToHash(control.attributes.id);
			return false;
		}
		if ([ 'content:set' ].includes(eventType) && (control === this.sidemenu)) {
			this._onHashChange_();
			this._onConfigChange_();
			return false;
		}
		if ([ 'content:removeBranch' ].includes(eventType) && (control === this.sidemenu)) {
			this._removeRoutes_();
			return false;
		}
		if ([ 'config:changed' ].includes(eventType) && (control === this.content)) {
			window.location.hash = buildHash(this.content);
			this._onConfigChange_();
			return false;
		}

		return Class.prototype.on.call(this, control, eventType, data);
	}

	Router.prototype.getDefaultActiveElement = function() {
		return this.content || this.sidemenu;
	}

	Router.prototype.setComponents = function(getSidemenu, getContent) {
		this.sidemenu = getSidemenu(this);
		this.content = getContent(this);

		window.onhashchange = function(event) {
			this._onHashChange_();
		}.bind(this);

		return this;
	}

	return Router;
});