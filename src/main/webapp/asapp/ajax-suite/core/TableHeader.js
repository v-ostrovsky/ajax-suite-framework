define([ './Control' ], function(Control) {
	"use strict";

	// TODO Подумать о том, чтобы сделать table.header, подобно table.footer, в виде list

	/*
	 * ------------- TABLE HEADER CLASS --------------
	 */
	// , handleBuilder
	function TableHeader(context, path, template, parameters) {
		Control.call(this, context, path, template);

		this.handle = parameters.handleBuilder(this);
		this.handle.element.removeAttr('tabindex');
	}
	TableHeader.prototype = Object.create(Control.prototype);
	TableHeader.prototype.constructor = TableHeader;

	TableHeader.prototype.addContent = function(fieldBuilders) {
		var fields = this.fields.concat(fieldBuilders.map(function(item) {
			var field = item(this);
			field.element.removeAttr('tabindex');
			return field;
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