define([ './primitives' ], function(primitives) {
	"use strict";

	var Field = primitives.Field;

	/*
	 * ------------- TABLE HANDLE CLASS --------------
	 */
	function TableHandle(context, name) {
		Field.call(this, context, name);

		this.element.css({
			'box-sizing' : 'content-box'
		});

		this.element.on({
			dblclick : function(event) {
				this.send('handle:dblclick');
			}.bind(this),
			mousedown : function(event) {
				if (event.shiftKey) {
					event.preventDefault();
				}
				if (event.which === 1) {
					this.send('handle:mousedown', event);
				}
			}.bind(this)
		});
	}
	TableHandle.prototype = Object.create(Field.prototype);
	TableHandle.prototype.constructor = TableHandle;

	return TableHandle;
});