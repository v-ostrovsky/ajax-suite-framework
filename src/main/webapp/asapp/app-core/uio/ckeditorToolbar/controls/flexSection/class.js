define(['as'], function(as) {
	"use strict";

	var Class = as.generics.button.Class;

	/*
	 * ------------- EDITOR FLEX SECTION CLASS --------------
	 */
	function FlexSection(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	FlexSection.prototype = Object.create(Class.prototype);
	FlexSection.prototype.constructor = FlexSection;

	FlexSection.prototype._onChangeValue_ = function() {
		this.element.toggleClass('button-pressed', !!this.command.value);
	}

	FlexSection.prototype._onChangeEnabled_ = function() {
		this.disable(!this.command.isEnabled);
	}

	FlexSection.prototype.executeCommand = function() {
		this.command.execute();
	}

	FlexSection.prototype.init = function(editor) {
		this.command = editor.commands.get('flexSection');

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

	return FlexSection;
});