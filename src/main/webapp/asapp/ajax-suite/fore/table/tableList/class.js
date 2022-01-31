define([ '../class' ], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC TABLE LIST CLASS --------------
	 */
	function TableList(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);

		this.setSortStatus(this.content.sortFields[0]);
	}
	TableList.prototype = Object.create(Class.prototype);
	TableList.prototype.constructor = TableList;

	TableList.prototype.on = function(control, eventType, data) {
		if ([ 'header:sort' ].includes(eventType) && (control.context === this.header)) {
			this.content.sort([ control ]).focus();
			this.setSortStatus(control);
			return false;
		}

		return Class.prototype.on.call(this, control, eventType, data);
	}

	TableList.prototype.setSortStatus = function(field) {
		this.fields.forEach(function(item) {
			item.setSortStatus('none');
		}.bind(this));
		field.setSortStatus('asc');

		return this;
	}

	return TableList;
});