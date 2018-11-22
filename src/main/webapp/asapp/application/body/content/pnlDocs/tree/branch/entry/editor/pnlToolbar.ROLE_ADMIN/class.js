define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.panel.Class;

	/*
	 * ------------- EDITOR TOOLBAR CLASS --------------
	 */
	function Panel(context, name, template) {
		Class.call(this, context, name, template);

		this.editorToolbar = this.element.find('[name="toolbar"]');
	}
	Panel.prototype = Object.create(Class.prototype);
	Panel.prototype.constructor = Panel;

	Panel.prototype.setEditableMode = function(flag) {
		if (flag) {
			this.editorToolbar.append($(this.context.editor.ui.view.toolbar.element).children());
		} else {
			this.editorToolbar.empty();
		}

		this.controls['edit'].setVisibility(!flag);
		this.controls['cancel'].setVisibility(flag);
		this.controls['submit'].setVisibility(flag);
		this.setActiveElement(null);
	}

	Panel.prototype.edit = function() {
		this.send('toolbar:togglemode', 'edit').focus();
	}

	Panel.prototype.submit = function() {
		this.send('toolbar:togglemode', 'submit').focus();
	}

	Panel.prototype.cancel = function() {
		this.send('toolbar:togglemode', 'cancel').focus();
	}

	return Panel;
});