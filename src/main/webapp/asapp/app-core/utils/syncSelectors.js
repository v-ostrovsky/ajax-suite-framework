define([ 'as' ], function(as) {
	"use strict";

	function list(data, propertiesExt) {
		return function(context) {
			var properties = Object.assign(propertiesExt || {}, {
				daoBuilder : function(application) {
					return new as.dao.ListSync(data);
				}
			});

			return as.uio.selectorList(context, properties);
		};
	}

	function tree(data, propertiesExt) {
		return function(context) {
			var properties = Object.assign(propertiesExt || {}, {
				daoBuilder : function(application) {
					return new as.dao.TreeSync(data);
				}
			});

			return as.uio.selectorTree(context, properties);
		};
	}

	return {
		list : list,
		tree : tree
	};
});