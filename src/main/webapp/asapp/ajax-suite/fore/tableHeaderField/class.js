define([ 'core/TableHeaderField' ], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC TABLE HEADER FIELD CLASS --------------
	 */
	function TableHeaderField(context, name, msoFormatter) {
		Class.call(this, context, name);

		this.msoFormatter = (typeof msoFormatter === 'function') ? msoFormatter : function() {
			return '@';
		};
	}
	TableHeaderField.prototype = Object.create(Class.prototype);
	TableHeaderField.prototype.constructor = TableHeaderField;

	return TableHeaderField;
});