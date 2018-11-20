define([ '../tableHeader/class' ], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC TABLE LIST HEADER CLASS --------------
	 */
	function TableListHeader(context, name, template, fieldBuilders, handleBuilder) {
		Class.call(this, context, name, template, fieldBuilders, handleBuilder);
	}
	TableListHeader.prototype = Object.create(Class.prototype);
	TableListHeader.prototype.constructor = TableListHeader;

	return TableListHeader;
});