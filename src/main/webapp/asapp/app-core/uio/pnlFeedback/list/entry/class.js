define(['as'], function(as) {
	"use strict";

	var Class = as.generics.entry.Class;

	/*
	 * ------------- FEEDBACK ENTRY CLASS --------------
	 */
	function Entry(context, path, template) {
		Class.call(this, context, path, template);
	}
	Entry.prototype = Object.create(Class.prototype);
	Entry.prototype.constructor = Entry;

	Entry.prototype.setActiveStatus = function(status) {
		this.element.toggleClass('control-active', ['active'].includes(status));
		this.element.toggleClass('control-inactive', ['inactive'].includes(status));

		return Class.prototype.setActiveStatus.call(this, status);
	}

	Entry.prototype.fillContent = function(attributes) {
		if (['<initial>'].includes(attributes.content)) {
			this.context.indexChatId = attributes.id;
			this.setVisibility(false);
		}

		this.element.css(attributes.reqres ? {
			'background-color': 'rgb(255, 255, 255)'
		} : {
				'background-color': 'rgb(0, 0, 0, 0.05)'
			});

		return Class.prototype.fillContent.call(this, attributes);
	}

	Entry.prototype.getRoute = function() {
		return this.attributes.id;
	}

	return Entry;
});