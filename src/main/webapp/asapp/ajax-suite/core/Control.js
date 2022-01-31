define([], function() {
	"use strict";

	/*
	 * ------------- CONTROL ABSTRACT CLASS --------------
	 */
	function Control(context, path, template) {
		Control.instanceId = (Control.instanceId === undefined) ? 0 : Control.instanceId + 1;
		this.instanceId = Control.instanceId;

		this.application = context.application;
		this.context = context;
		this.element = this.getElement(this.context.element, path, template);

		if (!this._allowedTags().includes(this.element.prop('tagName'))) {
			console.warn('Invalid element tag "' + this.element.prop('tagName') + '" in ', this);
		}

		var tabindex = this.element.attr('tabindex');
		this.tabindex = ([undefined, 'none'].includes(tabindex)) ? undefined : parseInt(tabindex);

		this.name = this.element.attr('name');

		this._onfocus = [];
		this._ondropfocus = [];
		this._ondrag = [];
		this._ondrop = [];

		this.activeElement = null;
		this.contextmenuItems = [];

		this.element.on({
			keydown: function(event) {
				if ([9].includes(event.which)) {
					event.preventDefault();
					event.stopPropagation();
					this._on_(this, 'control:tabulate', 1);
				}
				if ([12].includes(event.which)) {
					event.stopPropagation();
					this._on_(this, 'control:into', event);
				}
				if ([13].includes(event.which)) {
					event.stopPropagation();
					this._on_(this, 'control:enter', event);
				}
				if ([27].includes(event.which)) {
					event.stopPropagation();
					this._on_(this, 'control:escape', event);
				}
				if ([38, 40].includes(event.which)) {
					event.preventDefault();
					event.stopPropagation();
					this._on_(this, 'control:updown', event);
				}
				if ([37, 39].includes(event.which)) {
					event.preventDefault();
					event.stopPropagation();
					this._on_(this, 'control:leftright', event);
				}
			}.bind(this),
			mousedown: function(event) {
				if (event.cancelable) {
					event.stopPropagation();
					(event.which !== 1) ? event.preventDefault() : null;
				}
			}.bind(this),
			focusin: function(event) {
				event.stopPropagation();
				this._on_(this, 'control:focusin', event);
			}.bind(this),
			focusout: function(event) {
				event.stopPropagation();
				this._on_(this, 'control:focusout', event);
			}.bind(this),
			focus: function(event) {
				this._onfocus.forEach(function(item) {
					item(event);
				});
			}.bind(this)
		});
	}

	Control.prototype._on_ = function(control, eventType, data) {
		if (['control:focusin'].includes(eventType)) {
			if (!this.isActive) {
				// console.log(eventType, this);
				this.setActiveStatus('active');
			}
		}
		if (['control:focusout'].includes(eventType)) {
			if (!this.element.is(data.relatedTarget) && !this.element.has(data.relatedTarget).length) {
				// console.log(eventType, this);
				(this.isActive) ? this.setActiveStatus('inactive') : null;
			} else {
				return;
			}
		}
		if (['control:showcontextmenu'].includes(eventType)) {
			data.contextmenuItems = data.contextmenuItems.concat(this.contextmenuItems);
		}

		var isPropagationAllowed = this.on(control, eventType, data);
		(isPropagationAllowed !== false) ? this.context._on_(control, eventType, data) : null;
	}

	Control.prototype._allowedTags = function() {
		return ['DIV'];
	}

	Control.prototype.getElement = function(contextElement, path, template) {
		var element = contextElement, fn = 'children';
		path.split('/').forEach(function(item) {
			if (item === '*') {
				fn = 'find';
			} else {
				element = (item) ? element[fn]('[name="' + item + '"]') : element;
				fn = 'children';
			}
		});

		if (element.length === 0) {
			console.error('No "' + path + '" element was found as a child of', contextElement);
		}
		if (element.length > 1) {
			console.error('More than one "' + path + '" element was found as a child of', contextElement);
		}

		if (template && (template.slice(0, 7) === 'create:')) {
			var template = template.slice(7), $template = $(template);
			return ($template.length === 1) ? $template.appendTo(element) : element.append(template);
		} else {
			return element.append(template || '');
		}
	}

	Control.prototype.on = function(control, eventType, data) { }

	Control.prototype.send = function(eventType, data) {
		this.context._on_(this, eventType, data);
		return this;
	}

	Control.prototype.requestUpward = function(eventType) {
		var response = {};
		this.send(eventType, response);
		return response[eventType.split('.')[1]];
	}

	Control.prototype.setItemId = function(root, itemId) {
		this.root = root;
		this.itemId = itemId;
		return this;
	}

	Control.prototype.setActiveStatus = function(status) {
		this.isActive = (status === 'active');

		if (this.isActive && this.root && (this.root.activeElement !== this)) {
			this.root.setActiveElement(this);
		}

		return this;
	}

	Control.prototype.setActiveElement = function(control) {
		(this.activeElement && (this.activeElement !== control)) ? this.activeElement.setActiveStatus('none') : null;
		(control && !control.isActive) ? control.setActiveStatus('inactive') : null;

		return this.activeElement = (control || null);
	}

	Control.prototype.getDefaultActiveElement = function() {
		return null;
	}

	Control.prototype.onfocus = function(handler) {
		this._onfocus.push(handler);
		return this;
	}

	Control.prototype.ondropfocus = function(handler) {
		this._ondropfocus.push(handler);
		return this;
	}

	Control.prototype.focus = function(element, options) {
		options = options || {};

		var activeElement = element || this.activeElement || this.getDefaultActiveElement();
		if (activeElement && !activeElement.isActive) {
			activeElement.focus(null, options);
		} else {
			if (!this.element.is(document.activeElement) && !this.isActive) {
				this.element.get(0).focus(options);
				// console.log('focus', this.element.is(document.activeElement), this);
				this._ondropfocus.forEach(function(item) {
					item(event);
				});
			}
		}

		return this;
	}

	Control.prototype.ondragdrop = function(ondrag, ondrop) {
		this._ondrag = (ondrag) ? [ondrag] : [];
		this._ondrop = (ondrop) ? [ondrop] : [];
		return this;
	}

	Control.prototype.dragdropInit = function(event, data) {
		var handlers = this._ondrag;
		var ondrag = function(event) {
			handlers.forEach(function(item) {
				item(event, data);
			});
		};

		$(document).on({
			mousemove: ondrag
		}).one('mouseup', function(event) {
			$(document).off('mousemove', null, ondrag);
			this._ondrop.forEach(function(item) {
				item(event, data);
			});
		}.bind(this));
	}

	Control.prototype.setContextmenu = function(contextmenuItems) {
		if (contextmenuItems && contextmenuItems.length) {
			this.contextmenuItems = contextmenuItems.map(function(item) {
				return Object.assign({
					source: this
				}, item);
			}.bind(this));

			this.element.on({
				contextmenu: function(event) {
					event.preventDefault();
					event.stopPropagation();
					var data = {
						left: event.clientX,
						top: event.clientY,
						contextmenuItems: this.contextmenuItems
					};

					this.send('control:showcontextmenu', data);
				}.bind(this)
			});
		}

		return this;
	}

	Control.prototype.setVisibility = function(flag) {
		if (flag) {
			this.element.show();
		} else {
			this.element.hide();
		}

		return this;
	}

	Control.prototype.isVisible = function() {
		return (this.element[0].offsetHeight) ? true : false;
	}

	Control.prototype.disable = function(flag) {
		return this;
	}

	Control.prototype.isDisabled = function() {
		return false;
	}

	Control.prototype.setValue = function(value) {
		return this;
	}

	Control.prototype.getValue = function() {
		return null;
	}

	return Control;
});