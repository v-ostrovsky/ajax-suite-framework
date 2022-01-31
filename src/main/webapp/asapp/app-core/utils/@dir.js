define(['as', './cache', './syncSelectors', './utils'], function(as, cache, syncSelectors, utils) {
	"use strict";

	return Object.assign(as.utils, {
		cache: cache,
		syncSelectors: syncSelectors
	}, utils);
});