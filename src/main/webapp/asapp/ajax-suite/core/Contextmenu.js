define([ './Backdrop' ], function(Backdrop) {
	"use strict";

	/*
	 * ------------- ITEM CLASS --------------
	 */
	function Item(context, source, text, hotkey, handler) {
		this.context = context;
		this.source = source;

		this.element = $('<div>').prependTo(context.element).addClass('contextmenu-item').html(text).append($('<div>').addClass('contextmenu-hotkey').css({
			'float' : 'right'
		}).html(hotkey));

		this.handler = handler;

		this._enable_();
	}

	Item.prototype._disable_ = function() {
		this.element.addClass('control-disabled').off('mousedown').on({
			mousedown : function(event) {
				event.preventDefault();
			}
		});
	}

	Item.prototype._enable_ = function() {
		this._disable_();
		this.element.removeClass('control-disabled').on({
			mousedown : function(event) {
				event.preventDefault();
				if (event.which === 1) {
					this.handler(this.source);
					this.context.hide();
				}
			}.bind(this)
		});
	}

	Item.prototype.setVisibility = function(flag) {
		if (flag) {
			this.element.show();
		} else {
			this.element.hide();
		}

		return this;
	}

	Item.prototype.disable = function(flag) {
		flag ? this._disable_() : this._enable_();
	}

	Item.prototype.getBadge = function() {
		return this.element.children('[name="badge"]').html();
	}

	Item.prototype.setBadge = function(value) {
		var badge = this.element.children('[name="badge"]');

		if (badge.length) {
			value ? badge.html(value) : badge.remove();
		} else if (value) {
			this.element.prepend($('<div>').attr({
				name : 'badge'
			}).css({
				'height' : '14px',
				'width' : '14px',
				'margin' : '0px -7px -14px',
				'background-color' : 'red',
				'border-radius' : '50%',
				'line-height' : '14px',
				'font-size' : '8px',
				'text-align' : 'center',
				'color' : 'white'
			}).html(value));
		}

		return this;
	}

	/*
	 * ------------- CONTEXT MENU CLASS --------------
	 */
	function Contextmenu(context) {
		this.context = context;

		this.template = $('<div>').addClass('contextmenu').css({
			'position' : 'fixed'
		});

		this.onKeydown = this.hide.bind(this);

		this.items = {};
	}

	Contextmenu.prototype.addItem = function(source, name, text, hotkey, handler, onshow) {
		this.items[name] = new Item(this, source, text, hotkey, handler);
		(typeof onshow === 'function') ? onshow(this.items[name], source) : null;
	}

	Contextmenu.prototype.show = function(left, top, contextmenuItems) {
		this.activeElement = $(document.activeElement).keydown(this.onKeydown);

		this.element = this.template.clone(true).appendTo('body');

		this.backdrop = new Backdrop(this, function(initiator, event) {
			initiator.hide();
		}).setZIndex(999);

		contextmenuItems.forEach(function(item) {
			this.addItem(item.source, item.name, item.text, item.hotkey, item.handler, item.onshow);
		}.bind(this));

		var shiftLeft = parseInt(this.element.css('margin-left')) + parseInt(this.element.css('margin-right'));
		var shiftTop = parseInt(this.element.css('margin-top')) + parseInt(this.element.css('margin-bottom'));
		var surplusWidth = (left + this.element.outerWidth()) - this.context.element.width();
		var surplusHeight = (top + this.element.outerHeight()) - this.context.element.height();

		this.element.css({
			'left' : left - ((surplusWidth > 0) ? (surplusWidth + shiftLeft) : 0),
			'top' : top - ((surplusHeight > 0) ? (surplusHeight + shiftTop) : 0)
		});

		this.element.on({
			mousedown : function(event) {
				event.preventDefault();
			},
			contextmenu : function(event) {
				event.preventDefault();
				event.stopPropagation();
			}
		});
	}

	Contextmenu.prototype.hide = function() {
		this.items = {};
		this.backdrop.destroy();
		delete this.backdrop;
		this.element.remove();
		delete this.element;
		this.activeElement.off('keydown', this.onKeydown);
		delete this.activeElement;
	}

	Contextmenu.prototype.isVisible = function() {
		return !!this.element;
	}

	return Contextmenu;
});