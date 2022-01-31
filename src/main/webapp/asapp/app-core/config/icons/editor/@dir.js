define(['./alignment/@dir', './image/@dir', './table/@dir', 'text!./blockQuote.svg', 'text!./bold.svg', 'text!./bulletedList.svg', 'text!./flexSection.svg', 'text!./indent.svg', 'text!./italic.svg', 'text!./link.svg', 'text!./localLink.svg', 'text!./numberedList.svg', 'text!./outdent.svg', 'text!./red.svg', 'text!./redo.svg', 'text!./strikethrough.svg', 'text!./underline.svg', 'text!./undo.svg'],
	function(alignment, image, table, blockQuote, bold, bulletedList, flexSection, indent, italic, link, localLink, numberedList, outdent, red, redo, strikethrough, underline, undo) {
		return {
			alignment: alignment,
			image: image,
			table: table,
			blockQuote: blockQuote,
			bold: bold,
			bulletedList: bulletedList,
			flexSection: flexSection,
			indent: indent,
			italic: italic,
			link: link,
			localLink: localLink,
			numberedList: numberedList,
			outdent: outdent,
			red: red,
			redo: redo,
			strikethrough: strikethrough,
			underline: underline,
			undo: undo
		};
	});