define([ './Control', './primitives' ], function(Control, primitives) {
	"use strict";

	/*
	 * ------------- TITLE CLASS --------------
	 */
	function Title(context, name) {
		Control.call(this, context, name);

		this.element.css({
			'margin' : 'auto',
			'margin-left' : '0',
			'overflow' : 'hidden',
			'white-space' : 'nowrap',
			'text-overflow' : 'ellipsis',
			'pointer-events' : 'none'
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
		Control.call(this, context, 'handle');

		this.element.css({
			'display' : 'flex',
			'justify-content' : 'space-between'
		});

		$('<div class="window-handle-title" name="title"></div>').appendTo(this.element);
		this.title = new Title(this, '*/title');

		$('<button style="font-size: 110%;" name="close">&#x2716</button>').appendTo(this.element);
		this.btnClose = new primitives.Button(this, '*/close', this.context.destroy.bind(this.context));

		this.element.on({
			mousedown : function(event) {
				if (event.shiftKey) {
					event.preventDefault();
				}
				if (event.which === 1) {
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
	function Window(context, contentBuilder) {
		Control.call(this, context, '', 'create:<div class="window" name="window"></div>');

		this.element.attr({
			'tabindex' : 0
		});

		/* ------------ handle ------------ */
		$('<div class="window-handle" name="handle"></div>').appendTo(this.element);
		this.handle = new Handle(this);

		/* ------------ body ------------ */
		$('<div class="window-content" name="content"></div>').appendTo(this.element);
		this.content = contentBuilder(this);

		var bodyElement = $('<div class="window-body" name="body"></div>').css({
			'flex' : '1 0 100%',
			'display' : 'flex'
		});
		this.content.element.wrap(bodyElement);

		/* ------------ window ------------ */
		this.element.css({
			'position' : 'absolute'
		});
		this.element.css({
			'top' : Math.max((($(window).height() - this.element.height()) / 4), 20) + 'px',
			'left' : Math.max((($(window).width() - this.element.width()) / 2), 20) + 'px'
		});

		this.ondragdrop(function(initElementPosition, initMousePosition, event) {
			var shift = {
				top : event.pageY - initMousePosition.top,
				left : event.pageX - initMousePosition.left
			}
			this.element.offset({
				top : initElementPosition.top + shift.top,
				left : initElementPosition.left + shift.left
			})
		}.bind(this));

		this.element.hide().fadeTo(400, 1);
	}
	Window.prototype = Object.create(Control.prototype);
	Window.prototype.constructor = Window;

	Window.prototype.on = function(control, eventType, data) {
		if ([ 'control:focusin' ].includes(eventType)) {
			this.send(eventType, data);
			return false;
		}
		if ([ 'handle:mousedown' ].includes(eventType) && (control.context === this)) {
			this.dragdrop(data);
			return false;
		}
		if ([ 'execute' ].includes(eventType) && (control.context === this)) {
			this[data]();
			return false;
		}
		if ([ 'setHeader' ].includes(eventType) && (control.context === this)) {
			this.setHeader(data);
		}
	}

	Window.prototype.getDefaultActiveElement = function() {
		return this.content;
	}

	Window.prototype.destroy = function() {
		this.send('window:destroy');
	}

	Window.prototype.setHeader = function(data) {
		this.handle.title.setValue(data);
		return this;
	}

	return Window;
});