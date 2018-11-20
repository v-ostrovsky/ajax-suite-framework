define([ 'core/Application', 'core/Window' ], function(Class, Window) {
	"use strict";

	/*
	 * ------------- CUSTOM WINDOW CLASS --------------
	 */
	function CustomWindow(context, contentBuilder) {
		Window.call(this, context, contentBuilder);
	}
	CustomWindow.prototype = Object.create(Window.prototype);
	CustomWindow.prototype.constructor = CustomWindow;

	CustomWindow.prototype.setActiveStatus = function(state) {
		this.handle.element.toggleClass('window-handle-selected', [ 'active', 'inactive' ].includes(state));
		return Window.prototype.setActiveStatus.call(this, state);
	}

	/*
	 * ------------- GENEGIC APPLICATION CLASS --------------
	 */
	function Application(template, daoBuilder) {
		Class.call(this, template);

		(daoBuilder) ? this.dao = daoBuilder(this.application) : null;
	}
	Application.prototype = Object.create(Class.prototype);
	Application.prototype.constructor = Application;

	Application.prototype.addWindow = function(contentBuilder, isDialog) {
		var windowBuilder = function(context) {
			return new CustomWindow(context, contentBuilder)
		}.bind(this);

		return Class.prototype.addWindow.call(this, windowBuilder, isDialog);
	}

	return Application;
});