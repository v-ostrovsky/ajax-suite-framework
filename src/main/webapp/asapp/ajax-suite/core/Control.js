define([], function() {
	"use strict";

	/*
	 * ------------- CONTROL ABSTRACT CLASS --------------
	 */
	function Control(context, name, template) {
		Control.instanceId = (Control.instanceId === undefined) ? 0 : Control.instanceId + 1;
		this.instanceId = Control.instanceId;

		this.application = context.application;
		this.context = context;

		var element = this.context.element, fn = 'children';
		name.split('/').forEach(function(item) {
			if (item === '*') {
				fn = 'find';
			} else {
				element = (item) ? element[fn]('[name="' + item + '"]') : element;
				fn = 'children';
			}
		});

		if (element.length === 0) {
			console.error('No "' + name + '" element was found as a child of', this.context.element);
		}
		if (element.length > 1) {
			console.error('More than one "' + name + '" element was found as a child of', this.context.element);
		}

		if (template && (template.slice(0, 7) === 'create:')) {
			var template = template.slice(7), $template = $(template);
			this.element = ($template.length === 1) ? $template.appendTo(element) : element.append(template);
		} else {
			this.element = element.append(template || '');
		}

		this.name = this.element.attr('name');

		this._onfocus = [];
		this._ondropfocus = [];
		this._ondrag = [];
		this._ondrop = [];

		this.contextmenuItems = [];

		this.element.on({
			keydown : function(event) {
				if ([ 9 ].includes(event.which)) {
					event.preventDefault();
					event.stopPropagation();
					this._on_(this, 'control:tabulate', event);
				}
				if ([ 12 ].includes(event.which)) {
					event.stopPropagation();
					this._on_(this, 'control:into', event);
				}
				if ([ 27 ].includes(event.which)) {
					event.stopPropagation();
					this._on_(this, 'control:escape', event);
				}
				if ([ 38, 40 ].includes(event.which)) {
					event.preventDefault();
					event.stopPropagation();
					this._on_(this, 'control:updown', event);
				}
				if ([ 37, 39 ].includes(event.which)) {
					event.preventDefault();
					event.stopPropagation();
					this._on_(this, 'control:leftright', event);
				}
			}.bind(this),
			mousedown : function(event) {
				event.stopPropagation();
				(event.which != 1) ? event.preventDefault() : null;
				(event.target.scrollHeight > event.target.clientHeight) ? event.preventDefault() : null;
				(this._ondrag.length + this._ondrop.length) ? this.dragdrop(event) : null;
			}.bind(this),
			focusin : function(event) {
				event.stopPropagation();
				this._on_(this, 'control:focusin', event);
			}.bind(this),
			focusout : function(event) {
				event.stopPropagation();
				this._on_(this, 'control:focusout', event);
			}.bind(this),
			focus : function(event) {
				this._onfocus.forEach(function(item) {
					item(event);
				});
			}.bind(this)
		});
	}

	Control.prototype._on_ = function(control, eventType, data) {
		if ([ 'control:focusin' ].includes(eventType)) {
			if (!this.isActive) {
				// console.log(eventType, this);
				this.setActiveStatus('active');
			}
		}
		if ([ 'control:focusout' ].includes(eventType)) {
			if (!this.element.is(data.relatedTarget) && !this.element.has(data.relatedTarget).length) {
				// console.log(eventType, this);
				(this.isActive) ? this.setActiveStatus('inactive') : null;
			} else {
				return;
			}
		}
		if ([ 'control:showcontextmenu' ].includes(eventType)) {
			data.contextmenuItems = data.contextmenuItems.concat(this.contextmenuItems);
		}

		var isPropagationAllowed = this.on(control, eventType, data);
		(isPropagationAllowed !== false) ? this.context._on_(control, eventType, data) : null;
	}

	Control.prototype.on = function(control, eventType, data) {}

	Control.prototype.send = function(eventType, data) {
		this.context._on_(this, eventType, data);
		return this;
	}

	Control.prototype.setItemId = function(root, itemId) {
		this.root = root;
		this.itemId = itemId;
		return this;
	}

	Control.prototype.setActiveStatus = function(state) {
		this.isActive = (state === 'active');
		return this;
	}

	Control.prototype.onfocus = function(handler) {
		this._onfocus.push(handler);
		return this;
	}

	Control.prototype.ondropfocus = function(handler) {
		this._ondropfocus.push(handler);
		return this;
	}

	Control.prototype.focus = function(element) {
		var activeElement = element || this.activeElement || this.getDefaultActiveElement();
		if (activeElement && !activeElement.isActive) {
			activeElement.focus();
		} else {
			if (!this.element.is(document.activeElement) && !this.isActive) {
				this.element.focus();
				// console.log('focus', this.element.is(document.activeElement), this);
				this._ondropfocus.forEach(function(item) {
					item(event);
				});
			}
		}

		return this;
	}

	Control.prototype.ondragdrop = function(ondrag, ondrop) {
		(ondrag) ? this._ondrag.push(ondrag) : null;
		(ondrop) ? this._ondrop.push(ondrop) : null;
		return this;
	}

	Control.prototype.dragdrop = function(event) {
		var initElementPosition = this.element.offset();
		var initMousePosition = {
			top : event.pageY,
			left : event.pageX
		};

		var handlers = this._ondrag;
		var ondrag = function(event) {
			handlers.forEach(function(item) {
				item(initElementPosition, initMousePosition, event);
			});
		};

		$(document).on({
			mousemove : ondrag
		}).one('mouseup', function(event) {
			$(document).off('mousemove', null, ondrag);
			this._ondrop.forEach(function(item) {
				item(initElementPosition, initMousePosition, event);
			});
		}.bind(this));
	}

	Control.prototype.setContextmenu = function(contextmenuItems) {
		if (contextmenuItems && contextmenuItems.length) {
			this.contextmenuItems = contextmenuItems.map(function(item) {
				return Object.assign({
					source : this
				}, item);
			}.bind(this));

			this.element.on({
				contextmenu : function(event) {
					event.preventDefault();
					event.stopPropagation();
					var data = {
						left : event.clientX,
						top : event.clientY,
						contextmenuItems : this.contextmenuItems
					};

					this.send('control:showcontextmenu', data);
				}.bind(this)
			});
		}

		return this;
	}

	Control.prototype.isVisible = function() {
		return (this.element[0].offsetHeight) ? true : false;
	}

	Control.prototype.setVisibility = function(flag) {
		if (flag) {
			this.element.show();
		} else {
			this.element.hide();
		}

		return this;
	}

	Control.prototype.getDefaultActiveElement = function() {
		return null;
	}

	return Control;
});