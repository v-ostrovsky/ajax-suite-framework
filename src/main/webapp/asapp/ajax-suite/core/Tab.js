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
	function Handle(context, name) {
		Control.call(this, context, name);

		this.element.attr({
			'tabindex' : 0
		}).css({
			'display' : 'flex',
			'justify-content' : 'space-between'
		});

		$('<div class="tab-handle-title" name="title"></div>').appendTo(this.element);
		this.title = new Title(this, '*/title');

		$('<button style="font-size: 110%;" name="close">&#x2716</button>').appendTo(this.element);
		this.btnClose = new primitives.Button(this, '*/close', this.context.destroy.bind(this.context));
	}
	Handle.prototype = Object.create(Control.prototype);
	Handle.prototype.constructor = Handle;

	/*
	 * ------------- TAB CLASS --------------
	 */
	function Tab(context, contentBuilder) {
		Control.call(this, context, 'body', 'create:<div class="tab" name="tab"></div>');

		this.element.attr({
			'tabindex' : 0
		}).css({
			'height' : '100%',
			'width' : '100%',
			'display' : 'flex'
		});

		/* ------------ handle ------------ */
		$('<div class="tab-handle" name="handle"></div>').appendTo(this.element);
		this.handle = new Handle(this, 'handle');

		/* ------------ body ------------ */
		$('<div class="tab-content" name="content"></div>').css({
			'flex' : '1 0 100%',
			'display' : 'flex'
		}).appendTo(this.element);
		this.content = contentBuilder(this);

		var bodyElement = $('<div class="tab-body" name="body"></div>').css({
			'flex' : '1 0 100%',
			'display' : 'flex'
		});
		this.content.element.wrap(bodyElement);

		/* ------------ tab ------------ */
		this.content.element.hide().fadeTo(400, 1);
	}
	Tab.prototype = Object.create(Control.prototype);
	Tab.prototype.constructor = Tab;

	Tab.prototype.on = function(control, eventType, data) {
		if ([ 'control:focusin' ].includes(eventType)) {
			this.send(eventType, data);
			return false;
		}
		if ([ 'control:tabulate' ].includes(eventType)) {
			control.nextControl(null, data);
			return false;
		}
		if ([ 'setHeader' ].includes(eventType) && (control.context === this)) {
			this.setHeader(data);
		}
		if ([ 'setRoute' ].includes(eventType) && (control.context === this)) {
			this.setRoute(data);
		}
	}

	Tab.prototype.getDefaultActiveElement = function() {
		return this.content;
	}

	Tab.prototype.destroy = function() {
		this.send('tab:destroy');
	}

	Tab.prototype.setHeader = function(data) {
		this.handle.title.setValue(data);
		return this;
	}

	Tab.prototype.setRoute = function(route) {
		this.route = route;
		return this;
	}

	return Tab;
});