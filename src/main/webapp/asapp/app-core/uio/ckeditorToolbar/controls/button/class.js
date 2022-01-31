define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.button.Class;

	/*
	 * ------------- EDITOR BUTTON CLASS --------------
	 */
	function Button(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	Button.prototype = Object.create(Class.prototype);
	Button.prototype.constructor = Button;

	Button.prototype._onChangeValue_ = function() {
		this.element.toggleClass('button-pressed', !!this.command.value);
	}

	Button.prototype._onChangeEnabled_ = function() {
		this.disable(!this.command.isEnabled);
	}

	Button.prototype.executeCommand = function() {
		this.command.execute();
	}

	Button.prototype.init = function(editor) {
		this.command = editor.commands.get(this.name);

		this.command.on('change:value', function() {
			this._onChangeValue_();
		}.bind(this));
		this._onChangeValue_();

		this.command.on('change:isEnabled', function() {
			this._onChangeEnabled_();
		}.bind(this));
		this._onChangeEnabled_();

		return this;
	}

	return Button;
});