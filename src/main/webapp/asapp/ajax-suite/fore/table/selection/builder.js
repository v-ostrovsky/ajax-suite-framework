define([ './class' ], function(Selection) {
	"use strict";

	function selection(context, initControl, currentControl) {
		return new Selection(context, initControl, currentControl);
	}

	return selection;
});