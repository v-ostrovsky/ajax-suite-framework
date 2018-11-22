define([ 'as', './class', 'text!./template.htpl', './pnlUsers/builder' ], function(as, Class, template, pnlUsersBuilder) {
	"use strict";

	function panel(context, name) {

		var controls = [].concat([ 'users' ].map(function(item) {
			var properties = {
				defaultValue : as.locale.sidemenu[item],
				handler : function(self) {
					function builder(context) {
						return pnlUsersBuilder(context, '*/content');
					}

					self.application.addWindow(builder, true);
				}
			};

			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, as.generics.button.builder, properties)
			};
		})).concat([ 'dumpDb' ].map(function(item) {
			var properties = {
				defaultValue : as.locale.sidemenu[item],
				handler : function(self) {
					as.dao.admin(self.application).dumpDb().execute(function(response) {
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
			};

			return {
				name : item,
				builder : as.generics.bindBuilder('*/' + item, as.generics.button.builder, properties)
			};
		}));

		var properties = {
			template : template,
			controls : controls
		};

		return as.generics.panel.builder(context, name, properties, Class);
	}

	return panel;
});