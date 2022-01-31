define(['as'], function(as) {
	'use strict';

	function parseContent(strHtml) {
		var html = $(strHtml).filter(function(index, item) {
			return $(item).text().trim();
		});

		var title = html.find('strong')[0] || '';

		var text = html.toArray().slice(title ? 1 : 0).map(function(item, index) {
			return item.innerText.trim();
		});

		return {
			title: title ? title.innerHTML : as.locale.noTitle,
			text: text
		};
	}

	function contentId(strHtml) {
		return parseContent(strHtml)['title'];
	}

	function contentPreview(strHtml) {
		var preview = parseContent(strHtml);
		return preview.title + '<br>' + preview.text.join('<br>');
	}

	return {
		parseContent: parseContent,
		contentId: contentId,
		contentPreview: contentPreview
	};
});