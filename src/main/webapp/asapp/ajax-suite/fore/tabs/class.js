define([ 'core/Tabs', 'core/Tab' ], function(Class, Tab) {
	"use strict";

	/*
	 * ------------- CUSTOM TAB CLASS --------------
	 */
	function CustomTab(context, contentBuilder) {
		Tab.call(this, context, contentBuilder);
	}
	CustomTab.prototype = Object.create(Tab.prototype);
	CustomTab.prototype.constructor = CustomTab;

	CustomTab.prototype.setActiveStatus = function(state) {
		this.handle.element.toggleClass('tab-handle-selected', [ 'active', 'inactive' ].includes(state));
		return Tab.prototype.setActiveStatus.call(this, state);
	}

	/*
	 * ------------- GENEGIC TABS CLASS --------------
	 */
	function Tabs(context, name) {
		Class.call(this, context, name);
	}
	Tabs.prototype = Object.create(Class.prototype);
	Tabs.prototype.constructor = Tabs;

	Tabs.prototype.addTabs = function(contentBuilders) {
		var tabBuilders = contentBuilders.map(function(item) {
			return function(context) {
				return new CustomTab(context, item);
			};
		});

		return Class.prototype.addTabs.call(this, tabBuilders);
	}

	return Tabs;
});