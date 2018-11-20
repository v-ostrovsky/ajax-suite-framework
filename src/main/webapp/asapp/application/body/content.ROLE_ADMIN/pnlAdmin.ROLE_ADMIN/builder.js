define([ 'as', './class', 'text!./template.htpl', './pnlUsers/builder' ], function(as, Class, template, pnlUsersBuilder) {
	"use strict";

	function panel(context, name) {

		var controls = [].concat([ 'list' ].map(function(item) {
			var properties = {
				typeOfContent : 'list',
				data : [ {
					id : 1,
					name : 'users',
					textId : as.locale.sidemenu['users'],
					handler : function(context) {
						var content = context.controls['mainContent'];
						content.setActiveElement(content.addTabs([ pnlUsersBuilder ])[0]).focus();
					}
				}, {
					id : 2,
					name : 'dumpDb',
					textId : as.locale.sidemenu['dumpDb'],
					handler : function(context) {
						as.dao.admin(context.application).dumpDb().execute(function(response) {
							var fileName = 'ostrovsky-as-' + as.locale.toDbDate(new Date(Date.now())) + '.sql';

							var blob = new Blob([ response ], {
								type : 'text/plain'
							});

							$('<a>').attr({
								href : URL.createObjectURL(blob),
								download : fileName
							})[0].click();
						});
					}
				} ]
			};

			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, as.generics.select.builder, properties)
			};
		}));

		var properties = {
			template : template,
			controls : controls,
			header : as.locale.docs.name
		};

		return as.generics.panel.builder(context, name, properties, Class);
	}

	return panel;
});