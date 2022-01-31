define(['./Control', './primitives/@dir'], function(Control, primitives) {
	"use strict";

	/*
	 * ------------- UTILITIES --------------
	 */
	function cursor(element, event) {
		var marginWidth = 4;

		var elementPosition = Object.assign(element.offset(), {
			right: element.offset().left + element.width(),
			bottom: element.offset().top + element.height()
		});

		var mousePosition = {
			x: event.pageY,
			y: event.pageX
		};

		var margin = {
			top: Math.abs(elementPosition.top - mousePosition.x) < marginWidth,
			right: Math.abs(elementPosition.right - mousePosition.y) < marginWidth,
			bottom: Math.abs(elementPosition.bottom - mousePosition.x) < marginWidth,
			left: Math.abs(elementPosition.left - mousePosition.y) < marginWidth
		};

		var cursor = 'auto';
		cursor = (margin.top && !margin.right && !margin.bottom && !margin.left) ? 'n-resize' : cursor;
		cursor = (!margin.top && margin.right && !margin.bottom && !margin.left) ? 'e-resize' : cursor;
		cursor = (!margin.top && !margin.right && margin.bottom && !margin.left) ? 's-resize' : cursor;
		cursor = (!margin.top && !margin.right && !margin.bottom && margin.left) ? 'w-resize' : cursor;

		return cursor;
	}

	/*
	 * ------------- TITLE CLASS --------------
	 */
	function Title(context, path) {
		Control.call(this, context, path);

		this.element.css({
			'overflow': 'hidden',
			'white-space': 'nowrap',
			'text-overflow': 'ellipsis',
			'pointer-events': 'none'
		});
	}
	Title.prototype = Object.create(Control.prototype);
	Title.prototype.constructor = Title;

	Title.prototype.setValue = function(title) {
		this.element.html(title);
		return this;
	}

	/*
	 * ------------- HANDLE CLASS --------------
	 */
	function Handle(context) {
		Control.call(this, context, 'window-handle');

		this.element.css({
			'display': 'flex',
			'justify-content': 'space-between',
			'align-items': 'center'
		});

		$('<div>').attr({
			'name': 'title'
		}).appendTo(this.element);
		this.title = new Title(this, '*/title');

		$('<div>').css({
			'cursor': 'default',
			'font-size': '1.8em'
		}).attr({
			'name': 'close'
		}).appendTo(this.element);

		this.btnClose = new primitives.Button(this, '*/close', '', {}).setView('&#xD7').setHandler(function() {
			this.context.destroy();
		}.bind(this));

		this.element.on({
			mousedown: function(event) {
				if (event.which === 1) {
					event.preventDefault();
					event.stopPropagation();
					this.send('handle:mousedown', event);
				}
			}.bind(this)
		});
	}
	Handle.prototype = Object.create(Control.prototype);
	Handle.prototype.constructor = Handle;

	/*
	 * ------------- WINDOW CLASS --------------
	 */
	function Window(context, contentBuilder, position) {
		Control.call(this, context, '', 'create:<div class="window" tabindex=0 name="window"></div>');

		this.root = this.context;

		/* ------------ handle ------------ */
		$('<div>').addClass('window-handle').attr({
			'name': 'window-handle'
		}).appendTo(this.element);
		this.handle = new Handle(this);

		/* ------------ body ------------ */
		var bodyElement = $('<div>').addClass('window-body').css({
			'height': '0%',
			'flex': '1',
			'display': 'flex'
		}).attr({
			'name': 'window-body'
		}).appendTo(this.element);

		$('<div>').addClass('window-content').css({
			'flex': '1',
			'display': 'flex'
		}).attr({
			'name': 'window-content'
		}).appendTo(bodyElement);

		this.content = contentBuilder(this, '*/window-content');

		/* ------------ window ------------ */
		var anchor = $('body'), css = {};

		if (position) {
			if (position instanceof jQuery) {
				anchor = position;
			} else {
				css = position;
			}
		}

		this.element.css(css).css({
			'display': 'flex',
			'flex-direction': 'column',
			'position': 'absolute',
			'top': '0px',
			'left': '0px'
		}).css({
			'top': css.top ? css.top : Math.max((anchor.offset().top + (anchor.height() - this.element.height()) / 8), 50) + 'px',
			'left': css.left ? css.left : Math.max((anchor.offset().left + (anchor.width() - this.element.width()) / 2), 10) + 'px'
		});

		this.origMeasures = Object.assign(this.element.offset(), {
			width: this.element.width(),
			height: this.element.height()
		});

		this.ondragdrop(this._ondrag_.bind(this), this._ondrop_.bind(this));

		this.element.on({
			mousemove: function(event) {
				if (!event.buttons) {
					this.element.css('cursor', cursor(this.element, event));
				}
			}.bind(this),
			mousedown: function(event) {
				if (event.cancelable) {
					if (event.which === 1) {
						this._dragdropInit_(event);
					}
				}
			}.bind(this)
		});
	}
	Window.prototype = Object.create(Control.prototype);
	Window.prototype.constructor = Window;

	Window.prototype._dragdropInit_ = function(event) {
		this.dragdropInit(event, {
			initMeasures: Object.assign(this.element.offset(), {
				width: this.element.width(),
				height: this.element.height()
			}),
			initMousePosition: {
				top: event.pageY,
				left: event.pageX
			}
		});
	}

	Window.prototype._ondrag_ = function(event, data) {
		var shift = {
			top: event.pageY - data.initMousePosition.top,
			left: event.pageX - data.initMousePosition.left
		};

		var ondrag = function() {
			this.element.offset({
				top: data.initMeasures.top + shift.top,
				left: data.initMeasures.left + shift.left
			});
		}.bind(this);

		if (['n-resize'].includes(this.element.css('cursor'))) {
			ondrag = function() {
				if (this.element.height() >= this.origMeasures.height) {
					this.element.offset({
						top: data.initMeasures.top + shift.top
					}).height(data.initMeasures.height - shift.top);
				}
			}.bind(this);
		}

		if (['e-resize'].includes(this.element.css('cursor'))) {
			ondrag = function() {
				if (this.element.width() >= this.origMeasures.width) {
					this.element.width(data.initMeasures.width + shift.left);
				}
			}.bind(this);
		}

		if (['s-resize'].includes(this.element.css('cursor'))) {
			ondrag = function() {
				if (this.element.height() >= this.origMeasures.height) {
					this.element.height(data.initMeasures.height + shift.top);
				}
			}.bind(this);
		}

		if (['w-resize'].includes(this.element.css('cursor'))) {
			ondrag = function() {
				if (this.element.width() >= this.origMeasures.width) {
					this.element.offset({
						left: data.initMeasures.left + shift.left
					}).width(data.initMeasures.width - shift.left);
				}
			}.bind(this);
		}

		ondrag();
	}

	Window.prototype._ondrop_ = function(event, data) {
		if (this.element.offset().top < 0) {
			this.element.offset({
				top: 0
			});
		}
		if (this.element.height() < this.origMeasures.height) {
			this.element.height(this.origMeasures.height);
		}
		if (this.element.width() < this.origMeasures.width) {
			this.element.width(this.origMeasures.width);
		}
	}

	Window.prototype._resize_ = function(direction) {
		direction = direction || ['width', 'height'];

		if (direction.includes('width')) {
			this.element.width('auto');
			this.element.width(this.element.width());
			this.origMeasures.width = this.element.width();
		}
		if (direction.includes('height')) {
			this.element.height('auto');
			this.element.height(this.element.height());
			this.origMeasures.height = this.element.height();
		}
	}

	Window.prototype.on = function(control, eventType, data) {
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
		if (['handle:mousedown'].includes(eventType) && (control.context === this)) {
			this._dragdropInit_(data);
			this.send(eventType);
			return false;
		}
		if (['setHeader'].includes(eventType) && (control.context === this)) {
			this.setHeader(data);
		}
		if (['windowResize'].includes(eventType)) {
			this._resize_(data);
			return false;
		}
	}

	Window.prototype.setActiveStatus = function(status) {
		this.handle.element.toggleClass('window-handle-selected', ['active', 'inactive'].includes(status));
		return Control.prototype.setActiveStatus.call(this, status);
	}

	Window.prototype.getDefaultActiveElement = function() {
		return this.content;
	}

	Window.prototype.setWindowId = function(windowId) {
		this.windowId = windowId;
		return this;
	}

	Window.prototype.setHeader = function(header) {
		this.handle.title.setValue(header);
		return this;
	}

	Window.prototype.destroy = function() {
		return this.send('control:destroy');
	}

	return Window;
});