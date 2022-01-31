define(['./animation', './config', './parseTree', './utils'], function(animation, config, parseTree, utils) {
	"use strict";

	return Object.assign({
		animation: animation,
		config: config,
		parseTree: parseTree
	}, utils);
});