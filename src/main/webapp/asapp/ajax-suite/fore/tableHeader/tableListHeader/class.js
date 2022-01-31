define([ '../class' ], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC TABLE LIST HEADER CLASS --------------
	 */
	function TableListHeader(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	TableListHeader.prototype = Object.create(Class.prototype);
	TableListHeader.prototype.constructor = TableListHeader;

	return TableListHeader;
});