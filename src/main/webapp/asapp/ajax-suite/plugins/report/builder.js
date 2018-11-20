define([ 'text!./template.htpl', 'text!./style.css', 'text!./script.js' ], function(template, style, script) {
	"use strict";

	function cell(field, data) {
		var cssClass = (field.type) ? field.type : '', value = data || '';

		return $('<td>').addClass(cssClass).html(value || ((field.type === 'currency') ? 0 : '')).attr({
			'data-type' : field.type
		});
	}

	function createTable(title, row, fields, data) {
		var table = $(template);

		var columns = [];
		fields.forEach(function(field) {
			if ([ 'group' ].includes(field.type)) {
				field.fields.forEach(function(subfield) {
					columns.push(subfield);
				});
			} else {
				columns.push(field);
			}
		});

		columns.forEach(function(column) {
			$('<col>').css({
				'width' : column.width
			}).appendTo(table.find('colgroup'));
		});

		var thead = table.find('thead');

		thead.find('[name="title"]').attr({
			'colspan' : columns.length
		});
		thead.find('[name="titleLeft"]').html(title.left || '');
		thead.find('[name="titleRight"]').html(title.right || '');

		var headTr1 = $('<tr>').appendTo(thead), headTr2 = $('<tr>').appendTo(thead);
		fields.forEach(function(field) {
			$('<th>').attr({
				'rowspan' : (field.fields) ? 1 : 2,
				'colspan' : (field.fields) ? field.fields.length : 1
			}).html(field.text).appendTo(headTr1);

			if (field.fields) {
				field.fields.forEach(function(subfield) {
					$('<th>').attr({
						'rowspan' : 1,
						'colspan' : 1
					}).html(subfield.text).appendTo(headTr2);
				});
			}
		});

		var tbody = table.find('tbody');
		data.forEach(function(entry) {
			var tr = $('<tr>').css({
				'height' : row.height || ''
			}).appendTo(tbody);

			columns.forEach(function(column) {
				cell(column, entry[column.name]).css({
					'white-space' : column.breaklines ? 'normal' : 'inherit'
				}).appendTo(tr);
			});
		});

		return table;
	}

	function createDocument(title, row, fields, data) {
		var doc = document.implementation.createHTMLDocument('Report');

		var head = $(doc.querySelector('head'));
		head.append('<meta http-equiv=Content-Type content="text/html; charset=UTF-8">');
		head.append('<meta name=ProgId content=Excel.Sheet>');
		$('<style>').appendTo(head).html(style);

		var body = $(doc.querySelector('body'));
		createTable(title, row, fields, data).appendTo(body);
		$('<script>').appendTo(body).html(script);

		return doc;
	}

	function report(name, title, row, fields, data) {

		var html = createDocument(title, row, fields, data).childNodes[1].outerHTML;

		var blob = new Blob([ html ], {
			type : 'text/html'
		});

		$('<a>').attr({
			href : URL.createObjectURL(blob),
			download : name + '.htm'
		})[0].click();
	}

	return report;
});