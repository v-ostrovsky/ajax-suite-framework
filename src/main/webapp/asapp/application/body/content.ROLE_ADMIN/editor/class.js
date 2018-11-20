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

	Editor.prototype.fetchContent = function(dao) {
		this.dao = dao.execute(function(response) {
			this.attributes = response[0];
			this.controls['content'].element.html(this.attributes['content']);
		}.bind(this));

		return this;
	}

	return Editor;
});