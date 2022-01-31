define([ 'as' ], function(as) {
	"use strict";

	function table(template, columns) {
		var table = $(template);

		var colgroup = $('<colgroup></colgroup>').appendTo(table);
		columns.forEach(function(item) {
			$('<col>').css({
				'width' : item
			}).appendTo(colgroup);
		});

		return table;
	}

	return table;
});