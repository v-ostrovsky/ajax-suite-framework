define(['as'], function(as) {
	"use strict";

	var Class = as.generics.selectorDropdown.Class;

	/*
	 * ------------- EDITOR FONT SIZE CLASS --------------
	 */
	function FontSize(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	FontSize.prototype = Object.create(Class.prototype);
	FontSize.prototype.constructor = FontSize;

	FontSize.prototype._onChangeValue_ = function() {
		this.setValue(parseInt(this.command.value) || 'default');
	}

	FontSize.prototype.executeCommand = function() {
		this.command.execute({
			value: this.getValue() + 'px'
		});
	}

	FontSize.prototype.init = function(editor) {
		this.command = editor.commands.get(this.name);

		var configOptions = this.command.editor.config.get('fontSize.options').map(function(item, index) {
			return {
				id: item,
				sort: index,
				textId: as.locale.editor['fontSize'].options[item] || item
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

	return FontSize;
});