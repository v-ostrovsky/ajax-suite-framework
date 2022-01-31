define([ '../tableHeaderField/class', 'ajax-suite/core/primitives/@dir' ], function(Class, primitives) {
	"use strict";

	/*
	 * ------------- GENEGIC TABLE LIST HEADER FIELD CLASS --------------
	 */
	function TableListHeaderField(context, path, msoFormatter) {
		Class.call(this, context, path, msoFormatter);
	}
	TableListHeaderField.prototype = Object.create(Class.prototype);
	TableListHeaderField.prototype.constructor = TableListHeaderField;

	TableListHeaderField.prototype.setSortButton = function(fieldComparator) {
		this.comparator = fieldComparator;
		this.element.append('<div name="button"></div>');
		this.button = new primitives.Button(this, 'button', '', {}).setHandler(this.send.bind(this, 'header:sort')).setView('&#x25BD');
		this.button.element.css({
			'float' : 'right',
			'cursor' : 'default',
			'padding' : '2px',
			'font-size' : '1.0em'
		});

		return this;
	}

	TableListHeaderField.prototype.setSortStatus = function(status) {
		if (this.button) {
			var icon = {
				asc : '&#x25BC',
				desc : '&#x25B2',
				none : '&#x25BD'
			};
			this.button.setView(icon[status]);
		}

		return this;
	}

	return TableListHeaderField;
});