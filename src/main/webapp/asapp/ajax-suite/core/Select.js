define([ './Control' ], function(Control) {
	"use strict";

	/*
	 * ------------- REPOSITORY CLASS --------------
	 */
	function Repository() {}

	Repository.prototype.storeBuilders = function(listBuilder, treeBuilder) {
		this.builders = {};
		this.builders.list = listBuilder;
		this.builders.tree = treeBuilder;

		return this;
	}

	Repository.prototype.getBuilder = function(builder) {
		return this.builders[builder];
	}

	Repository.prototype.storeData = function(data, dataProcessor) {
		this.data = data;
		this.dataProcessor = dataProcessor;

		return this;
	}

	Repository.prototype.getData = function(parameters) {
		return this.dataProcessor(this.data, parameters);
	}

	/*
	 * ------------- SELECT CLASS --------------
	 */
	function Select(context, name) {
		Control.call(this, context, name);

		$('<div name="content"></div>').appendTo(this.element).css({
			height : '100%',
			overflow : 'auto'
		});

		this.element.on({
			mousedown : function(event) {
				(event.target === this) ? event.preventDefault() : null;
			}
		});
	}
	Select.prototype = Object.create(Control.prototype);
	Select.prototype.constructor = Select;

	Select.prototype.on = function(control, eventType, data) {
		if ([ 'control:focusin' ].includes(eventType)) {
			this.send(eventType, data);
			this.content.focus();
			return false;
		}
		if ([ 'control:tabulate' ].includes(eventType)) {
			this.send(eventType, data);
			return false;
		}
		if ([ 'control:changed' ].includes(eventType) && (control === this.content)) {
			this.value = this.content.getValue();
			this.send(eventType, data);
			return false;
		}
	}

	Select.prototype.setRepository = function() {
		this.repository = new Repository();
		return this;
	}

	Select.prototype.destroyContent = function() {
		if (this.content) {
			this.content.element.empty();
			delete this.content;
		}
		return this;
	}

	Select.prototype.buildContent = function(contentBuilder) {
		this.destroyContent();
		this.content = contentBuilder(this, 'content');
		return this;
	}

	Select.prototype.setContent = function(data) {
		this.content.setContent(data);
		return this;
	}

	Select.prototype.getContent = function() {
		return this.content;
	}

	Select.prototype.expandDown = function() {
		this.content.expandDown();
		return this;
	}

	Select.prototype.getEntry = function() {
		return this.content.activeElement;
	}

	Select.prototype.setValue = function(value) {
		this.value = value;
		this.content.setValue(this.value);

		return this;
	}

	Select.prototype.getValue = function() {
		return this.value;
	}

	return Select;
});