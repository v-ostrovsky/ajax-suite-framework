define([], function() {
	"use strict";

	/*
	 * ------------- WINDOW MANAGER CLASS --------------
	 */
	function WindowManager(context) {
		this.application = context;
		this.context = context;
		this.element = this.context.element.children('[name="windows"]');

		this.windows = [];
	}

	WindowManager.prototype._on_ = function(control, eventType, data) {
		if ([ 'control:focusin' ].includes(eventType) && (control.root === this)) {
			if (control != this.activeElement) {
				this.setActiveElement(control);
			}
			this.activeElement.focus();
			return false;
		}
		if ([ 'window:destroy' ].includes(eventType)) {
			this.removeWindow(control);
			return false;
		}

		this.context._on_(control, eventType, data);
	}

	WindowManager.prototype.setActiveElement = function(window) {
		(this.activeElement && (this.activeElement != window)) ? this.activeElement.setActiveStatus('none') : null;

		this.windows.splice(window.itemId, 1);
		this.windows.push(window);
		this.windows.forEach(function(item, i) {
			item.setItemId(this, i);
		}.bind(this));
		(window.backdrop) ? window.backdrop.appendTo(this.element) : window.element.appendTo(this.element);

		(window && !window.isActive) ? window.setActiveStatus('inactive') : null;

		return this.activeElement = window;
	}

	WindowManager.prototype.addWindow = function(windowBuilder, isDialog) {
		var window = windowBuilder(this).setItemId(this, this.windows.length);

		if (isDialog) {
			window.backdrop = window.element.wrap($('<div>').css({
				'position' : 'absolute',
				'top' : '0',
				'left' : '0',
				'width' : '100%',
				'height' : '100%'
			}).on({
				mousedown : function(event) {
					event.preventDefault();
					event.stopPropagation();
				}
			})).parent();
		}

		this.windows.push(window);

		return this.windows[this.windows.length - 1].focus();
	}

	WindowManager.prototype.removeWindow = function(window) {
		if (window === this.activeElement) {
			(window.backdrop) ? window.backdrop.remove() : window.element.remove();
			this.windows.splice(this.windows.length - 1, 1);
			(this.windows.length) ? this.windows[this.windows.length - 1].focus() : null;
		}
	}

	return WindowManager;
});