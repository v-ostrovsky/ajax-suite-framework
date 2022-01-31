define([ '../Primitive', '../Control', '../Selector' ], function(Primitive, Control, Selector) {
	"use strict";

	/*
	 * ------------- BOX SELECTOR CLASS --------------
	 */
	function SelectorBox(context, path, template, parameters) {
		Primitive.call(this, context, path, template, parameters);

		this.selector = new Selector(this, '', 'create:<div></div>');
	}
	SelectorBox.prototype = Object.create(Primitive.prototype);
	SelectorBox.prototype.constructor = SelectorBox;

	SelectorBox.prototype.on = function(control, eventType, data) {
		if ([ 'item:selected' ].includes(eventType) && (control === this.selector)) {
			this.fire(data);
			return false;
		}
		if ([ 'control:tabulate' ].includes(eventType) && (control === this.selector)) {
			this.send(eventType, data);
			return false;
		}

		return Primitive.prototype.on.call(this, control, eventType, data);
	}

	SelectorBox.prototype.setSelector = function(selectorBuilder) {
		this.selector.element.remove();
		this.selector = selectorBuilder(this);

		return this;
	}

	SelectorBox.prototype.setHandler = function(handler) {
		this.handler = handler;
		return this;
	}

	SelectorBox.prototype.fire = function(data) {
		this.element.removeClass('warn');
		this.element.removeClass('error');
		(typeof this.handler === 'function') ? this.handler(this, data) : this.send('control:changed');

		return this;
	}

	SelectorBox.prototype.getDefaultActiveElement = function() {
		return this.selector;
	}

	SelectorBox.prototype.getData = function() {
		return this.selector.getData();
	}

	SelectorBox.prototype.getItem = function(value) {
		return this.selector.getItem(value);
	}

	SelectorBox.prototype.getView = function() {
		var item = this.getItem();
		return item ? item.getView() : null;
	}

	SelectorBox.prototype.setValue = function(value) {
		this.selector.setValue(value)
		return this;
	}

	SelectorBox.prototype.getValue = function() {
		return this.selector.getValue();
	}

	return SelectorBox;
});