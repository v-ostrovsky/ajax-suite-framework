define([ './Control' ], function(Control) {
	"use strict";

	/*
	 * ------------- TABLE HANDLE CLASS --------------
	 */
	function TableHandle(context, path) {
		Control.call(this, context, path);

		this.element.attr({
			'tabindex' : 0
		}).on({
			mousedown : function(event) {
				if (event.which === 1) {
					event.preventDefault();
					this.send('handle:mousedown', event);
				}
			}.bind(this),
			dblclick : function(event) {
				this.send('handle:dblclick');
			}.bind(this)
		});
	}
	TableHandle.prototype = Object.create(Control.prototype);
	TableHandle.prototype.constructor = TableHandle;

	TableHandle.prototype.setValue = function(value) {
		this.element.html(value);
		return this;
	}

	TableHandle.prototype.getValue = function() {
		return this.element.html();
	}

	return TableHandle;
});