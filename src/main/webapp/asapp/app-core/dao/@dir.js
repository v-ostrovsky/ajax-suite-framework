define(['./Composite', './FR', './fr/ExcelFR', './fr/TextFR', './IDB', './idb/ListIDB', './idb/TreeIDB', './ManagerIDB', './Sync', './sync/ListSync', './sync/TreeSync', './XHR', './xhr/FunctionXHR', './xhr/ListXHR', './xhr/TreeXHR'],
	function(Composite, FR, ExcelFR, TextFR, IDB, ListIDB, TreeIDB, ManagerIDB, Sync, ListSync, TreeSync, XHR, FunctionXHR, ListXHR, TreeXHR) {
		"use strict";

		return {
			Composite: Composite,
			FR: FR,
			ExcelFR: ExcelFR,
			TextFR: TextFR,
			IDB: IDB,
			ListIDB: ListIDB,
			TreeIDB: TreeIDB,
			ManagerIDB: ManagerIDB,
			Sync: Sync,
			ListSync: ListSync,
			TreeSync: TreeSync,
			XHR: XHR,
			FunctionXHR: FunctionXHR,
			ListXHR: ListXHR,
			TreeXHR: TreeXHR
		};
	});