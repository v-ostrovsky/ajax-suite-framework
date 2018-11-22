define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.control.Class;

	/*
	 * ------------- EDITOR CONTENT CLASS --------------
	 */
	function Content(context, name, template) {
		Class.call(this, context, name, template);

		this.editorContent = this.element.find('[name="editor"]');
	}
	Content.prototype = Object.create(Class.prototype);
	Content.prototype.constructor = Content;

	Content.prototype.setActiveStatus = function(state) {
		if (this.context.controls['toolbar']) {
			this.element.toggleClass('control-active', [ 'active' ].includes(state));
		}

		return Class.prototype.setActiveStatus.call(this, state);
	}

	Content.prototype.setEditableMode = function(flag) {
		this.element.toggleClass('ck ck-content', !flag);
	}

	return Content;
});