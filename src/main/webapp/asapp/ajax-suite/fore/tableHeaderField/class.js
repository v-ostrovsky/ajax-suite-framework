define([ 'ajax-suite/core/TableHeaderField' ], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC TABLE HEADER FIELD CLASS --------------
	 */
	function TableHeaderField(context, path, msoFormatter) {
		Class.call(this, context, path);

		this.msoFormatter = (typeof msoFormatter === 'function') ? msoFormatter : function(value) {
			return {
				format : '@',
				value : value
			};
		};
	}
	TableHeaderField.prototype = Object.create(Class.prototype);
	TableHeaderField.prototype.constructor = TableHeaderField;

	return TableHeaderField;
});