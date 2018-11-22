define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.panel.Class;

	/*
	 * ------------- EDITOR CLASS --------------
	 */
	function Editor(context, name, template) {
		Class.call(this, context, name, template);
	}
	Editor.prototype = Object.create(Class.prototype);
	Editor.prototype.constructor = Editor;

	Editor.prototype.on = function(control, eventType, data) {
		if ([ 'toolbar:togglemode' ].includes(eventType) && (control.context === this)) {
			if ([ 'edit' ].includes(data)) {
				var config = {
					ckfinder : {
						uploadUrl : window.location.pathname + 'api/upload/'
					}
				};

				DecoupledEditor.create(this.controls['content'].editorContent[0], config).then(function(editor) {
					this.editor = editor;
					this.editor.sourceElement.focus();
					this.data = this.editor.getData();
					this.controls['toolbar'].setEditableMode(true);
					this.controls['content'].setEditableMode(true);
				}.bind(this));
			} else {
				if ([ 'submit' ].includes(data)) {
					var attributes = Object.assign(this.attributes, {
						content : this.editor.getData()
					});

					this.dao = this.dao.edit(attributes);
				}
				if ([ 'cancel' ].includes(data)) {
					this.editor.setData(this.data);
				}

				delete this.data;
				this.editor.destroy();
				delete this.editor;
				this.controls['toolbar'].setEditableMode(false);
				this.controls['content'].setEditableMode(false);
			}

			return false;
		}

		return Class.prototype.on.call(this, control, eventType, data);
	}

	Editor.prototype.setActiveStatus = function(state) {
		!this.controls['toolbar'] ? this.element.toggleClass('control-active', [ 'active' ].includes(state)) : null;
		return Class.prototype.setActiveStatus.call(this, state);
	}

	Editor.prototype.setContent = function(controls) {
		Class.prototype.setContent.call(this, controls);
		this.controls['toolbar'] ? this.controls['toolbar'].setEditableMode(false) : null;
		this.controls['content'].setEditableMode(false);

		return this;
	}

	Editor.prototype.fetchContent = function(dao) {
		this.dao = dao.execute(function(response) {
			this.attributes = response[0];
			this.controls['content'].element.find('[name="editor"]').html(this.attributes['content']);
		}.bind(this));

		return this;
	}

	return Editor;
});