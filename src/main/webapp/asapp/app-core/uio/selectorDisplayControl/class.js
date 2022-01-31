define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.control.Class;

	function Control(context, path, template) {
		Class.call(this, context, path, template);
	}
	Control.prototype = Object.create(Class.prototype);
	Control.prototype.constructor = Control;

	Control.prototype._setView_ = function(content) {
		var view = (content !== undefined) ? content : '';

		if (typeof content === 'string') {
			if ([ '<' ].includes(content.charAt(0))) {
				view = $(content).css({
					width : '100%',
					height : '100%'
				});
				this.element.html(view.clone());
			} else {
				this.element.html(view);
			}
		}

		return view;
	}

	Control.prototype.setView = function(content) {
		this.view = this._setView_(content);
		return this;
	}

	Control.prototype.getView = function() {
		return this.view;
	}

	Control.prototype.disable = function(flag) {
		this._isDisabled_ = flag;
		this.element.toggleClass('control-disabled', flag);

		if (this.tabindex !== undefined) {
			this.element.attr({
				tabindex : flag ? 'none' : this.tabindex
			});
		} else {
			this.element.removeAttr("tabindex");
		}

		return this;
	}

	Control.prototype.isDisabled = function() {
		return this._isDisabled_;
	}

	return Control;
});