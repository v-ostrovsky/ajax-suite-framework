define(['./Control', './Tab', 'ajax-suite/utils/@dir'], function(Control, Tab, utils) {
	"use strict";

	/*
	 * ------------- HANDLE CLASS --------------
	 */
	function Handle(context) {
		this.context = context;

		this.element = $('<div>').css({
			'position': 'relative',
			'display': 'flex',
			'justify-content': 'flex-start'
		}).attr({
			'name': 'handle'
		}).appendTo(this.context.element);
	}

	/*
	 * ------------- BODY CLASS --------------
	 */
	function Body(context) {
		this.element = $('<div>').css({
			'height': '0%',
			'flex': '1'
		}).attr({
			'name': 'body'
		}).appendTo(context.element);
	}

	/*
	 * ------------- TABS CLASS --------------
	 */
	function Tabs(context, path) {
		Control.call(this, context, path);

		this.element.css({
			'display': 'flex',
			'flex-direction': 'column'
		});

		this.handle = new Handle(this);
		this.body = new Body(this);

		this.tabs = [];
	}
	Tabs.prototype = Object.create(Control.prototype);
	Tabs.prototype.constructor = Tabs;

	Tabs.prototype.on = function(control, eventType, data) {
		if (['control:focusin'].includes(eventType) && (control.root === this)) {
			this.send(eventType, data).activeElement.focus();
			return false;
		}
		if (['control:destroy'].includes(eventType) && (control.root === this)) {
			this.removeTab(control);
			this.send('config:changed');
			return false;
		}
		if (['handle:mousedown'].includes(eventType) && (control.root === this)) {
			this.setActiveElement(control).focus();
			this.send('config:changed');
			return false;
		}
	}

	Tabs.prototype.setActiveElement = function(tab) {
		if (this.tabs.includes(tab)) {
			this.tabs.forEach(function(item, i) {
				item.setVisibility(item === tab);
			}.bind(this));

			return Control.prototype.setActiveElement.call(this, tab);
		} else {
			return null;
		}
	}

	Tabs.prototype.addTab = function(contentBuilder) {
		var tabBuilder = function(context) {
			return new Tab(context).setContent(contentBuilder);
		};

		var tab = tabBuilder(this).setItemId(this, this.tabs.length);

		tab.handle.element.appendTo(this.handle.element);
		this.tabs.push(tab);

		return tab.focus();
	}

	Tabs.prototype.removeTab = function(tab) {
		if (this.tabs.includes(tab)) {
			this.tabs = this.tabs.filter(function(item) {
				return (item !== tab);
			});

			if (typeof tab.content.onContainerDestroy === 'function') {
				tab.content.onContainerDestroy();
			}

			tab.handle.element.remove();
			tab.element.remove();

			if (tab === this.activeElement) {
				this.tabs.length ? this.setActiveElement(this.tabs[this.tabs.length - 1]).focus() : this.context.focus();
			}
		}

		return this.activeElement;
	}

	Tabs.prototype.getConfig = function() {
		var config = utils.config();

		config.routes = this.tabs.reduce(function(accumulator, item) {
			(item.route) ? accumulator.push(item.route) : null;
			return accumulator;
		}, []);

		if (config.routes.length) {
			config.setActiveRoute(this.activeElement.route);
		}

		return config;
	}

	return Tabs;
});