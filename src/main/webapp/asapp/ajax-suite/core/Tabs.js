define([ './Control' ], function(Control) {
	"use strict";

	/*
	 * ------------- HANDLE CLASS --------------
	 */
	function Handle(context) {
		this.context = context;

		this.element = $('<div>').attr({
			'name' : 'handle'
		}).css({
			'display' : 'flex',
			'justify-content' : 'flex-start'
		}).appendTo(this.context.element);
	}

	Handle.prototype.addTabProxy = function(tab) {
		tab.handle.element.on({
			mousedown : function(event) {
				event.preventDefault();
				event.stopPropagation();
				tab.send('handle:mousedown', event);
			}.bind(this)
		}).appendTo(this.element);
	}

	/*
	 * ------------- BODY CLASS --------------
	 */
	function Body(context) {
		this.element = $('<div>').attr({
			'name' : 'body'
		}).css({
			'flex' : '1 1 100%',
			'display' : 'flex'
		}).appendTo(context.element);
	}

	/*
	 * ------------- TABS CLASS --------------
	 */
	function Tabs(context, name) {
		Control.call(this, context, name);

		this.element.css({
			'display' : 'flex',
			'flex-direction' : 'column-reverse'
		});

		this.body = new Body(this);
		this.handle = new Handle(this);

		this.tabs = [];
	}
	Tabs.prototype = Object.create(Control.prototype);
	Tabs.prototype.constructor = Tabs;

	Tabs.prototype.on = function(control, eventType, data) {
		if ([ 'control:focusin' ].includes(eventType) && (control.root === this)) {
			this.send(eventType, data);
			return false;
		}
		if ([ 'handle:mousedown' ].includes(eventType) && (control.root === this)) {
			this.setActiveElement(control).focus();
			this.send('config:changed');
			return false;
		}
		if ([ 'tab:destroy' ].includes(eventType) && (control.root === this)) {
			this.removeTabs([ control ]);
			if (control === this.activeElement) {
				if (this.tabs.length) {
					this.setActiveElement(this.tabs[this.tabs.length - 1]).focus();
				} else {
					delete this.activeElement;
				}
			}
			this.send('config:changed');
			return false;
		}
	}

	Tabs.prototype.setActiveElement = function(tab) {
		(this.activeElement && (this.activeElement != tab)) ? this.activeElement.setActiveStatus('none') : null;

		this.tabs.forEach(function(item, i) {
			item.setVisibility(false);
		}.bind(this));
		tab.setVisibility(true);

		(tab && !tab.isActive) ? tab.setActiveStatus('inactive') : null;

		return this.activeElement = tab;
	}

	Tabs.prototype.addTabs = function(tabBuilders) {
		return tabBuilders.map(function(item) {
			var tab = item(this).setItemId(this, this.tabs.length).setVisibility(false);
			this.handle.addTabProxy(tab);
			this.tabs.push(tab);
			return tab;
		}.bind(this));
	}

	Tabs.prototype.removeTabs = function(tabs) {
		if (tabs.length) {
			tabs.forEach(function(item) {
				item.handle.element.remove();
				item.element.remove();
			});

			this.tabs = this.tabs.filter(function(item) {
				return !tabs.includes(item);
			});
		}

		return this.activeElement;
	}

	Tabs.prototype.getTabByRoute = function(route) {
		return this.tabs.find(function(item) {
			return (item.route === route);
		});
	}

	Tabs.prototype.getConfig = function() {
		return this.tabs.reduce(function(accumulator, item) {
			(item.route) ? accumulator.push(item.route) : null;
			return accumulator;
		}, []);
	}

	return Tabs;
});