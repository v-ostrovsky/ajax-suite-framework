define([ '../Primitive' ], function(Primitive) {
	"use strict";

	/*
	 * ------------- BUTTON CLASS --------------
	 */
	function Button(context, path, template, parameters) {
		Primitive.call(this, context, path, template, parameters);

		this.element.css({
			'display' : 'flex'
		}).on({
			keydown : function(event) {
				if ([ 13 ].includes(event.which)) {
					event.preventDefault();
					!this.isDisabled() ? this.fire() : null;
				}
			}.bind(this),
			mousedown : function(event) {
				event.preventDefault();
				(((event.which || 1) === 1) && !this.isDisabled()) ? this.fire() : null;
			}.bind(this)
		});
	}
	Button.prototype = Object.create(Primitive.prototype);
	Button.prototype.constructor = Button;

	Button.prototype.setHandler = function(handler) {
		this.handler = handler;
		return this;
	}

	Button.prototype.fire = function() {
		(typeof this.handler === 'function') ? this.handler(this) : this.send('control:changed');
		return this;
	}

	Button.prototype.disable = function(flag) {
		this._isDisabled_ = flag;
		this.view.css({
			'opacity' : flag ? '0.4' : '1.0'
		});

		if (this.tabindex !== undefined) {
			this.element.attr({
				tabindex : flag ? 'none' : this.tabindex
			});
		} else {
			this.element.removeAttr("tabindex");
		}

		return this;
	}

	Button.prototype.isDisabled = function() {
		return this._isDisabled_;
	}

	Button.prototype.setView = function(content) {
		var view = (content !== undefined) ? content : '';

		if (typeof content === 'string') {
			view = $('<div>').html(content).css({
				'flex' : '1'
			});

			if (view.find('svg').length) {
				view = $(content).clone().css({
					'width' : '100%',
					'height' : '100%'
				});
			}

			this.view = view.appendTo(this.element.html(''));
		}

		return this;
	}

	Button.prototype.getView = function() {
		return this.view;
	}

	Button.prototype.setValue = function(value) {
		this.value = value;
		return this.setView(this.formatter(this.value, this));
	}

	return Button;
});