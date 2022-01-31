define(['./CurtainManager', './WindowManager', './Window', './Contextmenu'], function(CurtainManager, WindowManager, Window, Contextmenu) {
	"use strict";

	/*
	 * ------------- APPLICATION CLASS --------------
	 */
	function Application(template) {
		this.element = $(template).appendTo('body');

		this.application = this;

		$('<div>').attr({
			'name': 'curtains'
		}).appendTo(this.element);
		this.curtainManager = new CurtainManager(this, 'curtains');

		$('<div>').attr({
			'name': 'windows'
		}).appendTo(this.element);
		this.windowManager = new WindowManager(this, 'windows');

		this.contextmenu = new Contextmenu(this);

		this.element.on({
			focusin: function(event) {
				this._on_(this, 'control:focusin', event);
			}.bind(this)
		});
	}

	Application.prototype._on_ = function(control, eventType, data) {
		if (['control:showcontextmenu'].includes(eventType)) {
			this.contextmenu.show(data.left, data.top, data.contextmenuItems);
		}

		this.on(control, eventType, data);
	}

	Application.prototype.on = function(control, eventType, data) { }

	Application.prototype.getDefaultActiveElement = function() {
		var activeKey = Object.keys(this.controls).find(function(key) {
			return this.controls[key].isVisible();
		}.bind(this));

		return activeKey ? this.controls[activeKey] : null;
	}

	Application.prototype.setActiveElement = function(control) {
		(this.activeElement && (this.activeElement !== control)) ? this.activeElement.setActiveStatus('none') : null;
		(control && !control.isActive) ? control.setActiveStatus('inactive') : null;

		this.activeElement = (control || null);

		return this.activeElement;
	}

	Application.prototype.focus = function(element) {
		var curtains = this.curtainManager.curtains;
		var activeElement = element || (curtains.length ? curtains[curtains.length - 1] : this.activeElement) || this.getDefaultActiveElement();
		if (activeElement) {
			activeElement.focus();
		}

		return this;
	}

	Application.prototype.addContent = function(controls) {
		controls.forEach(function(item, index) {
			var control = item.builder(this);
			if (control) {
				this.controls[item.name] = control.setItemId(this, index);
			}
		}.bind(this));

		return this.focus();
	}

	Application.prototype.setContent = function(controls) {
		this.controls = {};
		return this.addContent(controls);
	}

	Application.prototype.addCurtains = function(contentBuilders) {
		return this.curtainManager.addCurtains(contentBuilders);
	}

	Application.prototype.addCurtain = function(contentBuilder, animation) {
		return this.curtainManager.addCurtain(contentBuilder, animation);
	}

	Application.prototype.removeCurtains = function(curtains) {
		return this.curtainManager.removeCurtains(curtains);
	}

	Application.prototype.removeCurtain = function(curtain, animation) {
		return this.curtainManager.removeCurtain(curtain, animation);
	}

	Application.prototype.addWindow = function(contentBuilder, isDialog, css) {
		return this.windowManager.addWindow(contentBuilder, isDialog, css);
	}

	Application.prototype.showDialog = function(contentBuilder, header, css) {
		function windowContentBuilder(context, path) {
			var properties = {
				onOk: function(windowContent) {
					windowContent.send('control:destroy');
				}
			};

			return contentBuilder(context, path, properties);
		}

		var asWindow = this.addWindow(windowContentBuilder, true, css);
		header ? asWindow.setHeader(header) : null;

		return asWindow;
	}

	return Application;
});