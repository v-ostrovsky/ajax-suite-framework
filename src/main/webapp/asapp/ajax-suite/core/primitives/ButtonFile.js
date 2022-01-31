define([ './Button' ], function(Button) {
	"use strict";

	/*
	 * ------------- BUTTON FILE CLASS --------------
	 */
	function ButtonFile(context, path, template, parameters) {
		Button.call(this, context, path, template, parameters);
	}
	ButtonFile.prototype = Object.create(Button.prototype);
	ButtonFile.prototype.constructor = ButtonFile;

	ButtonFile.prototype.fire = function(data) {
		$('<input type="file" />').on({
			change : function(event) {
				var files = event.target.files;
				(typeof this.handler === 'function') ? this.handler(this, files) : this.send('control:changed', files);
			}.bind(this)
		}).click();

		return this;
	}

	return ButtonFile;
});