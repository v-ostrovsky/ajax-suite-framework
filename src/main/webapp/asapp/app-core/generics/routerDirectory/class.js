define(['as'], function(as) {
	"use strict";

	var Class = as.generics.panel.Class;

	/*
	 * ------------- GENEGIC ROUTER DIRECTORY CLASS --------------
	 */
	function RouterDirectory(context, path, template) {
		Class.call(this, context, path, template);

		this.root = this.context;
	}
	RouterDirectory.prototype = Object.create(Class.prototype);
	RouterDirectory.prototype.constructor = RouterDirectory;

	RouterDirectory.prototype.on = function(control, eventType, data) {
		if (['control:focusin'].includes(eventType) && (control.root === this)) {
			this.send(eventType, data).activeElement.focus();
			return false;
		}
		if (['panel:loopend'].includes(eventType)) {
			control.nextControl(null, data);
			return false;
		}

		return Class.prototype.on.call(this, control, eventType, data);
	}

	RouterDirectory.prototype.forEach = function(callback) {
		for (var index in this.components) {
			var result = this.components[index].forEach(callback);
			if (result) {
				return result;
			}
		}
	}

	RouterDirectory.prototype.findEntry = function(route) {
		return this.forEach(function(entry) {
			if ((route + ':').indexOf(entry.getRoute() + ':') === 0) {
				return entry;
			}
		});
	}

	RouterDirectory.prototype.getBuilders = function(routes) {
		return routes.map(function(route) {
			var entry = this.findEntry(route);

			return {
				route: route,
				contentBuilder: (entry && (typeof entry.contentBuilder === 'function')) ? function(context, path) {
					context.route = route;
					return entry.contentBuilder(context, path);
				} : null
			};
		}.bind(this)).filter(function(item) {
			return item.contentBuilder;
		});
	}

	RouterDirectory.prototype.getActiveEntry = function() {
		for (var index in this.components) {
			var activeElement = this.components[index].activeElement;
			if (activeElement) {
				return activeElement;
			}
		}

		return null;
	}

	RouterDirectory.prototype.setActiveEntry = function(entry) {
		var activeEntry = entry;

		this.components.forEach(function(item) {
			if (entry && (item === entry.root)) {
				this.setActiveElement(item);
				activeEntry = item.setActiveElement(entry);
			} else {
				this.setActiveElement(null);
				activeEntry = item.setActiveElement(null);
			}
		}.bind(this));

		return activeEntry;
	}

	RouterDirectory.prototype.execute = function(callback) {
		this.dao = this.dao.execute(function(response) {
			callback(response, this);
		}.bind(this));

		return this;
	}

	RouterDirectory.prototype.require = function() {
		this.dao = new as.dao.Composite().setComponents(this.components.map(function(item) {
			return function() {
				return item.require();
			};
		}));

		return this;
	}

	RouterDirectory.prototype.init = function() {
		this.components = Object.keys(this.controls).map(function(key) {
			return this.controls[key].getIndexCollection();
		}.bind(this));

		return this;
	}

	return RouterDirectory;
});