define([ './class', '../builder' ], function(CurtainManagerRouterContent, curtainManagerBuilder) {
	"use strict";

	function curtainManagerRouterContent(context, path, properties, Class) {
		return curtainManagerBuilder(context, path, properties, Class || CurtainManagerRouterContent);
	}

	return curtainManagerRouterContent;
});