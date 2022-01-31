define(['./utils'], function(utils) {
	'use strict';

	function Config(strSearch) {
		this.routes = [];
		this.active = null

		if (strSearch) {
			var strConfig = this.toConfig(strSearch);

			if (strConfig) {
				var arr = strConfig.split(';');
				this.routes = arr[0].split(',');
				this.active = arr[1] || (this.routes.length - 1);
			}
		}
	}

	Config.prototype.toConfig = function(strSearch) {
		if (strSearch) {
			strSearch = (['?'].includes(strSearch.charAt(0)) ? window.location.origin + window.location.pathname : '') + strSearch;
			return new URL(strSearch).searchParams.get('config');
		} else {
			return '';
		}
	}

	Config.prototype.toRoutes = function(strSearch) {
		return this.toConfig(strSearch).split(';')[0];
	}

	Config.prototype.toHref = function(route) {
		return window.location.origin + window.location.pathname + '?config=' + route + ';0';
	}

	Config.prototype.getComponent = function(strRoute) {
		return strRoute ? strRoute.split(':')[0].substring(1) : null;
	}

	Config.prototype.setActiveRoute = function(route) {
		this.active = this.routes.length ? this.routes.indexOf(route) : null;
	}

	Config.prototype.getActiveRoute = function() {
		return this.routes[this.active];
	}

	Config.prototype.getExtraRoutes = function(config) {
		return this.routes.filter(function(item) {
			return !(config.routes.includes(item));
		});
	}

	Config.prototype.toString = function() {
		return this.routes.toString() + (this.routes.length ? (';' + this.active) : '');
	}

	Config.prototype.equals = function(config) {
		return (this.toString() === config.toString());
	}

	Config.prototype.clone = function() {
		return new Config('?config=' + this.toString());
	}

	Config.prototype.addRoutes = function(strRoutes) {
		var configResult = this.clone();
		var configToAdd = new Config('?config=' + strRoutes);

		configResult.routes = configResult.routes.concat(configToAdd.routes.filter(function(item) {
			return (this.routes.indexOf(item) === -1);
		}.bind(this)));

		(configToAdd.active || (configToAdd.active === 0)) ? configResult.setActiveRoute(configToAdd.getActiveRoute()) : null;

		return configResult;
	}

	Config.prototype.removeRoutes = function(strRoutes) {
		var configResult = this.clone();
		var configToRemove = new Config('?config=' + strRoutes);

		configResult.routes = configResult.routes.filter(function(item) {
			return (configToRemove.routes.indexOf(item) === -1);
		}.bind(this));

		configResult.setActiveRoute(this.getActiveRoute());
		if (configResult.getActiveRoute() === -1) {
			configResult.active = configResult.routes.length ? (configResult.routes.length - 1) : null;
		}

		return configResult;
	}

	Config.prototype.updateWithComponentConfig = function(componentIndex, configToUpdate) {
		var configResult = this.clone();

		configResult.routes = configResult.routes.filter(function(item) {
			return ![componentIndex].includes(parseInt(this.getComponent(item))) || configToUpdate.routes.includes(item);
		}.bind(this));

		configResult.setActiveRoute((configToUpdate.active || (configToUpdate.active === 0)) ? configToUpdate.getActiveRoute() : configResult.getActiveRoute());

		return configResult;
	}

	Config.prototype.pushState = function() {
		window.history.pushState({}, '', window.location.origin + window.location.pathname + '?config=' + this.toString());
	}

	Config.prototype.replaceState = function() {
		window.history.replaceState({}, '', window.location.origin + window.location.pathname + '?config=' + this.toString());
	}

	return function(strSearch) {
		return new Config(strSearch);
	};
});