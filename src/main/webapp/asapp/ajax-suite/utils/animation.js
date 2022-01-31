define([], function() {
	"use strict";

	var defaultDuration = 1200;

	return {
		showUp : function(control, onComplete, duration) {
			control.element.hide().css({
				'top' : '100%'
			}).animate({
				'top' : 0,
				'height' : 'toggle'
			}, duration || defaultDuration, onComplete);
		},
		hideDown : function(control, onComplete, duration) {
			control.element.show().css({
				'top' : 0
			}).animate({
				'top' : '100%',
				'height' : 'toggle'
			}, duration || defaultDuration, onComplete);
		},
		showDown : function(control, onComplete, duration) {
			control.element.hide().css({
				'top' : '-100%'
			}).animate({
				'top' : 0,
				'height' : 'toggle'
			}, duration || defaultDuration, onComplete);
		},
		hideUp : function(control, onComplete, duration) {
			control.element.show().css({
				'top' : 0
			}).animate({
				'top' : '-100%',
				'height' : 'toggle'
			}, duration || defaultDuration, onComplete);
		},
		showLeft : function(control, onComplete, duration) {
			control.element.hide().css({
				'left' : '100%'
			}).animate({
				'left' : 0,
				'width' : 'toggle'
			}, duration || defaultDuration, onComplete);
		},
		hideRight : function(control, onComplete, duration) {
			control.element.show().css({
				'left' : 0
			}).animate({
				'left' : '100%',
				'width' : 'toggle'
			}, duration || defaultDuration, onComplete);
		},
		showRight : function(control, onComplete, duration) {
			control.element.hide().css({
				'left' : '-100%'
			}).animate({
				'left' : 0,
				'width' : 'toggle'
			}, duration || defaultDuration, onComplete);
		},
		hideLeft : function(control, onComplete, duration) {
			control.element.show().css({
				'left' : 0
			}).animate({
				'left' : '-100%',
				'width' : 'toggle'
			}, duration || defaultDuration, onComplete);
		}
	};
});