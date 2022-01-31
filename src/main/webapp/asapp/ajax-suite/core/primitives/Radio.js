define([ '../Primitive', '../Label' ], function(Primitive, Label) {
	"use strict";

	/*
	 * ------------- RADIO CLASS --------------
	 */
	function Radio(context, path, template, parameters) {
		Primitive.call(this, context, path, template, parameters);

		this.radios = this.element.find('[type="radio"]');
	}
	Radio.prototype = Object.create(Primitive.prototype);
	Radio.prototype.constructor = Radio;

	Radio.prototype.on = function(control, eventType, data) {
		if ([ 'control:leftright' ].includes(eventType)) {
			this.nextItem((data.which === 38) ? -1 : 1);
		}
	}

	Radio.prototype.getActiveElement = function() {
		return this.radios.filter(function(index, item) {
			return item.checked;
		})[0];
	}

	Radio.prototype.nextItem = function(backforth) {
		var itemId = this.radios.index(this.getActiveElement());
		var nextItem = (this.radios.length > 1) ? this.radios[(itemId < this.radios.length - 1) ? itemId + backforth : 0] : null;
		nextItem.checked = true;
	}

	Radio.prototype.setLabels = function(name, text, labels) {
		this.radios.each(function(index, item) {
			item.label = new Label(this, '*/' + item.value + '-label').setText(labels[index]);
		}.bind(this));

		return this;
	}

	Radio.prototype.setValue = function(value) {
		this.radios.filter(function(index, item) {
			return item.value === value;
		})[0].checked = true;

		return this;
	}

	Radio.prototype.getValue = function() {
		return this.getActiveElement().value;
	}

	return Radio;
});