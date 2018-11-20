define([ 'core/primitives' ], function(primitives) {
	"use strict";

	/*
	 * ------------- GENEGIC RADIO CLASS --------------
	 */
	function Radio(context, name) {
		primitives.Radio.call(this, context, name);
	}
	Radio.prototype = Object.create(primitives.Radio.prototype);
	Radio.prototype.constructor = Radio;

	Radio.prototype.setActiveStatus = function(state) {
		this.element.toggleClass('control-active', [ 'active' ].includes(state));
		return primitives.Radio.prototype.setActiveStatus.call(this, state);
	}

	Radio.prototype.setLabels = function(text, labels) {
		if (text) {
			this.label = new primitives.Label(this.context, this.name + '-label', text);
		}

		this.radios.each(function(index, item) {
			item.label = new primitives.Label(this, '*/' + item.value + '-label', labels[index]);
		}.bind(this));

		return this;
	}

	return Radio;
});