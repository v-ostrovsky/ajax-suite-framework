define([ 'as', 'text!./style.css', 'text!./script.js' ], function(as, style, script) {
	"use strict";

	function createDocument(bodyBuilder, pageSize, title) {
		var doc = document.implementation.createHTMLDocument(title || 'Report');

		var head = $(doc.querySelector('head'));
		head.append('<meta http-equiv=Content-Type content="text/html; charset=UTF-8">');
		head.append('<meta name=ProgId content=Excel.Sheet>');
		head.append('<style type="text/css" media="print">@page { size: ' + pageSize + '; }</style>');
		$('<style>').appendTo(head).html(style);

		var body = $(doc.querySelector('body'));
		bodyBuilder().appendTo(body);
		$('<script>').appendTo(body).html(script);

		return doc;
	}

	function report(name, bodyBuilder, pageSize, title) {

		var html = createDocument(bodyBuilder, pageSize, title).childNodes[1].outerHTML;

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