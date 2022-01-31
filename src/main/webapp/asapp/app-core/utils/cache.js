define(['as'], function(as, Form, template) {
	"use strict";

	function getUrl(route) {
		return '/msg/?config=' + route;
	}

	function getTheme(url) {
		var arrRoute = new URL(url).searchParams.get('config').split(':');
		return [arrRoute[0], arrRoute[1]].join(':');
	}

	function groupByTheme(keys) {
		return keys.reduce(function(accumulator, request) {
			var theme = getTheme(request.url);
			accumulator[theme] = accumulator[theme] ? accumulator[theme] + 1 : 1;
			return accumulator;
		}, {});
	};

	function putMessage(payload, handler) {
		caches.open('messages').then(function(cache) {
			var jsonResponse = new Response(JSON.stringify(payload), {
				headers: {
					'content-type': 'application/json'
				}
			});

			cache.put(getUrl(payload.data.route), jsonResponse).then(handler || function() { });
		});
	}

	function forEachTheme(handler) {
		return caches.open('messages').then(function(cache) {
			cache.keys().then(function(keys) {
				var themes = groupByTheme(keys);
				Object.keys(themes).forEach(function(key) {
					handler(key, themes[key]);
				});
			});
		});
	}

	function deleteByTheme(theme, onDelete) {
		return caches.open('messages').then(function(cache) {
			cache.keys().then(function(keys) {
				keys.forEach(function(request) {
					if ([theme].includes(getTheme(request.url))) {
						cache['delete'](request.url);
					}
				});
			}).then(function(keys) {
				(typeof onDelete === 'function') ? onDelete() : null;
			});
		});
	}

	return {
		putMessage: putMessage,
		forEachTheme: forEachTheme,
		deleteByTheme: deleteByTheme
	}
});