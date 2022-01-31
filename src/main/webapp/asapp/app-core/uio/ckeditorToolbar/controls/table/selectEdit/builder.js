define(['as', './class', 'text!./template.htpl', './entry/builder', './branch/builder'], function(as, Class, template, entryBuilder, branchBuilder) {
	"use strict";

	/*
	 * ------------- EDIT MENU --------------
	 */
	var editMenu = {
		node: {
			id: 1,
			code: '',
			name: '',
			textId: ''
		},
		collection: [{
			node: {
				id: 1,
				code: '',
				name: '',
				textId: 'Строка'
			},
			collection: [{
				node: {
					id: 1,
					code: '',
					name: '',
					textId: 'Указать строку как заголовок'
				},
				collection: []
			}]
		}, {
			node: {
				id: 1,
				code: '',
				name: '',
				textId: 'Столбец'
			},
			collection: [{
				node: {
					id: 1,
					code: '',
					name: '',
					textId: 'Указать столбец как заголовок'
				},
				collection: []
			}]
		}, {
			node: {
				id: 1,
				code: '',
				name: '',
				textId: 'Удалить таблицу'
			},
			collection: []
		}]
	};

	function tree(context, viewBuilder) {
		viewBuilder = viewBuilder || function(context, path) {
			return as.generics.button.builder(context, path, {});
		}

		function entryBuilderBound(context, path, attributes) {
			return entryBuilder(context, path, attributes, viewBuilder);
		}

		var properties = {
			template: template,
			entryBuilder: entryBuilderBound,
			branchBuilder: branchBuilder
		};

		return as.generics.tree.builder(context, '', properties, Class).setContent(editMenu);
	}

	return tree;
});