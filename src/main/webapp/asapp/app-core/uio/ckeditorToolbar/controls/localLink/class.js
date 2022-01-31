define(['as', './frmSelect/builder'], function(as, formBuilder) {
	"use strict";

	var Class = as.generics.button.Class;

	/*
	 * ------------- EDITOR INTERNAL LINK CLASS --------------
	 */
	function Link(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	Link.prototype = Object.create(Class.prototype);
	Link.prototype.constructor = Link;

	Link.prototype._showForm_ = function() {
		this.application.showDialog(as.utils.assignProperties(formBuilder, {
			attributes: {
				href: null,
				subhref: null
			},
			onOk: function(windowContent) {
				var route = this.application.router.directory.forEach(function(item) {
					if (item.attributes['id'] === windowContent.attributes['href']) {
						return item.getRoute();
					};
				}), subroute = windowContent.attributes['subhref'];

				this.commandLink.execute('?config=' + route + (subroute ? ':' + subroute : '') + ';0');
				windowContent.send('control:destroy');
			}.bind(this),
			data: this.application.router.directory.components.map(function(item) {
				return item.getData();
			})[0]
		}), null);
	}

	Link.prototype._onChangeValue_ = function() {
		var href = this.commandLink.value;
		this.isLocalLink = (!!href && ['?'].includes(href.charAt(0)));

		this.element.toggleClass('button-pressed', this.isLocalLink);
	}

	Link.prototype.executeCommand = function() {
		this.isLocalLink ? this.commandUnlink.execute() : this._showForm_();
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