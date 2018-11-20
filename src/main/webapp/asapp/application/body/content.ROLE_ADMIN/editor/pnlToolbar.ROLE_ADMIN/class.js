define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.panel.Class;

	/*
	 * ------------- CKEDITOR TOOLBAR PANEL CLASS --------------
	 */
	function Panel(context, name, template) {
		Class.call(this, context, name, template);
	}
	Panel.prototype = Object.create(Class.prototype);
	Panel.prototype.constructor = Panel;

	Panel.prototype._setEditable_ = function(flag) {
		this.controls['edit'].setVisibility(!flag);
		this.controls['cancel'].setVisibility(flag);
		this.controls['submit'].setVisibility(flag);
		this.setActiveElement(null);

		this.context.controls['content'].element.toggleClass('ck ck-content', !flag);
	}

	Panel.prototype._close_ = function() {
		this.context.editor.destroy();
		delete this.context.editor;
		this.toolbar.empty();
		delete this.context.data;

		this._setEditable_(false);
		this.focus();
	}

	Panel.prototype.setContent = function(controls) {
		Class.prototype.setContent.call(this, controls);

		this.toolbar = this.element.find('[name="toolbar"]');

		this.context.controls['content'].element.on({
			keydown : function(event) {
				if ([ 9 ].includes(event.which)) {
					event.preventDefault();
					event.stopPropagation();
					this.context.focus();
				}
			}.bind(this)
		});

		this._setEditable_(false);

		return this;
	}

	Panel.prototype.edit = function() {
		this._setEditable_(true);

		var config = {
			ckfinder : {
				uploadUrl : window.location.pathname + 'api/upload/'
			}
		};

		DecoupledEditor.create(this.context.controls['content'].element[0], config).then(function(editor) {
			this.context.editor = editor;
			this.context.editor.sourceElement.focus();
			this.context.data = this.context.editor.getData();

			this.toolbar.append($(editor.ui.view.toolbar.element).children());
		}.bind(this));
	}

	Panel.prototype.cancel = function() {
		this.context.editor.setData(this.context.data);
		this._close_();
	}

	Panel.prototype.submit = function() {
		var attributes = Object.assign(this.context.attributes, {
			content : this.context.editor.getData()
		});

		this.context.dao.edit(attributes);
		this._close_();
	}

	return Panel;
});