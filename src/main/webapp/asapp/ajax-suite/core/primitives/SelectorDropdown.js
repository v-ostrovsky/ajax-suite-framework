define([ '../Primitive', '../Control', '../Selector', '../Backdrop', './Input', './Button' ], function(Primitive, Control, Selector, Backdrop, Input, Button) {
	"use strict";

	/*
	 * ------------- INPUT CLASS --------------
	 */
	function DropdownInput(context, path, template, parameters) {
		Input.call(this, context, path, template, parameters);

		var findItemByText = function(text) {
			return this.context.selector.forEach(function(item) {
				if (text && item.getView().toUpperCase().startsWith(text.toUpperCase())) {
					return item;
				}
			}.bind(this)) || null;
		}.bind(this);

		this.formatter = function(value) {
			var entry = this.context.selector.getItem(value);
			return entry ? entry.getView() : null;
		}.bind(this);

		this.handler = function() {
			var item = findItemByText(this.getValue());
			this.context.setValue(item ? item.attributes.id : null);
			this.send('control:changed');
		}.bind(this);

		this.element.on({
			input : function(event) {
				if (event.originalEvent.data) {
					var inputText = this.element.val(), item = findItemByText(inputText);
					if (item) {
						this.context.selector.setActiveElement(item);
						this.element.val(item.getView());
						this.setSelectionRange(inputText.length, item.getView().length);
					}
				}
			}.bind(this)
		});
	}
	DropdownInput.prototype = Object.create(Input.prototype);
	DropdownInput.prototype.constructor = DropdownInput;

	DropdownInput.prototype.setActiveStatus = function(status) {
		return this;
	}

	/*
	 * ------------- SELECTOR DROPDOWN CLASS --------------
	 */
	function SelectorDropdown(context, path, template, parameters) {
		Primitive.call(this, context, path, template, parameters);

		this.element.addClass('dropdown').css({
			'position' : 'relative',
			'display' : 'flex'
		});

		/* ------------ buttons ------------ */
		var buttonWidth = '20px';

		this.element.css({
			'padding-right' : (parseInt(this.element.css('padding-right')) + parseInt(buttonWidth)) + 'px'
		});

		var btnCss = {
			'background-color' : 'transparent',
			'position' : 'absolute',
			'top' : 0,
			'height' : '100%',
			'line-height' : 'inherit',
			'text-align' : 'center',
			'color' : 'initial'
		};

		// TODO Переделать всюду предварительное создание элемента в передачу шаблона (атрибут name обязателен)
		this.btn = new Button(this, '', 'create:<div name="btn"></div>', {}).setView('&#x25BC');
		this.btn.element.css(btnCss).css({
			'right' : 0,
			'width' : buttonWidth,
			'margin-top' : '-1px',
			'font-family' : 'sans-serif',
			'font-size' : '0.9em'
		});

		this.clear = new Button(this, '', 'create:<div name="clear"></div>', {}).setView('&#x2573').setVisibility(false);
		this.clear.element.css(btnCss).css({
			'right' : buttonWidth,
			'width' : (0.5 * parseInt(buttonWidth)) + 'px',
			'margin-top' : '-1px',
			'font-family' : 'sans-serif',
			'font-size' : '0.8em'
		});

		/* ------------ display & selector ------------ */
		this.display = new DropdownInput(this, '', 'create:<input>', {});
		this._normaliseDisplayElement_();

		this.selector = new Selector(this, '', 'create:<div></div>').setVisibility(false);
		this._normaliseSelectorElement_();
	}
	SelectorDropdown.prototype = Object.create(Primitive.prototype);
	SelectorDropdown.prototype.constructor = SelectorDropdown;

	SelectorDropdown.prototype._normaliseDisplayElement_ = function() {
		this.display.element.css({
			'background' : 'inherit',
			'width' : '100%',
			'text-align' : 'inherit',
			'overflow' : 'hidden'
		}).attr({
			'name' : 'display'
		});

		this.display.element.on({
			keydown : function(event) {
				if ([ 13 ].includes(event.which)) {
					event.stopPropagation();
					this.selector.isVisible() ? null : this._show_();
				}
			}.bind(this)
		});
	}

	SelectorDropdown.prototype._normaliseSelectorElement_ = function(updown) {
		updown = updown || 'down';

		this.selector.element.css({
			'position' : 'absolute',
			'left' : 'calc(0px - ' + this.element.css('border-left-width') + ')',
			'box-sizing' : 'border-box',
			'height' : 'auto',
			'overflow-y' : 'auto',
			'min-width' : 'calc(100% + ' + this.element.css('border-left-width') + ' + ' + this.element.css('border-right-width') + ')',
			'max-height' : '200px'
		}).css({
			up : {
				'bottom' : this.element.outerHeight()
			},
			down : {
				'top' : this.element.outerHeight()
			}
		}[updown]).attr({
			'name' : 'selector'
		});

		return this;
	}

	SelectorDropdown.prototype._show_ = function() {
		this.backdrop = new Backdrop(this, function(initiator, event) {
			initiator._hide_();
		}).setZIndex(999);
		this.selector.setVisibility(true);
		this.selector.focus();
		return this;
	}

	SelectorDropdown.prototype._hide_ = function() {
		this.selector.focus(this.getItem(this.getValue()));
		this.backdrop.destroy();
		delete this.backdrop;
		this.selector.setVisibility(false);
		this.focus();
		return this;
	}

	SelectorDropdown.prototype.on = function(control, eventType, data) {
		if ([ 'control:focusin', 'control:tabulate', 'control:updown', 'control:leftright', 'control:changed' ].includes(eventType) && (control === this.display)) {
			this.send(eventType, data);
			return false;
		}
		if ([ 'control:changed' ].includes(eventType) && (control === this.btn)) {
			this.send('control:focusin');
			if (this.selector.isVisible()) {
				this._hide_();
			} else {
				this._show_();
			}
			return false;
		}
		if ([ 'control:changed' ].includes(eventType) && (control === this.clear)) {
			this.send('control:focusin');
			this.selector.isVisible() ? this._hide_() : null;
			this.setValue().send('control:changed');
			return false;
		}
		if ([ 'item:selected' ].includes(eventType) && (control === this.selector)) {
			this.setValue(control.getValue());
			this._hide_().fire(data);
			return false;
		}
		if ([ 'control:escape' ].includes(eventType) && (control === this.selector)) {
			this._hide_();
			return false;
		}
		if ([ 'control:tabulate' ].includes(eventType) && (control === this.selector)) {
			this._hide_().send(eventType, data);
			return false;
		}

		return Primitive.prototype.on.call(this, control, eventType, data);
	}

	SelectorDropdown.prototype.disable = function(flag) {
		if (this.tabindex !== undefined) {
			this.element.attr({
				tabindex : flag ? 'none' : this.tabindex
			});
		} else {
			this.element.removeAttr("tabindex");
		}

		this.display.disable(flag);
		this.btn.disable(flag);
		this.clear.disable(flag);

		this.element.css({
			'background' : this.display.element.css('background')
		});

		return this;
	}

	SelectorDropdown.prototype.isDisabled = function() {
		return this.display.isDisabled();
	}

	SelectorDropdown.prototype.setDisplay = function(displayBuilder) {
		this.display.element.remove();
		this.display = displayBuilder(this);

		return this._normaliseDisplayElement_();
	}

	SelectorDropdown.prototype.setSelector = function(selectorBuilder, updown) {
		this.selector.element.remove();
		this.selector = selectorBuilder(this).setVisibility(false);

		return this._normaliseSelectorElement_(updown);
	}

	SelectorDropdown.prototype.setHandler = function(handler) {
		this.handler = handler;
		return this;
	}

	SelectorDropdown.prototype.fire = function(data) {
		this.element.removeClass('warn');
		this.element.removeClass('error');
		(typeof this.handler === 'function') ? this.handler(this, data) : this.send('control:changed');

		return this;
	}

	SelectorDropdown.prototype.getDefaultActiveElement = function() {
		return this.display;
	}

	SelectorDropdown.prototype.setTooltip = function(text) {
		return this._setTooltip(this.display.element, text);
	}

	SelectorDropdown.prototype.showClear = function() {
		this.clear.setVisibility(true);

		this.element.css({
			'padding-right' : (parseInt(this.element.css('padding-right')) + parseInt(this.clear.element.css('width'))) + 'px'
		});
	}

	SelectorDropdown.prototype.getData = function() {
		return this.selector.getData();
	}

	SelectorDropdown.prototype.getItem = function(value) {
		return this.selector.getItem(value);
	}

	SelectorDropdown.prototype.getView = function() {
		var item = this.getItem();
		return item ? item.getView() : null;
	}

	SelectorDropdown.prototype.setValue = function(value) {
		this.value = value;
		this.selector.setValue(value);
		this.display.setValue(value);

		return this;
	}

	SelectorDropdown.prototype.getValue = function() {
		return this.value;
	}

	return SelectorDropdown;
});