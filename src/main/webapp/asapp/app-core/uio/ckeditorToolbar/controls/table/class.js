define([ 'as', './selectInsert/builder', './selectEdit/builder' ], function(as, selectInsertBuilder, selectEditBuilder) {
	"use strict";

	var Class = as.generics.selectorDropdown.Class;

	/*
	 * ------------- EDITOR TABLE CLASS --------------
	 */
	function Table(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	Table.prototype = Object.create(Class.prototype);
	Table.prototype.constructor = Table;

	Table.prototype._onChangeEnabled_ = function() {
		if (this.command.isEnabled) {
			this.setSelect(function(context) {
				return selectInsertBuilder(context).init(this.command);
			}.bind(this)).setTooltip(as.locale.editor['table']['titleInsert']);
			this.display.setContent(as.icons.editor['table']['tableInsert']);
		} else {
			this.setSelect(function(context) {
				return selectEditBuilder(context);
			}.bind(this)).setTooltip(as.locale.editor['table']['titleEdit']);
			this.display.setContent(as.icons.editor['table']['tableEdit']);
		};
	}

	Table.prototype.executeCommand = function() {
		this.select.executeCommand();
	}

	Table.prototype.init = function(editor) {
		this.command = editor.commands.get('insertTable');

		this.command.on('change:isEnabled', function(eventInfo, domEventData) {
			this._onChangeEnabled_();
		}.bind(this));
		this._onChangeEnabled_();

		this.view = null;
		editor.editing.downcastDispatcher.on('selection', function(event, data, conversionApi) {
			var model = data.selection.focus.getAncestors().find(function(element) {
				return element.is('element', 'table');
			});

			var view = editor.editing.mapper.toViewElement(model);
			if (!!view && !!this.view && (view != this.view)) {
				conversionApi.writer.removeClass('control-active', this.view);
				conversionApi.writer.addClass('control-active', view);
				this.view = view;
			} else {
				if (!!view && !this.view) {
					conversionApi.writer.addClass('control-active', view);
					this.view = view;
				}
				if (!view && !!this.view) {
					conversionApi.writer.removeClass('control-active', this.view);
					this.view = null;
				}
			}

		}.bind(this));

		// Array.from(editor.commands).forEach(function(item) {
		// console.log(item[0], item[1]._events);
		// Object.keys(item[1]._events).forEach(function(key) {
		// item[1].on(key, function(eventInfo) {
		// console.log(key, eventInfo);
		// });
		// });
		// });

		return this;
	}

	return Table;
});