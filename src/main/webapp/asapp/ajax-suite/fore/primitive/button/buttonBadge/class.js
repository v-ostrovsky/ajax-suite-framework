define([ '../class' ], function(Class) {
	"use strict";

	/*
	 * ------------- BUTTON BADGE CLASS --------------
	 */
	function ButtonBadge(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	ButtonBadge.prototype = Object.create(Class.prototype);
	ButtonBadge.prototype.constructor = ButtonBadge;

	ButtonBadge.prototype.setOnlyBadge = function(value) {
		var badge = this.element.children('[name="badge"]');

		if (badge.length) {
			value ? badge.html(value) : badge.remove();
		} else if (value) {
			this.element.prepend($('<div>').attr({
				name : 'badge'
			}).css({
				'height' : '14px',
				'width' : '14px',
				'margin' : '-7px -7px 7px -7px',
				'background-color' : 'red',
				'border-radius' : '50%',
				'line-height' : '14px',
				'font-size' : '8px',
				'text-align' : 'center',
				'color' : 'white'
			}).html(value));
		}

		return this;
	}

	ButtonBadge.prototype.addBadge = function(value) {
		this.value += value;
		this.setOnlyBadge(this.value || 0);
	}

	ButtonBadge.prototype.setBadge = function(value) {
		this.value = 0;
		this.addBadge(value);
	}

	ButtonBadge.prototype.addObjectBadge = function(object) {
		Object.keys(object).forEach(function(key) {
			this.value[key] = (this.value[key] || 0) + object[key];
		}.bind(this));

		var count = Object.keys(this.value).reduce(function(accumulator, key) {
			return accumulator += this.value[key];
		}.bind(this), 0);

		this.setOnlyBadge(count);
	}

	ButtonBadge.prototype.setObjectBadge = function(object) {
		this.value = {};
		this.addObjectBadge(object);
	}

	ButtonBadge.prototype.getBadge = function() {
		return parseInt(this.element.children('[name="badge"]').html() || 0);
	}

	return ButtonBadge;

});