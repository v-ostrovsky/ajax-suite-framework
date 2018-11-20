define([ 'as', './editor/builder' ], function(as, editorBuilder) {
	"use strict";

	var Class = as.generics.panel.Class;

	/*
	 * ------------- UTILITIES --------------
	 */
	function buildHash(tabs) {
		return tabs.getConfig().toString() + ((tabs.activeElement && tabs.activeElement.route) ? (';' + tabs.activeElement.route) : '');
	}

	function parseHash() {
		var result = {
			routes : [],
			active : null
		};

		var hash = (window.location.hash || '#').substr(1);
		if (hash) {
			var arr = hash.split(';');
			var routes = arr[0] ? arr[0].split(',') : [];
			var active = parseInt(arr[1]);

			result = {
				routes : routes.map(function(item) {
					return parseInt(item);
				}),
				active : active || ((active === 0) ? 0 : null)
			};
		}

		return result;
	}

	function addHashRoute(route) {
		var hash = parseHash();
		var increment = !hash.routes.includes(route) ? (hash.routes.length ? ',' : '') + route : '';
		window.location.hash = hash.routes.toString() + increment + ';' + route;
	}

	function removeRoutes(routes) {
		var hash = parseHash();
		var hashRoutes = hash.routes.filter(function(item) {
			return (!routes.includes(item));
		});
		var hashActive = routes.includes(hash.active) ? hashRoutes[hashRoutes.length - 1] : hash.active;

		window.location.hash = hashRoutes.toString() + (hashRoutes.length ? ';' + hashActive : '');
	}

	function findMenuEntry(menu, tab) {
		if (tab) {
			return menu.forEach(function(item) {
				if (item.attributes.id === tab.route) {
					return item;
				};
			});
		}
	}

	function findTab(menu, route) {
		if (tab) {
			return menu.forEach(function(item) {
				if (item.attributes.id === tab.route) {
					return item;
				};
			});
		}
	}

	function mapToDocBuilders(menu, routes) {

		function getDocBuilder(menuEntry) {
			return function(context) {
				var dao = as.dao.contents(context.application).getData(menuEntry.attributes.content);
				return editorBuilder(context, '*/content').fetchContent(dao).send('setHeader', menuEntry.attributes.textId).send('setRoute', menuEntry.attributes.id);
			};
		}

		var builders = [];
		menu.forEach(function(item) {
			if (routes.includes(item.attributes.id)) {
				builders.push(getDocBuilder(item));
			};
		});

		return builders;
	}

	function onConfigChange(menu, content) {
		var entry = findMenuEntry(menu, content.activeElement);

		if (entry) {
			entry.root.setActiveElement(entry);
			entry.context.expandUp();
		} else {
			menu.entry.focus();
		}
	}

	function onHashChange(menu, content) {
		var hash = parseHash(), configRoutes = content.getConfig();

		if (hash.routes.toString() !== configRoutes.toString()) {
			var excessTabs = content.tabs.filter(function(item) {
				return (item.route && !hash.routes.includes(item.route));
			});
			content.removeTabs.call(content, excessTabs);

			var extraRoutes = hash.routes.filter(function(item) {
				return (!configRoutes.includes(item));
			});
			content.addTabs(mapToDocBuilders(menu, extraRoutes));
		}

		var activeElement = null;
		if (content.tabs.length) {
			activeElement = content.tabs[content.tabs.length - 1];
			if (hash.active) {
				activeElement = content.getTabByRoute(hash.active) || activeElement;
			}
		}
		if (activeElement) {
			content.setActiveElement(activeElement).focus();
		} else {
			delete content.activeElement;
		}

		onConfigChange(menu, content);
	}

	/*
	 * ------------- APPLICATION CONTENT PANEL CLASS --------------
	 */
	function Panel(context, name, template) {
		Class.call(this, context, name, template);

		window.onhashchange = function(event) {
			onHashChange(this.controls['pnlDocs'].controls['tree'], this.controls['mainContent']);
		}.bind(this);
	}
	Panel.prototype = Object.create(Class.prototype);
	Panel.prototype.constructor = Panel;

	Panel.prototype.on = function(control, eventType, data) {
		if ([ 'entry:mousedown' ].includes(eventType) && ((control.root.context.context.name === 'pnlAdmin') || (control.root.context.name === 'pnlDocs'))) {
			if (typeof data === 'function') {
				data(this);
			}
			// else if (!control.context.collection.length) {
			addHashRoute(control.attributes.id);
			// }
			return false;
		}
		if ([ 'content:set' ].includes(eventType) && (control.context === this.controls['pnlDocs'])) {
			onHashChange(control, this.controls['mainContent']);
			return false;
		}
		if ([ 'content:removeBranch' ].includes(eventType) && (control.context === this.controls['pnlDocs'])) {
			var routes = [];
			control.forEach(function(item) {
				routes.push(item.attributes.id);
			});

			removeRoutes(parseHash().routes.filter(function(item) {
				return !routes.includes(item);
			}));

			return false;
		}
		if ([ 'config:changed' ].includes(eventType) && (control === this.controls['mainContent'])) {
			window.location.hash = buildHash(this.controls['mainContent']);
			return false;
		}

		return Class.prototype.on.call(this, control, eventType, data);
	}

	Panel.prototype.getDefaultActiveElement = function() {
		return this.controls['pnlDocs'];
	}

	return Panel;
});