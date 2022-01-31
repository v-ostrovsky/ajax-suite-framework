define(['as'], function(as) {
	"use strict";

	var Class = as.generics.listEditable.Class;

	/*
	 * ------------- FEEDBACK LIST CLASS --------------
	 */
	function List(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	List.prototype = Object.create(Class.prototype);
	List.prototype.constructor = List;

	List.prototype.getDefaultActiveElement = function() {
		return this.lastEntry();
	}

	List.prototype.crud = function(defaultEntryId, response) {
		var entry = Class.prototype.crud.call(this, -defaultEntryId, response);
		if (entry && entry.isVisible()) {
			entry.element.hide().slideDown(400);
			this.element.animate({
				scrollTop: this.element.prop("scrollHeight")
			}, 1000);
		}

		return entry;
	}

	List.prototype.create = function(attributes) {
		this.dao = this.dao.create(attributes).execute(function(response) {
			var entry = this.crud(attributes.id, response);

			if (this.context.isNewChat) {
				entry = this.crud(null, [{
					id: null,
					time: new Date(),
					userText: as.locale.feedback['botText'],
					reqres: false,
					content: as.locale.feedback['welcomeMessageOnSend']
				}]);
			}
		}.bind(this));

		return this;
	}

	List.prototype.copy = function(attributes) { }

	List.prototype.edit = function(attributes) { }

	List.prototype.remove = function(attributes) { }

	List.prototype.addMessages = function() {
		this.dao = this.dao.getData('?indexChatId=' + this.indexChatId + '&onlyUnread=true').execute(function(response) {
			response.forEach(function(item) {
				this.crud(null, [item]);
			}.bind(this));
		}.bind(this));
	}

	List.prototype.setContent = function(daoBuilder, filter) {
		return Class.prototype.setContent.call(this, daoBuilder, filter).execute(function(response) {
			this.send('list:load', response.length);
			if (response.length) {
				this.element.scrollTop(this.element.prop("scrollHeight"));
			} else {
				this.crud(null, [{
					id: null,
					time: new Date(),
					userText: as.locale.feedback['botText'],
					reqres: false,
					content: as.locale.feedback['welcomeMessage' + (['ROLE_ANONYMOUS'].includes(this.application.currentUser.role) ? 'Anonymous' : 'Registered')]
				}]);
			}
		}.bind(this));
	}

	List.prototype.init = function() {
		this.indexChatId = parseInt(this.requestUpward('content:request.route').split(":")[1]);
		this.setContent(as.dao['feedback'], '?indexChatId=' + this.indexChatId + '&onlyUnread=false');

		return this;
	}

	return List;
});