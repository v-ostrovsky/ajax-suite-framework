define([ './class', 'objects/dir' ], function(Select, objects) {
	"use strict";

	function select(context, name, properties, Class) {

		function listBuilder(context, name) {
			return objects.selectList(context, name, properties.textId || 'textId', properties.sortOrder === 'desc');
		}
		function treeBuilder(context, name) {
			return objects.selectTree(context, name, properties.textId || 'textId');
		}

		var select = new (Class || Select)(context, name, properties.dataProcessor).setRepository().setLabel(properties.text);
		select.repository.storeBuilders(listBuilder, treeBuilder);

		if (properties.typeOfContent != undefined) {
			select.buildContent((properties.typeOfContent === 'tree') ? treeBuilder : listBuilder);
		}

		if (properties.data) {
			if (select.getContent() && (properties.dataProcessor === undefined)) {
				select.setContent(properties.data);
			} else {
				select.repository.storeData(properties.data, properties.dataProcessor);
			}
		}

		if (properties.defaultValue != undefined) {
			select.setValue(properties.defaultValue);
		}

		return select;
	}

	return select;
});