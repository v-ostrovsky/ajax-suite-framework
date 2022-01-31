define(['as'], function(as) {
	"use strict";

	var Class = as.generics.selectorDropdown.Class;

	/*
	 * ------------- EDITOR FONT FAMILY CLASS --------------
	 */
	function FontFamily(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	FontFamily.prototype = Object.create(Class.prototype);
	FontFamily.prototype.constructor = FontFamily;

	FontFamily.prototype._onChangeValue_ = function() {
		this.setValue(this.command.value || 'default');
	}

	FontFamily.prototype.executeCommand = function() {
		this.command.execute({
			value: this.getValue()
		});
	}

	FontFamily.prototype.init = function(editor) {
		this.command = editor.commands.get(this.name);

		var configOptions = this.command.editor.config.get('fontFamily.options').map(function(item, index) {
			return {
				id: item,
				sort: index,
				textId: $('<div>').append($('<span>').css({
					'font-family': item
				}).html(as.locale.editor['fontFamily'].options[item] || item.split(',')[0])).html()
			};
		});

		this.setSelector(as.utils.syncSelectors.list(configOptions, {
			sortFields: [{
				name: 'sort',
				comparator: as.locale.localeCompare.bind(null, 'number')
			}]
		}));

		this.command.on('change:value', function() {
			this._onChangeValue_();
		}.bind(this));
		this._onChangeValue_();

		return this;
	}

	return FontFamily;
});