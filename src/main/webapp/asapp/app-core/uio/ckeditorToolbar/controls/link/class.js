define(['as', './form/builder'], function(as, formBuilder) {
	"use strict";

	var Class = as.generics.button.Class;

	/*
	 * ------------- EDITOR LINK CLASS --------------
	 */
	function Link(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	Link.prototype = Object.create(Class.prototype);
	Link.prototype.constructor = Link;

	Link.prototype._showForm_ = function() {
		this.application.showDialog(as.utils.assignProperties(formBuilder, {
			attributes: {
				href: null
			},
			onOk: function(windowContent) {
				this.commandLink.execute(windowContent.attributes['href']);
				windowContent.send('control:destroy');
			}.bind(this)
		}), null, {
			'width': '80%',
			'max-width': '400px'
		});
	}

	Link.prototype._onChangeValue_ = function() {
		var href = this.commandLink.value;
		this.isLink = (!!href && !['?'].includes(href.charAt(0)));

		this.element.toggleClass('button-pressed', this.isLink);
	}

	Link.prototype.executeCommand = function() {
		this.isLink ? this.commandUnlink.execute() : this._showForm_();
	}

	Link.prototype.init = function(editor) {
		this.commandLink = editor.commands.get('link');
		this.commandUnlink = editor.commands.get('unlink');

		this.commandLink.on('change:value', function(eventInfo) {
			this._onChangeValue_();
		}.bind(this));
		this._onChangeValue_();

		return this;
	}

	return Link;
});