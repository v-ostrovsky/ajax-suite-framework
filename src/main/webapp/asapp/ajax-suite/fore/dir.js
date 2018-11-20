define([ './application/dir', './button/dir', './buttonFile/dir', './buttonToggle/dir', './control/dir', './entry/dir', './field/dir', './form/dir', './label/dir', './list/dir', './panel/dir', './radio/dir', './select/dir', './selectDropdown/dir', './table/dir', './tableEntry/dir', './tableHandle/dir', './tableHeader/dir', './tableHeaderField/dir', './tableList/dir', './tableListEntry/dir',
		'./tableListField/dir', './tableListFooter/dir', './tableListHeader/dir', './tableListHeaderField/dir', './tableTreeEntry/dir', './tabs/dir', './tree/dir', './treeBranch/dir' ],
		function(application, button, buttonFile, buttonToggle, control, entry, field, form, label, list, panel, radio, select, selectDropdown, table, tableEntry, tableHandle, tableHeader, tableHeaderField, tableList, tableListEntry, tableListField, tableListFooter, tableListHeader, tableListHeaderField, tableTreeEntry, tabs, tree, treeBranch) {
			"use strict";

			/*
			 * ------------- UTILITIES --------------
			 */
			function bindBuilder(name, builder, properties) {
				return function(context) {
					return builder(context, name, properties || {});
				};
			}

			return {
				bindBuilder : bindBuilder,
				application : application,
				button : button,
				buttonFile : buttonFile,
				buttonToggle : buttonToggle,
				control : control,
				entry : entry,
				field : field,
				form : form,
				label : label,
				list : list,
				panel : panel,
				radio : radio,
				select : select,
				selectDropdown : selectDropdown,
				table : table,
				tableEntry : tableEntry,
				tableHandle : tableHandle,
				tableHeader : tableHeader,
				tableHeaderField : tableHeaderField,
				tableList : tableList,
				tableListEntry : tableListEntry,
				tableListField : tableListField,
				tableListFooter : tableListFooter,
				tableListHeader : tableListHeader,
				tableListHeaderField : tableListHeaderField,
				tableTreeEntry : tableTreeEntry,
				tabs : tabs,
				tree : tree,
				treeBranch : treeBranch
			};
		});