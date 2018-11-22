define([ './Panel' ], function(Panel) {
	"use strict";

	/*
	 * ------------- TABLE FOOTER CLASS --------------
	 */
	function TableFooter(context, name, template, handleBuilder) {
		Panel.call(this, context, name, template);

		this.element.css({
			'box-sizing' : 'content-box'
		});

		this.handle = handleBuilder(this);
	}
	TableFooter.prototype = Object.create(Panel.prototype);
	TableFooter.prototype.constructor = TableFooter;

	TableFooter.prototype.setInvisible = function(fieldNames) {
		Object.keys(this.controls).forEach(function(key) {
			var item = this.controls[key];
			item.setVisibility(!fieldNames.includes(item.name));
		}.bind(this));

		return this;
	}

	return TableFooter;
});