define(['as', '../class'], function(as, Class) {
	"use strict";

	/*
	 * ------------- GENEGIC ROUTER NOTOFICATIONS SINGLETON --------------
	 */
	function Router(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);

		this.daoFeedbackCheck = parameters.daoFeedbackCheck(this.application);

		as.firebaseMessaging.messaging.onMessage(function(payload) {
			as.utils.cache.putMessage(payload, this._cacheCheck_.bind(this));
		}.bind(this));

		$(window).focus(this._cacheCheck_.bind(this));
	}
	Router.prototype = Object.create(Class.prototype);
	Router.prototype.constructor = Router;

	Router.prototype._addFeedbackEntries_ = function(theme) {
		this.content.getItemByRoute(theme).content.addMessages().execute(function(response) {
			as.utils.cache.deleteByTheme(theme);
			this.send('feedback:setbadge', {
				route: theme,
				value: 0
			});
		}.bind(this));
	}

	Router.prototype._cacheCheck_ = function() {
		this.send('router:clearbadges');

		as.utils.cache.forEachTheme(function(theme, count) {
			var component = as.utils.config().getComponent(theme);
			if ([component].includes(as.NEWSFEED_COMPONENT)) {
				this.send('router:setbadge', {
					route: theme,
					value: count
				});
			} else {
				if (this.content.components[component].getConfig().routes.includes(theme)) {
					this._addFeedbackEntries_(theme);
				} else {
					this.daoFeedbackCheck = this.daoFeedbackCheck.checkUnread(theme.split(':')[1]).execute(function(response) {
						this.send('router:setbadge', {
							route: theme,
							value: response
						});
					}.bind(this));
				}
			}
		}.bind(this));
	}

	Router.prototype.on = function(control, eventType, data) {
		if (['newsfeed:load', 'feedback:load'].includes(eventType)) {
			as.utils.cache.deleteByTheme(data, function() {
				this._cacheCheck_();
			}.bind(this));
		}

		return Class.prototype.on.call(this, control, eventType, data);
	}

	return Router;
});