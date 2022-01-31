define(['as'], function(as) {
	"use strict";

	var Class = as.generics.control.Class;

	/*
	 * ------------- GENEGIC TEXT CONTENT CLASS --------------
	 */
	function TextContent(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);

		this.textbox = $('<div>').addClass(' ck ck-content').attr({ 'name': 'textbox' }).appendTo(this.element);

		var icons = {
			expand: $(as.icons.arrows['downgrey'])
				.css({
					'height': '100%',
					'width': '100%'
				}),
			collapse: $(as.icons.arrows['upgrey'])
				.css({
					'height': '100%',
					'width': '100%'
				})
		};

		this.formatter = function(value) {
			var element = $('<div>').html(value);

			{
				var delimiter = $('<div>');

				$('<hr>')
					.css({
						'margin': '24px 64px',
						'border-style': 'inset',
						'border-width': '1px'
					})
					.appendTo(delimiter);

				$('<div>')
					.html(icons['expand'])
					.attr({
						name: 'btnBlockQuote'
					})
					.addClass('button button-blockquote')
					.css({
						'margin-top': '-42px',
						'display': 'flex'
					})
					.appendTo(delimiter);
			}

			element.find('blockquote').hide().before(delimiter);

			return element.html();
		};

		this.textbox.on({
			mousedown: function(event) {
				if (event.which === 1) {
					var target = $(event.target);

					var btnBlockQuote = target.is('[name="btnBlockQuote"]') ? target : target.parents('[name="btnBlockQuote"]');
					if (btnBlockQuote[0]) {
						var blockQuote = btnBlockQuote.parent().next();
						if (blockQuote[0].offsetHeight) {
							btnBlockQuote.empty().append(icons['expand'].clone());
							blockQuote.slideUp();
						} else {
							btnBlockQuote.empty().append(icons['collapse'].clone());
							blockQuote.slideDown();
						};
					}
				}
			}.bind(this),

			click: function(event) {
				var target = $(event.target);

				var link = target.is('a') ? target : target.parents('a');
				if (link[0]) {
					var hrefUrl = new URL(link[0].href);
					if ([hrefUrl.origin + hrefUrl.pathname].includes(window.location.origin + window.location.pathname)) {
						event.preventDefault();
						this.send('control:addroute', as.utils.config().toConfig(link[0].href));
					}
				}
			}.bind(this),

			dblclick: function(event) {
				if (event.which === 1) {
					var target = $(event.target);

					if (target.is('img')) {
						var images = [];

						function showNext(direction) {
							var nextImage = images.find(function(item) {
								return item[0].offsetHeight;
							}).hide()[direction]();

							var dafaultImage = ['next'].includes(direction) ? images[0] : images[images.length - 1];
							(nextImage.is('img') ? nextImage : dafaultImage).show();
						}

						var backdrop = $('<div>')
							.css({
								'background-color': 'rgb(128,128,128, 0.9)',
								'position': 'absolute',
								'top': '0',
								'left': '0',
								'width': '100%',
								'height': '100%',
								'z-index': '1000',
								'display': 'flex'
							}).append($('<div>')
								.append($(as.icons['arrows']['leftwhite'])
									.css({
										'width': '100%',
										'height': '100%',
										'opacity': '0.6'
									}))
								.css({
									'position': 'absolute',
									'width': '4em',
									'height': '100%',
									'left': '0',
									'padding': '1em'
								})
								.on('mousedown', function(event) {
									showNext('prev');
								}))

							.append($('<div>')
								.append($(as.icons['arrows']['rightwhite'])
									.css({
										'width': '100%',
										'height': '100%',
										'opacity': '0.6'
									}))
								.css({
									'position': 'absolute',
									'width': '4em',
									'height': '100%',
									'right': '0',
									'padding': '1em'
								})
								.on('mousedown', function(event) {
									showNext('next');
								}))

							.append($('<div>')
								.append($(as.icons['close'])
									.css({
										'width': '100%',
										'height': '100%',
										'opacity': '0.6'
									}))
								.css({
									'position': 'absolute',
									'width': '4em',
									'top': '0',
									'right': '0',
									'padding': '1em',
								})
								.on('mousedown', function(event) {
									$(this).parent().remove();
								}))
							.appendTo('body');
					}

					this.element.find('img').each(function(index, item) {
						images[index] = $(item).clone()
							.css({
								'width': 'auto',
								'height': 'auto',
								'max-width': '100%',
								'max-height': '100%',
								'margin': 'auto'
							})
							.toggle($(item).is(target))
							.appendTo(backdrop);
					});
				}
			}.bind(this)
		});
	}
	TextContent.prototype = Object.create(Class.prototype);
	TextContent.prototype.constructor = TextContent;

	TextContent.prototype.setActiveStatus = function(status) {
		this.element.toggleClass('control-active', ['active'].includes(status));
		this.element.toggleClass('control-inactive', ['inactive'].includes(status));

		return Class.prototype.setActiveStatus.call(this, status);
	}

	TextContent.prototype.getSourceElement = function() {
		return this.textbox.html(this.value);
	}

	TextContent.prototype.setValue = function(value) {
		this.value = value;
		this.textbox.html(this.formatter(this.value));

		return this;
	}

	TextContent.prototype.getValue = function() {
		return this.value;
	}

	return TextContent;
});