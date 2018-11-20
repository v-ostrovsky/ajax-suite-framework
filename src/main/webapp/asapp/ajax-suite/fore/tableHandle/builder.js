define([ './class' ], function(TableHandle) {
	"use strict";

	function tableHandle(context) {
		return new TableHandle(context, '*/handle');
	}

	return tableHandle;
});