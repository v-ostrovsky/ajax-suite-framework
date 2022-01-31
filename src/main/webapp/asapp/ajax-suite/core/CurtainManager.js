define(['./Control', './Curtain', 'ajax-suite/utils/@dir'], function(Control, Curtain, utils) {
	"use strict";

	/*
	 * ------------- CURTAIN MANAGER CLASS --------------
	 */
	function CurtainManager(context, path) {
		Control.call(this, context, path);

		this.curtains = [];
	}
	CurtainManager.prototype = Object.create(Control.prototype);
	CurtainManager.prototype.constructor = CurtainManager;

	CurtainManager.prototype.on = function(control, eventType, data) {
		if (['control:focusin'].includes(eventType) && (control.root === this)) {
			this.send(eventType, data).activeElement.focus();
			return false;
		}
		if (['control:destroy'].includes(eventType)) {
			this.removeCurtain(control);
			this.send('config:changed');
			return false;
		}
	}

	CurtainManager.prototype.setDuration = function(duration) {
		this.duration = duration;
		return this;
	}

	CurtainManager.prototype.addCurtain = function(contentBuilder, animation) {
		var curtain = new Curtain(this, function(context, path) {
			return contentBuilder(context, path).require();
		}, animation).setItemId(this, this.curtains.length);

		this.curtains.push(curtain);

		var directions = {
			left: utils.animation.showLeft,
			right: utils.animation.showRight,
			up: utils.animation.showUp,
			down: utils.animation.showDown
		};

		var animation = Object.assign({}, curtain.animation.create);
		if (animation) {
			(typeof animation.onStart === 'function') ? animation.onStart(curtain) : null;
			animation.direction ? directions[animation.direction](curtain, animation.onComplete) : null;
		}

		return this.setActiveElement(curtain).focus();
	}

	CurtainManager.prototype.removeCurtain = function(curtain) {
		if (this.curtains.includes(curtain)) {
			this.curtains = this.curtains.filter(function(item) {
				return (item !== curtain);
			});

			if (typeof curtain.content.onContainerDestroy === 'function') {
				curtain.content.onContainerDestroy();
			}

			var directions = {
				left: utils.animation.hideLeft,
				right: utils.animation.hideRight,
				up: utils.animation.hideUp,
				down: utils.animation.hideDown
			};

			var animation = Object.assign({}, curtain.animation.destroy);
			if (animation) {
				(typeof animation.onStart === 'function') ? animation.onStart(curtain) : null;
				animation.direction ? directions[animation.direction](curtain, animation.onComplete) : null;
			}

			if (curtain === this.activeElement) {
				this.curtains.length ? this.setActiveElement(this.curtains[this.curtains.length - 1]).focus() : this.context.focus();
			}
		}

		return this.activeElement;
	}

	CurtainManager.prototype.getConfig = function() {
		var config = utils.config();

		config.routes = this.curtains.reduce(function(accumulator, item) {
			(item.route) ? accumulator.push(item.route) : null;
			return accumulator;
		}, []);

		if (config.routes.length) {
			config.setActiveRoute(this.activeElement.route);
		}

		return config;
	}

	return CurtainManager;
});