define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.selectorDropdown.Class;

	/*
	 * ------------- EDITOR HEADING CLASS --------------
	 */
	function Heading(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	Heading.prototype = Object.create(Class.prototype);
	Heading.prototype.constructor = Heading;

	Heading.prototype._onChangeValue_ = function() {
		this.setValue(this.command.value || 'paragraph');
	}

	Heading.prototype.executeCommand = function() {
		this.command.execute({
			value : this.getValue()
		});
	}

	Heading.prototype.init = function(editor) {
		this.command = editor.commands.get(this.name);

		this.configOptions = this.command.editor.config.get('heading.options').map(function(item) {
			var element = $('<div>').addClass('button button-list').attr({
				name : item.model
			});

			return {
				name : item.model,
				builder : function(context) {
					var properties = {
						template : 'create:' + element[0].outerHTML,
						defaultValue : item.model,
						content : as.locale.editor['heading'].options[item.model] || item.model
					};

					return as.generics.button.builder(context, '', properties);
				}
			};
		});
		this.selector.setContent(this.configOptions);

		this.command.on('change:value', function(eventInfo) {
			this._onChangeValue_();
		}.bind(this));
		this._onChangeValue_();

		return this;
	}

	return Heading;
});