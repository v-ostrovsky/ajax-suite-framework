define([ './Control' ], function(Control) {
	"use strict";

	var primitives = {};

	/*
	 * ------------- LABEL CLASS --------------
	 */
	function Label(context, name, text) {
		Control.call(this, context, name);

		this.element.prepend(text || '');
	}
	Label.prototype = Object.create(Control.prototype);
	Label.prototype.constructor = Label;

	primitives.Label = Label;

	/*
	 * ------------- TOOLTIP CLASS --------------
	 */
	function Tooltip(context, name, text, mousePosition) {
		Control.call(this, context, name);

		this.element.html(text).addClass('tooltip').css({
			'position' : 'absolute',
			'z-index' : '999'
		});

		var position = {
			left : mousePosition.clientX + 5,
			top : mousePosition.clientY - parseInt(this.element.outerHeight()) - 5
		};

		var exceeding = {
			left : position.left + parseInt(this.element.outerWidth()) - $(window).width() + 5,
			top : -position.top + 5
		};

		this.element.offset({
			'left' : position.left - ((exceeding.left > 0) ? exceeding.left : 0),
			'top' : position.top + ((exceeding.top > 0) ? exceeding.top : 0)
		});
	}
	Tooltip.prototype = Object.create(Control.prototype);
	Tooltip.prototype.constructor = Tooltip;

	primitives.Tooltip = Tooltip;

	/*
	 * ------------- BUTTON CLASS --------------
	 */
	function Button(context, name, handler, tooltip, image) {
		Control.call(this, context, name);

		this.handler = handler;

		if (tooltip) {
			var hoverEvent = null, mousePosition = {};

			function onMouseMove(event) {
				mousePosition = {
					clientX : event.clientX,
					clientY : event.clientY
				};
			};

			this.element.hover(function(event) {
				hoverEvent = event;
				$(document).on('mousemove', onMouseMove);

				setTimeout(function() {
					if (hoverEvent === event) {
						this.element.append('<div name="tooltip"></div>')
						this.tooltip = new Tooltip(this, 'tooltip', tooltip, mousePosition);
					}
				}.bind(this), 1000);
			}.bind(this), function(event) {
				hoverEvent = null, mousePosition = {};
				$(document).off('mousemove', null, onMouseMove);
				mousePosition = {};

				if (this.tooltip) {
					this.tooltip.element.remove();
					delete this.tooltip;
				}
			}.bind(this));
		}

		if (image) {
			this.backdrop = $('<div name="backdrop"></div>').css({
				background : 'white',
				width : '100%',
				height : '100%',
				opacity : 1
			}).appendTo(this.element);

			$(image).appendTo(this.backdrop).css({
				width : '100%',
				height : '100%'
			});
		}

		this.element.on({
			keydown : function(event) {
				if ([ 13 ].includes(event.which)) {
					event.preventDefault();
					this.click();
				}
			}.bind(this),
			mousedown : function(event) {
				event.preventDefault();
				((event.which || 1) === 1) ? this.click() : null;
			}.bind(this)
		});
	}
	Button.prototype = Object.create(Control.prototype);
	Button.prototype.constructor = Button;

	Button.prototype.click = function() {
		this.handler(this);
	}

	Button.prototype.disabled = function(flag) {
		this.element.prop('disabled', flag);
		this.backdrop ? this.backdrop.css('opacity', flag ? 0.4 : 1) : null;
		return this;
	}

	Button.prototype.setValue = function(value) {
		this.element.html(value);
		return this;
	}

	Button.prototype.getValue = function() {
		return this.element.html();
	}

	primitives.Button = Button;

	/*
	 * ------------- BUTTON FILE CLASS --------------
	 */
	function ButtonFile(context, name, handler, tooltip, image) {
		Button.call(this, context, name, handler, tooltip, image);
	}
	ButtonFile.prototype = Object.create(Button.prototype);
	ButtonFile.prototype.constructor = ButtonFile;

	ButtonFile.prototype.click = function() {
		$('<input type="file" />').on({
			change : function(event) {
				this.handler(this, event.target.files);
			}.bind(this)
		}).click();
	}

	primitives.ButtonFile = ButtonFile;

	/*
	 * ------------- BUTTON TOGGLE CLASS --------------
	 */
	function ButtonToggle(context, name, handler, tooltip, image) {
		Button.call(this, context, name, handler, tooltip, image);
	}
	ButtonToggle.prototype = Object.create(Button.prototype);
	ButtonToggle.prototype.constructor = ButtonToggle;

	ButtonToggle.prototype.toggle = function(flag) {
		this.state = !!flag;
		this.element.toggleClass('button-pressed', this.state);

		return this;
	}

	ButtonToggle.prototype.click = function() {
		this.toggle(!this.state);
		Button.prototype.click.call(this);
	}

	primitives.ButtonToggle = ButtonToggle;

	/*
	 * ------------- FIELD CLASS --------------
	 */
	function Field(context, name, formatter, calculator, inputMaskBuilder) {
		Control.call(this, context, name);
		this.fn = this._fnName_();

		this.formatter = (typeof formatter === 'function') ? formatter : function(value) {
			return value;
		};
		this.calculator = calculator;

		if (typeof inputMaskBuilder === 'function') {
			inputMaskBuilder(this);
		}

		this.element.on({
			input : function(event) {
				this.value = this.formatter(this.element[this.fn]());
				this.send('field:input', event);
			}.bind(this),
			change : function(event) {
				event.stopPropagation();
				this.send('control:changed', event);
			}.bind(this)
		});

		this.ondropfocus(this.setSelectionRange.bind(this));
	}
	Field.prototype = Object.create(Control.prototype);
	Field.prototype.constructor = Field;

	Field.prototype._fnName_ = function() {
		var tagName = this.element.prop('tagName');
		if ([ 'INPUT', 'SELECT', 'TEXTAREA' ].includes(tagName)) {
			return 'val';
		} else {
			return 'html';
		}
	}

	Field.prototype.on = function(control, eventType, data) {
		if ([ 'control:focusout' ].includes(eventType)) {
			this.element[this.fn](this.formatter(this.value));
		}

		return Control.prototype.on.call(this, control, eventType, data);
	}

	Field.prototype.setSelectionRange = function() {
		((typeof this.element[0].setSelectionRange === 'function') && (this.element.attr('type') != 'date')) ? this.element[0].setSelectionRange(0, this.element[this.fn]().length) : null;
	}

	Field.prototype.setValue = function(value) {
		this.value = (typeof this.calculator === 'function') ? this.calculator(this.context, this, value) : value;
		this.element[this.fn](this.formatter(this.value));

		return this;
	}

	Field.prototype.getValue = function() {
		return this.value;
	}

	primitives.Field = Field;

	/*
	 * ------------- RADIO CLASS --------------
	 */
	function Radio(context, name) {
		Control.call(this, context, name);
		this.radios = this.element.find('[type="radio"]');
	}
	Radio.prototype = Object.create(Control.prototype);
	Radio.prototype.constructor = Radio;

	Radio.prototype.on = function(control, eventType, data) {
		if ([ 'control:leftright' ].includes(eventType)) {
			this.nextItem((data.which === 38) ? -1 : 1);
		}
	}

	Radio.prototype.getActiveElement = function() {
		return this.radios.filter(function(index, item) {
			return item.checked;
		})[0];
	}

	Radio.prototype.nextItem = function(backforth) {
		var itemId = this.radios.index(this.getActiveElement());
		var nextItem = (this.radios.length > 1) ? this.radios[(itemId < this.radios.length - 1) ? itemId + backforth : 0] : null;
		nextItem.checked = true;
	}

	Radio.prototype.setValue = function(value) {
		this.radios.filter(function(index, item) {
			return item.value === value;
		})[0].checked = true;

		return this;
	}

	Radio.prototype.getValue = function() {
		return this.getActiveElement().value;
	}

	primitives.Radio = Radio;

	return primitives;
});
