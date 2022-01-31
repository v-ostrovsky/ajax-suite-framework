define([ 'as' ], function(as) {
	"use strict";

	function formatter(cell, value) {
		if ([ 'number', 'currency' ].includes(cell.attr('data-type'))) {
			return value || 0;
		}
		if ([ 'date' ].includes(cell.attr('data-type'))) {
			return as.locale.toDbDate(value);
		}

		return value;
	}

	function section(fields, data, titleBuilder, headerBuilder, rowBuilder, footerBuilder) {

		// ----------------- header -----------------
		var thead = $('<thead>');

		if (typeof titleBuilder === 'function') {
			titleBuilder().appendTo(thead);
		}

		if (typeof headerBuilder === 'function') {
			var header = headerBuilder().appendTo(thead);
			fields.forEach(function(column) {
				var cell = header.children('[name="' + column.name + '"]');
				if (column.header) {
					cell.html(column.header);
				} else {
					cell.remove();
				}
			});
		}

		// ----------------- body -----------------
		var tbody = $('<tbody>');

		if (typeof rowBuilder === 'function') {
			(data || []).forEach(function(attributes, index, context) {
				var tr = rowBuilder(attributes, index, context).appendTo(tbody);
				fields.forEach(function(column) {
					var cell = tr.children('[name="' + column.name + '"]'), value = attributes[column.name] || '';
					if (column.header) {
						cell.html(formatter(cell, value));
					} else {
						cell.remove();
					}
				});
			});
		}

		// ----------------- footer -----------------
		var tfoot = $('<tbody>');

		if (typeof footerBuilder === 'function') {
			var footer = footerBuilder().appendTo(tfoot);
			fields.forEach(function(column) {
				var cell = footer.children('[name="' + column.name + '"]');
				if (column.header) {
					cell.html(column.footer);
				} else {
					cell.remove();
				}
			});
		}

		var delimiter = $('<tr>').appendTo(tfoot).hide();
		fields.forEach(function(column, index) {
			$('td').css({
				'border' : 'none'
			}).appendTo(delimiter);
		});

		return thead.add(tbody).add(tfoot);
	}

	return section;
});