define([ './Control' ], function(Control) {
	"use strict";

	/*
	 * ------------- PANEL CLASS --------------
	 */
	function Panel(context, name, template) {
		Control.call(this, context, name, template);
	}
	Panel.prototype = Object.create(Control.prototype);
	Panel.prototype.constructor = Panel;

	Panel.prototype.on = function(control, eventType, data) {
		if ([ 'control:focusin' ].includes(eventType) && (control.context === this)) {
			if (control != this.activeElement) {
				this.setActiveElement(control);
			}
			this.send(eventType, data).activeElement.focus();
			return false;
		}
		if ([ 'control:tabulate' ].includes(eventType) && (control.context === this)) {
			this.nextControl(control, data);
			return false;
		}
		if ([ 'control:changed', 'field:input' ].includes(eventType) && (control.context === this)) {
			this.calculate();
			return false;
		}
	}

	Panel.prototype.addContent = function(controls) {
		controls.forEach(function(item) {
			var control = item.builder(this);
			if (control) {
				this.controls[item.name] = control;
				this.controls[item.name].tabindex = parseInt(this.controls[item.name].element.attr('tabindex'));
			}
		}.bind(this));

		this.tabLoop = Object.keys(this.controls).filter(function(key) {
			return this.controls[key].tabindex;
		}.bind(this)).sort(function(a, b) {
			var result = (this.controls[a].tabindex - this.controls[b].tabindex);
			if (!result) {
				console.error('More than one element with tabindex=' + this.controls[a].tabindex + ' was found as a child of', this);
			}
			return result;
		}.bind(this)).map(function(key, index) {
			this.controls[key].setItemId(this, index);
			return this.controls[key];
		}.bind(this));

		return this;
	}

	Panel.prototype.setContent = function(controls) {
		this.controls = {};
		this.tabLoop = [];
		return this.addContent(controls);
	}

	Panel.prototype.nextControl = function(control, shift) {
		var next = function(control, shift) {
			var index;
			if (shift === 1) {
				index = control ? control.itemId + shift : 0;
				index = (index > this.tabLoop.length - 1) ? null : index;
			}
			if (shift === -1) {
				index = control ? control.itemId + shift : this.tabLoop.length - 1;
				index = (index < 0) ? null : index;
			}

			if (index === null) {
				this.send('control:tabulate', shift);
				return null;
			} else {
				var nextControl = this.tabLoop[index].focus();
				if (typeof nextControl.nextControl === 'function') {
					nextControl.nextControl(null, shift);
					return null;
				} else {
					return nextControl;
				}
			}
		}.bind(this);

		var nextControl = next(control, shift);
		while (nextControl && !nextControl.isActive && (nextControl != control)) {
			nextControl = next(nextControl, shift);
		}
	}

	Panel.prototype.getDefaultActiveElement = function() {
		return this.tabLoop.find(function(item) {
			return item.isVisible();
		});
	}

	Panel.prototype.setActiveElement = function(control) {
		this.tabLoop.forEach(function(item) {
			(item != control) ? item.setActiveStatus('none') : null;
		});

		return this.activeElement = control;
	}

	Panel.prototype.calculate = function() {
		for ( var item in this.controls) {
			if (typeof this.controls[item].calculator === 'function') {
				this.controls[item].setValue(this.controls[item].getValue());
			}
		}

		return this;
	}

	return Panel;
});