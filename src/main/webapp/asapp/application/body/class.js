define([ 'as', './frmLogin/builder' ], function(as, frmLoginBuilder) {
	"use strict";

	var Class = as.generics.application.Class;

	/*
	 * ------------- APPLICATION CLASS --------------
	 */
	function Application(template, daoBuilder) {
		Class.call(this, template, daoBuilder);

		this.authorities = '';
	}
	Application.prototype = Object.create(Class.prototype);
	Application.prototype.constructor = Application;

	Application.prototype.setContent = function(controls) {
		this.dao = this.dao.getAuthorities().execute(function(response) {
			Class.prototype.setContent.call(this, controls);

			this.authorities = response;
			this.controls['login'].setVisibility(!this.authorities);
			this.controls['logout'].setVisibility(!!this.authorities);
		}.bind(this));

		return this;
	}

	Application.prototype.errorMessage = function(status, response) {
		var windowContentBuilder = function(context) {
			var properties = {
				onSubmit : function(windowContent) {
					windowContent.send('execute', 'destroy');
					if (status === 401) {
						location.reload();
					}
				},
				header : as.locale.error[status].header,
				message : as.locale.error[status][response.code || '00']
			};

			return as.uio.frmConfirmBuilder(context, '*/content', properties);
		};

		this.addWindow(windowContentBuilder, true);

		return false;
	}

	Application.prototype.login = function() {
		var windowContentBuilder = function(context) {
			var properties = {
				attributes : {
					username : null,
					password : null
				},
				onSubmit : function(windowContent) {
					windowContent.send('execute', 'destroy');
					this.dao = this.dao.login(windowContent.attributes).execute(function(response) {
						location.reload();
					}.bind(this));
				}.bind(this)
			};

			return frmLoginBuilder(context, '*/content', properties);
		}.bind(this);

		this.application.addWindow(windowContentBuilder, true);
	}

	Application.prototype.logout = function() {
		this.dao = this.dao.logout().execute(function(response) {
			location.reload();
		});
	}

	return Application;
});