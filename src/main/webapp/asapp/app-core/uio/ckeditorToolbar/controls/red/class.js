define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.button.Class;

	/*
	 * ------------- EDITOR RED CLASS --------------
	 */
	function Red(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);

		this.redCode = 'rgb(255,0,0)';
	}
	Red.prototype = Object.create(Class.prototype);
	Red.prototype.constructor = Red;

	Red.prototype._onChangeValue_ = function() {
		this.setValue([ this.redCode ].includes(this.command.value));
		this.element.toggleClass('button-pressed', this.getValue());
	}

	Red.prototype._onChangeEnabled_ = function() {
		this.disable(!this.command.isEnabled);
	}

	Red.prototype.executeCommand = function() {
		this.getValue() ? this.command.execute() : this.command.execute({
			value : this.redCode
		});
	}

	Red.prototype.init = function(editor) {
		this.command = editor.commands.get('fontColor');

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

	return Red;
});