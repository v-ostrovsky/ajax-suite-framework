define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.selectorDropdown.Class;

	/*
	 * ------------- EDITOR ALIGNMENT CLASS --------------
	 */
	function Alignment(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	Alignment.prototype = Object.create(Class.prototype);
	Alignment.prototype.constructor = Alignment;

	Alignment.prototype._onChangeValue_ = function() {
		this.setValue(this.command.value);
	}

	Alignment.prototype.executeCommand = function() {
		if (this.getValue() != this.command.value) {
			this.command.execute({
				value : this.getValue()
			});
		}
	}

	Alignment.prototype.init = function(editor) {
		this.command = editor.commands.get(this.name);

		this.configOptions = [ 'left', 'center', 'right', 'justify' ].map(function(item, index) {
			var element = $('<div>').addClass('button button-image').css({
				'margin' : '0px 1px'
			}).attr({
				name : item
			});

			return {
				name : item,
				builder : function(context) {
					var properties = {
						template : 'create:' + element[0].outerHTML,
						tooltip : as.locale.editor['alignment'].options[item],
						content : as.icons.editor['alignment'][item]
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

	return Alignment;
});