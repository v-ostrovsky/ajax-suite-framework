define(['./Control'], function(Control) {
	"use strict";

	/*
	 * ------------- CURTAIN CLASS --------------
	 */
	function Curtain(context, contentBuilder, animation) {
		Control.call(this, context, '', 'create:<div tabindex=0 name="curtain"></div>');

		this.root = this.context;

		this.element.css({
			'position': 'absolute',
			'top': '0',
			'left': '0',
			'width': '100%',
			'height': '100%',
			'display': 'flex'
		});

		this.content = contentBuilder(this, '');

		this.animation = animation;
	}
	Curtain.prototype = Object.create(Control.prototype);
	Curtain.prototype.constructor = Curtain;

	Curtain.prototype.on = function(control, eventType, data) {
		if (['control:focusin'].includes(eventType)) {
			this.send(eventType, data);
			return false;
		}
		if (['panel:loopend'].includes(eventType)) {
			control.nextControl(null, data);
			return false;
		}
		if (['content:request.route'].includes(eventType)) {
			Object.assign(data, {
				route: this.route
			});
			return false;
		}
		if (['control:destroy'].includes(eventType)) {
			this.destroy();
			return false;
		}
	}

	Curtain.prototype.getDefaultActiveElement = function() {
		return this.content;
	}

	Curtain.prototype.setCurtainId = function(curtainId) {
		this.curtainId = curtainId;
		return this;
	}

	Curtain.prototype.destroy = function() {
		return this.send('control:destroy');
	}

	return Curtain;
});