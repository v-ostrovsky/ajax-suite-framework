define([], function() {
	"use strict";

	/*
	 * ------------- BACKDROP CLASS --------------
	 */
	function Backdrop(initiator, onMousedown) {
		this.initiator = initiator;
		this.initZIndex = initiator.element[0].style['z-index'];

		this.element = $('<div>').appendTo('body').css({
			'position' : 'absolute',
			'top' : '0',
			'left' : '0',
			'width' : '100%',
			'height' : '100%',
			'opacity' : '0'
		}).on({
			mousedown : function(event) {
				event.preventDefault();
				(onMousedown) ? onMousedown(this.initiator, event) : null;

				if (event.which === 1) {
					var element = $(document.elementFromPoint(event.clientX, event.clientY));

					element.focus().trigger({
						type : 'mousedown',
						which : event.which
					});

					if (!document.activeElement.offsetParent) {
						while (element[0] && (element[0] != document.activeElement)) {
							element = element.parent().focus();
						}
					};
				}
			}.bind(this)
		});
	}

	Backdrop.prototype.setZIndex = function(zIndex) {
		this.element.css({
			'z-index' : zIndex
		});
		this.initiator.element.css({
			'z-index' : zIndex + 1
		});

		return this;
	}

	Backdrop.prototype.destroy = function() {
		this.initiator.element.css({
			'z-index' : this.initZIndex
		});
		this.element.remove();

		return this;
	}

	return Backdrop;
});