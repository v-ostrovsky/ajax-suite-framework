define([ '../tableHeaderField/class', 'core/primitives' ], function(Class, primitives) {
	"use strict";

	/*
	 * ------------- GENEGIC TABLE LIST HEADER FIELD CLASS --------------
	 */
	function TableListHeaderField(context, name, msoFormatter) {
		Class.call(this, context, name, msoFormatter);
	}
	TableListHeaderField.prototype = Object.create(Class.prototype);
	TableListHeaderField.prototype.constructor = TableListHeaderField;

	TableListHeaderField.prototype.setSortButton = function(fieldComparator) {
		this.comparator = fieldComparator;
		this.element.append('<div name="button"></div>');
		this.button = new primitives.Button(this, 'button', this.send.bind(this, 'header:sort'), '▽', false);
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
			this.button.element.html(icon[status]);
		}

		return this;
	}

	return TableListHeaderField;
});