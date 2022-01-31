define(['as'], function(as) {
	"use strict";

	var Class = as.generics.panel.Class;

	/*
	 * ------------- FEEDBACK PANEL CLASS --------------
	 */
	function Panel(context, path, template) {
		Class.call(this, context, path, template);

		this.daoRecaptcha = as.dao.recaptcha(this.application);
		this.isNewChat = true;
	}
	Panel.prototype = Object.create(Class.prototype);
	Panel.prototype.constructor = Panel;

	Panel.prototype._toggleView_ = function(listIsNotEmpty) {
		if (listIsNotEmpty && this.isNewChat) {
			this.isNewChat = false;

			this.element.find('[name="reCAPTCHA"]').hide();
			this.controls['lstSubscription'].require().setVisibility(true);
			this.controls['addMessages'].setVisibility(true);
		}
	}

	Panel.prototype._clearEditor_ = function() {
		this.editor.setData('');
		this.editor.commands.get('undo').clearStack();
	}

	Panel.prototype.on = function(control, eventType, data) {
		if (['list:load'].includes(eventType) && ['list'].includes(control.name)) {
			this._toggleView_(data);
			return false;
		}
		if (['control:escape'].includes(eventType) && ['editor'].includes(control.name)) {
			this._clearEditor_();
			return false;
		}

		return Class.prototype.on.call(this, control, eventType, data);
	}

	Panel.prototype.onContainerDestroy = function() {
		this.editor.destroy();
	}

	Panel.prototype.create = function(self) {

		var create = function(data) {
			return this.controls['list'].create({
				content: data
			}).execute(function(response) {
				this._clearEditor_();
			}.bind(this));
		}.bind(this);

		var editorData = this.editor.getData();
		if (editorData) {
			if (this.controls['list'].indexChatId) {
				create(editorData);
			} else {
				grecaptcha.ready(function() {
					grecaptcha.execute(as.RECAPTCHA_SITE_KEY, { action: 'submit' }).then(function(response) {
						this.daoRecaptcha = this.daoRecaptcha.validate({
							response: response
						}).execute(
							function(response) {
								create(editorData).execute(function(response) {
									this.controls['list'].indexChatId = response[0]['id'];
									this._toggleView_(true);
								}.bind(this));
							}.bind(this),
							function(response) {
								var onOk = function(windowContent) {
									windowContent.send('control:destroy');
								}.bind(this);

								this.focus().application.showErrorMessage.bind(this.application)(response, onOk, this.element);
							}.bind(this));
					}.bind(this));
				}.bind(this));
			}
		}
	}

	Panel.prototype.addMessages = function() {
		this.controls['list'].addMessages();
	}

	Panel.prototype.execute = function(callback) {
		this.controls['list'].execute(function(response) {
			callback(response, this);
		}.bind(this));

		return this;
	}

	Panel.prototype.init = function(noEditorToolbar) {
		CKEditor
			.create(this.controls['editor'].getSourceElement()[0], {
				language: (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage || '',
				ckfinder: {
					uploadUrl: window.location.pathname + 'api/app/img/'
				}
			})
			.then(function(editor) {
				this.controls['editor'].ondropfocus(function(event) {
					editor.editing.view.focus();
				}).focus();

				if (!noEditorToolbar) {
					this.addContent([{
						name: 'editorToolbar',
						builder: function(context) {
							var properties = {
								editor: editor,
								exclude: ['fontFamily', 'fontSize', 'heading', 'underline', 'strikethrough', 'red', 'alignment', 'outdent', 'indent', 'bulletedList', 'numberedList', 'flexSection', 'imageStyled', 'blockQuote']
							};

							return as.uio.ckeditorToolbar(context, '*/editorToolbar', properties);
						}
					}]);
				}

				var undoCommand = editor.commands.get('undo');
				undoCommand.on('change:isEnabled', function() {
					this.controls['create'].setVisibility(undoCommand.isEnabled);
				}.bind(this));

				editor.editing.view.document.on('keydown', function(event, data) {
					if ([13].includes(data.keyCode)) {
						if (data.ctrlKey) {
							event.stop();
							data.preventDefault();
							this.create();
						}
					}
				}.bind(this), {
					priority: 'high'
				});

				return this.editor = editor;
			}.bind(this));

		return this;
	}

	return Panel;
});