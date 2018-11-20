define([ '../table/class' ], function(Class) {
	"use strict";

	/*
	 * ------------- GENEGIC TABLE LIST CLASS --------------
	 */
	function TableList(context, name, template, headerBuilder, contentBuilder, footerBuilder) {
		Class.call(this, context, name, template, headerBuilder, contentBuilder, footerBuilder);
	}
	TableList.prototype = Object.create(Class.prototype);
	TableList.prototype.constructor = TableList;

	TableList.prototype.on = function(control, eventType, data) {
		if ([ 'header:sort' ].includes(eventType) && (control.context === this.header)) {
			this.sort([ control ]);
			this.setSortStatus(control);
			return false;
		}
		if ([ 'content:set' ].includes(eventType) && (control.context === this)) {
			this.setSortStatus(control.sortFields[0]);

			if (this.footer) {
				this.footer.data = control.getData();
				this.footer.calculate()
			};
		}

		return Class.prototype.on.call(this, control, eventType, data);
	}

	TableList.prototype.sort = function(fields) {
		this.content.sort(fields);
		return this;
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