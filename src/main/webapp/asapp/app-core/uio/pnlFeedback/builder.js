define(['as', './class', 'text!./template.htpl', './list/builder', './lstSubscription/builder'], function(as, Class, template, listBuilder, lstSubscriptionBuilder) {
	"use strict";

	function panel(context, path, propertiesExt) {

		var controls = [].concat(['list'].map(function(item) {
			return {
				name: item,
				builder: as.utils.bindBuilder('*/' + item, listBuilder, {})
			};
		})).concat(['lstSubscription'].map(function(item) {
			var properties = {
				visible: !['ROLE_ANONYMOUS'].includes(context.application.currentUser.role)
			};

			return {
				name: item,
				builder: as.utils.bindBuilder('*/' + item, lstSubscriptionBuilder, properties)
			};
		})).concat(['addMessages', 'create'].map(function(item) {
			var properties = {
				tooltip: as.locale.feedback[item],
				content: as.icons[{
					'addMessages': 'refresh',
					'create': 'send'
				}[item]],
				visible: false
			};

			return {
				name: item,
				builder: as.utils.bindBuilder('*/' + item, as.generics.button.builder, properties)
			};
		})).concat(['editor'].map(function(item) {
			return {
				name: item,
				builder: as.utils.bindBuilder('*/' + item, as.generics.textContent.builder)
			};
		}));

		var properties = {
			template: template,
			controls: controls,
			header: as.locale.feedback['name']
		};

		return as.generics.panel.builder(context, path, properties, Class).init(propertiesExt.noEditorToolbar);
	}

	return panel;
});