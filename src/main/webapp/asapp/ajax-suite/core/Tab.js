define(['./Control', './primitives/@dir'], function(Control, primitives) {
	"use strict";

	/*
	 * ------------- TITLE CLASS --------------
	 */
	function Title(context, path) {
		Control.call(this, context, path);

		this.element.css({
			'margin-right': '4px',
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
	function Handle(context, path) {
		Control.call(this, context, path);

		this.element.css({
			'display': 'flex',
			'justify-content': 'space-between',
			'align-items': 'center'
		}).attr({
			'tabindex': 0
		});

		$('<div>').attr({
			'name': 'title'
		}).appendTo(this.element);
		this.title = new Title(this, '*/title');

		$('<div>').css({
			'cursor': 'default',
			'font-size': '1.8em',
			'padding-bottom': '2px'
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
		})
	}
	Handle.prototype = Object.create(Control.prototype);
	Handle.prototype.constructor = Handle;

	/*
	 * ------------- TAB CLASS --------------
	 */
	function Tab(context) {
		Control.call(this, context, 'body', 'create:<div tabindex=0 name="tab"></div>');

		this.root = this.context;

		this.element.addClass('tab').css({
			'height': '100%'
		});

		/* ------------ handle ------------ */
		$('<div>').addClass('tab-handle').attr({
			'name': 'handle'
		}).appendTo(this.element);
		this.handle = new Handle(this, 'handle');

		/* ------------ body ------------ */
		var bodyElement = $('<div>').addClass('tab-body').css({
			'height': '100%'
		}).attr({
			'name': 'body'
		}).appendTo(this.element);

		$('<div>').addClass('tab-content').css({
			'height': '100%',
			'display': 'flex'
		}).attr({
			'name': 'tab-content'
		}).appendTo(bodyElement);
	}
	Tab.prototype = Object.create(Control.prototype);
	Tab.prototype.constructor = Tab;

	Tab.prototype.on = function(control, eventType, data) {
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
			this.destroy(data);
			return false;
		}
		if (['handle:mousedown'].includes(eventType) && (control.context === this)) {
			this.send(eventType);
			return false;
		}
		if (['setHeader'].includes(eventType) && (control.context === this)) {
			this.setHeader(data);
		}
	}

	Tab.prototype.setActiveStatus = function(status) {
		this.handle.element.toggleClass('tab-handle-selected', ['active', 'inactive'].includes(status));
		return Control.prototype.setActiveStatus.call(this, status);
	}

	Tab.prototype.getDefaultActiveElement = function() {
		return this.content;
	}

	Tab.prototype.setContent = function(contentBuilder) {
		this.element.find('[name="tab-content"]').html('');
		this.content = contentBuilder(this, 'body/tab-content');
		this.content.element.hide().fadeTo(400, 1);

		return this;
	}

	Tab.prototype.setTabId = function(tabId) {
		this.tabId = tabId;
		return this;
	}

	Tab.prototype.setHeader = function(data) {
		this.handle.title.setValue(data);
		return this;
	}

	Tab.prototype.destroy = function() {
		return this.send('control:destroy');
	}

	return Tab;
});