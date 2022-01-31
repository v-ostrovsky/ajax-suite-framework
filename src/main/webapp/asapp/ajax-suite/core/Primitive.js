define([ './Control', './Label' ], function(Control, Label) {
	"use strict";

	/*
	 * ------------- TOOLTIP CLASS --------------
	 */
	function Tooltip(element, text, mousePosition) {
		this.element = element;

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

	/*
	 * ------------- PRIMITIVE CLASS --------------
	 */
	function Primitive(context, path, template, parameters) {
		Control.call(this, context, path, template);

		if (parameters.text) {
			this.label = new Label(this.context, path + '-label').setText(parameters.text);
		}

		this.formatter = function(value, self) {
			return value;
		};

		this.validator = function(self) {
			return true;
		};

		this.value = null;
	}
	Primitive.prototype = Object.create(Control.prototype);
	Primitive.prototype.constructor = Primitive;

	Primitive.prototype._setTooltip = function(element, text) {
		var hoverEvent = null, mousePosition = {}, isTouchStarted = false;

		function onMouseMove(event) {
			mousePosition = {
				clientX : event.clientX,
				clientY : event.clientY
			};
		};

		element.mouseleave().off('mouseenter mouseleave').on({
			touchstart : function(event) {
				isTouchStarted = true;
			}.bind(this),
			mouseenter : function(event) {
				if (!isTouchStarted) {
					isTouchStarted = false;

					hoverEvent = event;
					$(document).on('mousemove', onMouseMove);

					setTimeout(function() {
						if (hoverEvent === event && !this.tooltip) {
							var tooltipElement = $('<div name="tooltip"></div>').appendTo(element.parent());
							this.tooltip = new Tooltip(tooltipElement, text, {
								clientX : mousePosition.clientX || event.clientX,
								clientY : mousePosition.clientY || event.clientY
							});
						}
					}.bind(this), 1000);
				}
			}.bind(this),
			mouseleave : function(event) {
				hoverEvent = null, mousePosition = {};
				$(document).off('mousemove', null, onMouseMove);

				if (this.tooltip) {
					this.tooltip.element.remove();
					delete this.tooltip;
				}
			}.bind(this)
		});

		return this;
	}

	Primitive.prototype.setActiveStatus = function(status) {
		this.element.toggleClass('control-active', [ 'active' ].includes(status));
		this.element.toggleClass('control-inactive', [ 'inactive' ].includes(status));

		return Control.prototype.setActiveStatus.call(this, status);
	}

	Primitive.prototype.setVisibility = function(flag) {
		this.label ? this.label.setVisibility(flag) : null;
		return Control.prototype.setVisibility.call(this, flag);
	}

	Primitive.prototype.setTooltip = function(text) {
		return this._setTooltip(this.element, text);
	}

	Primitive.prototype.setFormatter = function(formatter) {
		this.formatter = formatter;
		return this;
	}

	Primitive.prototype.setValidator = function(validator) {
		this.validator = validator;
		return this;
	}

	Primitive.prototype.validate = function() {
		var status = this.validator(this);
		this.element.toggleClass('warn', status === 'warn');
		this.element.toggleClass('error', status === 'error');

		return status;
	}

	Primitive.prototype.setValue = function(value) {
		this.value = value;
		this.element.html(this.formatter(this.value, this));

		return this;
	}

	Primitive.prototype.getValue = function() {
		return this.value;
	}

	return Primitive;
});