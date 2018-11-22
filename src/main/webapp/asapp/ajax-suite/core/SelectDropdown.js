define([ './Control', './Select', './primitives', './Backdrop' ], function(Control, Select, primitives, Backdrop) {
	"use strict";

	var Button = primitives.Button;

	/*
	 * ------------- INPUT CLASS --------------
	 */
	function Input(context, name) {
		Control.call(this, context, name);

		this.ondropfocus(this.setSelectionRange.bind(this));
	}
	Input.prototype = Object.create(Control.prototype);
	Input.prototype.constructor = Input;

	Input.prototype.setSelectionRange = function() {
		(typeof this.element[0].setSelectionRange === 'function') ? this.element[0].setSelectionRange(0, this.element.val().length) : null;
	}

	/*
	 * ------------- DROPDOWN CLASS --------------
	 */
	function Dropdown(context, name) {
		Select.call(this, context, name);

		this.hide();
	}
	Dropdown.prototype = Object.create(Select.prototype);
	Dropdown.prototype.constructor = Dropdown;

	Dropdown.prototype.on = function(control, eventType, data) {
		if ([ 'control:changed' ].includes(eventType) && (control === this.content)) {
			return false;
		}
		if ([ 'entry:mousedown' ].includes(eventType)) {
			this.value = this.content.getValue();
			this.send('control:changed');
			return false;
		}

		return Select.prototype.on.call(this, control, eventType, data);
	}

	Dropdown.prototype.show = function() {
		this.element.show();
		this.visible = true;
	}

	Dropdown.prototype.hide = function() {
		this.element.hide();
		this.visible = false;
	}

	/*
	 * ------------- DROPDOWN SELECT CLASS --------------
	 */
	function SelectDropdown(context, name) {
		Control.call(this, context, name);

		this.element.css({
			'position' : 'relative'
		});

		var buttonWidth = '20px';

		/* ------------ input ------------ */
		this.element.append('<input name="input">');
		this.input = new Input(this, 'input');

		this.input.element.css({
			'position' : 'absolute',
			'top' : 0,
			'left' : 0,
			'box-sizing' : 'border-box',
			'height' : '100%',
			'width' : '100%',
			'border' : 'inherit',
			'border-color' : 'rgb(255, 255, 255, 0)',
			'padding' : 'inherit'
		}).css({
			'padding-right' : buttonWidth
		}).on({
			input : function(event) {
				if (event.originalEvent.data) {
					var text = this.input.element.val(), item = this._getEntryByText_(text);
					if (item) {
						this._setValueByEntry_(item).input.element[0].setSelectionRange(text.length, item.getText().length);
					}
				} else {
					this.dropdown.setValue(null).focus();
					this.value = null;
				}
				this.send('control:changed');
			}.bind(this)
		});

		/* ------------ buttons ------------ */
		var btnCss = {
			'background-color' : 'transparent',
			'position' : 'absolute',
			'top' : 0,
			'box-sizing' : 'border-box',
			'height' : '100%',
			'text-align' : 'center',
			'line-height' : this.element.css('height'),
			'color' : 'initial'
		};

		this.element.append('<div name="button"></div>');
		this.btn = new Button(this, 'button', function() {
			this.send('control:click');
		}).setValue('&#x25BC');

		this.btn.element.css(Object.assign({}, btnCss, {
			'right' : 0,
			'width' : buttonWidth,
			'font-size' : '10px'
		}));

		this.element.append('<div name="clear"></div>');
		this.clear = new Button(this, 'clear', function() {
			this.send('control:click');
		}).setValue('&#x25BC');

		this.clear.hidden = true;
		this.clear.element.css(Object.assign({}, btnCss, {
			'right' : buttonWidth,
			'width' : 0.5 * buttonWidth,
			'font-size' : '8px'
		})).hide();

		/* ------------ dropdown ------------ */
		this.element.append('<div name="dropdown"></div>');
		this.dropdown = new Dropdown(this, 'dropdown');

		this.dropdown.element.css({
			'background-color' : 'white',
			'position' : 'absolute',
			'top' : this.element.css('height'),
			'left' : 'calc(0px - ' + this.element.css('border-left-width') + ')',
			'box-sizing' : 'border-box',
			'max-height' : '200px',
			'min-width' : 'calc(100% + ' + this.element.css('border-left-width') + ' + ' + this.element.css('border-right-width') + ')',
			'border' : '1px solid #aaa',
			'overflow' : 'auto',
			'color' : 'initial'
		});
	}
	SelectDropdown.prototype = Object.create(Control.prototype);
	SelectDropdown.prototype.constructor = SelectDropdown;

	SelectDropdown.prototype._show_ = function() {
		if (this.dropdown.content) {
			this.backdrop = new Backdrop(this, function(initiator, event) {
				initiator._hide_();
			}).setZIndex(999);
			this.dropdown.show();
			this.dropdown.content.focus();
		}
	}

	SelectDropdown.prototype._hide_ = function() {
		if (this.dropdown.isVisible()) {
			this.backdrop.destroy();
			delete this.backdrop;
			this.dropdown.hide();
		}
	}

	SelectDropdown.prototype._getEntryByText_ = function(text) {
		if (text) {
			return this.dropdown.content.forEach(function(item) {
				if (item.getText().toUpperCase().startsWith(text.toUpperCase())) {
					this.dropdown.setValue(item.getValue());
					return item;
				}
			}.bind(this));
		} else {
			return this.dropdown.setValue(null);
		}
	}

	SelectDropdown.prototype._setValueByEntry_ = function(entry) {
		this.value = this.dropdown.getValue();
		this.input.element.val((entry) ? entry.getText() : '');

		return this;
	}

	SelectDropdown.prototype.on = function(control, eventType, data) {
		if ([ 'control:focusin', 'control:tabulate', 'control:updown', 'control:leftright' ].includes(eventType) && (control === this.input)) {
			this.send(eventType, data);
			return false;
		}
		if ([ 'control:into' ].includes(eventType) && (control === this.input)) {
			this._show_();
			return false;
		}
		if ([ 'control:click' ].includes(eventType) && (control === this.btn)) {
			this.input.focus();
			if (!this.dropdown.visible) {
				this._show_();
			} else {
				this.setValue(this.value);
				this._hide_();
			}
			return false;
		}
		if ([ 'control:click' ].includes(eventType) && (control === this.clear)) {
			this.input.focus();
			this.setValue();
			this.send('control:changed');
			return false;
		}
		if ([ 'control:updown' ].includes(eventType) && (control === this.input) && this.dropdown.visible) {
			var firstEntry = this.dropdown.content.firstEntry();
			(firstEntry) ? firstEntry.focus() : null;
			return false;
		}
		if ([ 'control:escape' ].includes(eventType)) {
			this.input.focus();
			this.setValue(this.value);
			this._hide_();
			return false;
		}
		if ([ 'control:changed' ].includes(eventType) && (control === this.dropdown)) {
			this.input.focus();
			this._setValueByEntry_(control.getEntry());
			this._hide_();
			this.send('control:changed');
			return false;
		}
	}

	SelectDropdown.prototype.onfocus = function(handler) {
		this.input._onfocus.push(handler);
		return this;
	}

	SelectDropdown.prototype.ondropfocus = function(handler) {
		this.input._ondropfocus.push(handler);
		return this;
	}

	SelectDropdown.prototype.getDefaultActiveElement = function() {
		return (this.dropdown.visible) ? this.dropdown : this.input;
	}

	SelectDropdown.prototype.showClear = function() {
		this.clear.hidden = false;
		this.clear.element.show();

		var buttonWidth = this.btn.element.css('width');
		this.input.element.css({
			'width' : '100%',
			'padding-right' : 'calc(1.5 * ' + buttonWidth + ')'
		});
	}

	SelectDropdown.prototype.disabled = function(flag) {
		if (flag) {
			this.btn.element.hide();
			this.clear.element.hide();
		} else {
			this.btn.element.show();
			!this.clear.hidden ? this.clear.element.show() : null;
		}
		this.input.element.prop('disabled', flag);

		return this;
	}

	SelectDropdown.prototype.setRepository = function() {
		this.dropdown.setRepository.call(this);
		return this;
	}

	SelectDropdown.prototype.destroyContent = function() {
		this.dropdown.destroyContent();
		return this;
	}

	SelectDropdown.prototype.buildContent = function(contentBuilder) {
		this.dropdown.buildContent(contentBuilder);
		return this;
	}

	SelectDropdown.prototype.setContent = function(data) {
		this.dropdown.setContent(data);
		return this;
	}

	SelectDropdown.prototype.getContent = function() {
		return this.dropdown.getContent();
	}

	SelectDropdown.prototype.expandDown = function() {
		this.dropdown.content.expandDown();
		return this;
	}

	SelectDropdown.prototype.getEntry = function() {
		return this.dropdown.getEntry();
	}

	SelectDropdown.prototype.getText = function() {
		return this.input.element.val();
	}

	SelectDropdown.prototype.setValue = function(value) {
		this.value = this.dropdown.setValue(value).getValue();
		var entry = this.dropdown.getEntry();
		this.input.element.val((entry) ? entry.getText() : '');

		return this;
	}

	SelectDropdown.prototype.getValue = function() {
		return this.value;
	}

	return SelectDropdown;
});
