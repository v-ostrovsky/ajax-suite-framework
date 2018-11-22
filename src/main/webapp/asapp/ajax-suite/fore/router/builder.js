define([ './class', '../panel/builder' ], function(Content, panelBuilder) {
	"use strict";

	function router(context, name, properties, Class) {
		return panelBuilder(context, name, properties, (Class || Content)).setComponents(properties.getSidemenu, properties.getContent);
	}

	return router;
});