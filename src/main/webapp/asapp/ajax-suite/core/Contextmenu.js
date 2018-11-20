define([ './Backdrop' ], function(Backdrop) {
	"use strict";

	/*
	 * ------------- ITEM CLASS --------------
	 */
	function Item(context, source, text, hotkey, handler, disabled) {
		this.context = context;
		this.source = source;

		this.element = $('<div>').prependTo(context.element).css({
			'padding' : '8px 26px'
		}).hover(function(event) {
			$(this).css('background-color', '#eee');
		}, function(event) {
			$(this).css('background-color', 'white');
		}).html(text).append($('<div>').css({
			'float' : 'right',
			'padding-left' : '50px',
			'color' : '#aaa'
		}).html(hotkey));

		this.handler = handler;

		(disabled) ? this.disable() : this.enable();
	}

	Item.prototype.enable = function() {
		this.disable();
		this.element.css({
			'color' : '#000'
		}).on({
			mousedown : function(event) {
				event.preventDefault();
				if (event.which === 1) {
					this.handler(this.source);
					this.context.hide();
				}
			}.bind(this)
		});
	}

	Item.prototype.disable = function() {
		this.element.css({
			'color' : '#aaa'
		}).off('mousedown').on({
			mousedown : function(event) {
				event.preventDefault();
			}
		});
	}

	/*
	 * ------------- CONTEXT MENU CLASS --------------
	 */
	function Contextmenu(context) {
		this.context = context;

		this.template = $('<div>').css({
			'position' : 'fixed',
			'min-width' : '200px',
			'background-color' : 'white',
			'border' : '1px solid #aaa',
			'box-shadow' : '4px 4px 5px -3px rgba(0, 0, 0, .7)',
			'padding' : '2px 0px',
			'font-family' : 'Roboto, "Segoe UI", Tahoma, sans-serif',
			'line-height' : '0.6'
		});

		this.onKeydown = this.hide.bind(this);

		this.items = {};
	}

	Contextmenu.prototype.addItem = function(source, name, text, hotkey, handler, disabled) {
		this.items[name] = new Item(this, source, text, hotkey, handler, disabled);
	}

	Contextmenu.prototype.show = function(left, top, contextmenuItems) {
		this.activeElement = $(document.activeElement).keydown(this.onKeydown);

		this.element = this.template.clone(true).appendTo(this.context.element);

		this.backdrop = new Backdrop(this, function(initiator, event) {
			initiator.hide();
		}).setZIndex(999);

		contextmenuItems.forEach(function(item) {
			this.addItem(item.source, item.name, item.text, item.hotkey, item.handler, item.disabled);
		}.bind(this));

		var surplusWidth = (left + this.element.outerWidth()) - this.context.element.width();
		var surplusHeight = (top + this.element.outerHeight()) - this.context.element.height();
		this.element.css({
			'left' : left - ((surplusWidth > 0) ? surplusWidth : 0),
			'top' : top - ((surplusHeight > 0) ? surplusHeight : 0)
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

	return Contextmenu;
});