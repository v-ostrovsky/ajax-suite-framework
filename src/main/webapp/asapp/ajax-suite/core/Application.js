define([ './WindowManager', './Contextmenu' ], function(WindowManager, Contextmenu) {
	"use strict";

	/*
	 * ------------- APPLICATION CLASS --------------
	 */
	function Application(template) {
		this.element = $('<div name="application"></div>').attr({
			tabindex : 0
		}).css({
			height : '100%'
		}).appendTo('body').append(template);

		this.application = this;

		$('<div name="windows"></div>').appendTo(this.element);
		this.windowManager = new WindowManager(this);

		this.contextmenu = new Contextmenu(this);

		this.element.on({
			focusin : function(event) {
				this._on_(this, 'control:focusin', event);
			}.bind(this)
		});
	}

	Application.prototype._on_ = function(control, eventType, data) {
		if ([ 'control:focusin' ].includes(eventType)) {
			if (control === this) {
				this.focus();
			} else if (control.context === this) {
				this.setActiveElement(control).focus();
			}
		}
		if ([ 'control:showcontextmenu' ].includes(eventType)) {
			this.contextmenu.show(data.left, data.top, data.contextmenuItems);
		}

		this.on(control, eventType, data);
	}

	Application.prototype.on = function(control, eventType, data) {}

	Application.prototype.getDefaultActiveElement = function() {
		var activeKey = Object.keys(this.controls).find(function(key) {
			return this.controls[key].isVisible();
		}.bind(this));

		return activeKey ? this.controls[activeKey] : null;
	}

	Application.prototype.setActiveElement = function(control) {
		Object.keys(this.controls).forEach(function(key) {
			(this.controls[key] != control) ? this.controls[key].setActiveStatus('none') : null;
		}.bind(this));

		return this.activeElement = control;
	}

	Application.prototype.focus = function(element) {
		var activeElement = element || this.activeElement || this.getDefaultActiveElement();
		if (activeElement) {
			activeElement.focus();
		}

		return this;
	}

	Application.prototype.addContent = function(controls) {
		controls.forEach(function(item) {
			var control = item.builder(this);
			if (control) {
				this.controls[item.name] = control;
			}
		}.bind(this));

		return this.focus();
	}

	Application.prototype.setContent = function(controls) {
		this.controls = {};
		return this.addContent(controls);
	}

	Application.prototype.addWindow = function(windowBuilder, isDialog) {
		return this.windowManager.addWindow(windowBuilder, isDialog);
	}

	return Application;
});