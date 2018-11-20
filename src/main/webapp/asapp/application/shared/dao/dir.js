define([ './composite', './admin', './application', './contents', './docs', './roles', './users' ], function(composite, admin, application, contents, docs, roles, users) {
	"use strict";

	return {
		composite : composite,
		admin : admin,
		application : application,
		contents : contents,
		docs : docs,
		roles : roles,
		users : users
	};
});