define(['../Primitive'], function(Primitive) {
	"use strict";

	/*
	 * ------------- LINK CLASS --------------
	 */
	function Link(context, path, template, parameters) {
		Primitive.call(this, context, path, template, parameters);

		this.element.css({
			'display': 'flex'
		}).on({
			keydown: function(event) {
				if ([13].includes(event.which)) {
					event.preventDefault();
					!this.isDisabled() ? this.fire() : null;
				}
			}.bind(this),
			mousedown: function(event) {
				event.preventDefault();
				(((event.which || 1) === 1) && !this.isDisabled()) ? this.fire() : null;
			}.bind(this),
			click: function(event) {
				event.preventDefault();
			}.bind(this)
		});
	}
	Link.prototype = Object.create(Primitive.prototype);
	Link.prototype.constructor = Link;

	Link.prototype._allowedTags = function() {
		return ['A'];
	}

	Link.prototype.setHandler = function(handler) {
		this.handler = handler;
		return this;
	}

	Link.prototype.fire = function() {
		(typeof this.handler === 'function') ? this.handler(this) : this.send('control:changed');
		return this;
	}

	Link.prototype.getBadge = function() {
		return parseInt(this.element.children('[name="badge"]').html() || 0);
	}

	Link.prototype.setBadge = function(value) {
		var badge = this.element.children('[name="badge"]');

		if (badge.length) {
			value ? badge.html(value) : badge.remove();
		} else if (value) {
			this.element.prepend($('<div>').attr({
				name: 'badge'
			}).css({
				'height': '14px',
				'width': '14px',
				'margin': '-7px -7px 7px -7px',
				'background-color': 'red',
				'border-radius': '50%',
				'line-height': '14px',
				'font-size': '8px',
				'text-align': 'center',
				'color': 'white'
			}).html(value));
		}

		return this;
	}

	Link.prototype.getHref = function() {
		return this.element.attr('href');
	}

	Link.prototype.setHref = function(href) {
		this.element.attr({
			href: href
		})

		return this;
	}

	return Link;
});