define([ './class', '../builder' ], function(TabsRouterContent, tabsBuilder) {
	"use strict";

	function tabsRouterContent(context, path, properties, Class) {
		return tabsBuilder(context, path, properties, Class || TabsRouterContent);
	}

	return tabsRouterContent;
});