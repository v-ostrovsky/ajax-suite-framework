define([ './WindowManager', './Contextmenu' ], function(WindowManager, Contextmenu) {
	"use strict";

	/*
	 * ------------- APPLICATION CLASS --------------
	 */
	function Application(template) {
		this.element = $('body').empty().append(template);

		this.application = this;

		$('<div name="windows"></div>').appendTo(this.element);
		this.windowManager = new WindowManager(this);

		this.contextmenu = new Contextmenu(this);
	}

	Application.prototype._on_ = function(control, eventType, data) {
		if ([ 'control:showcontextmenu' ].includes(eventType)) {
			this.contextmenu.show(data.left, data.top, data.contextmenuItems);
		}

		this.on(control, eventType, data);
	}

	Application.prototype.on = function(control, eventType, data) {}

	Application.prototype.addContent = function(controls) {
		controls.forEach(function(item) {
			var control = item.builder(this);
			if (control) {
				this.controls[item.name] = control;
			}
		}.bind(this));

		return this;
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