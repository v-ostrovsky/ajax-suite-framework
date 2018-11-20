define([ './Control' ], function(Control) {
	"use strict";

	/*
	 * ------------- TABLE HEADER CLASS --------------
	 */
	function TableHeader(context, name, template, handleBuilder) {
		Control.call(this, context, name, template);

		this.handle = handleBuilder(this);
	}
	TableHeader.prototype = Object.create(Control.prototype);
	TableHeader.prototype.constructor = TableHeader;

	TableHeader.prototype.addContent = function(fieldBuilders) {
		var fields = this.fields.concat(fieldBuilders.map(function(item) {
			return item(this);
		}.bind(this)))

		var children = this.element.find('[name]');
		this.fields = fields.map(function(item) {
			return item.setItemId(this, children.index(item.element));
		}.bind(this)).sort(function(a, b) {
			return (a.itemId - b.itemId);
		}).map(function(item, index) {
			return item.setItemId(this, index);
		}.bind(this));

		return this;
	}

	TableHeader.prototype.setContent = function(fields) {
		this.fields = [];
		return this.addContent(fields);
	}

	TableHeader.prototype.setInvisible = function(fields) {
		this.fields.forEach(function(item) {
			item.setInvisible(fields.includes(item));
		});

		return this;
	}

	return TableHeader;
});