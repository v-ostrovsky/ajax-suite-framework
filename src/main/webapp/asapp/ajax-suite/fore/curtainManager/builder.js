define([ './class' ], function(CurtainManager) {
	"use strict";

	function curtainManager(context, path, properties, Class) {
		var curtainManager = new (Class || CurtainManager)(context, path);
		(properties.visible !== undefined) ? curtainManager.setVisibility(properties.visible) : null;

		return curtainManager;
	}

	return curtainManager;
});