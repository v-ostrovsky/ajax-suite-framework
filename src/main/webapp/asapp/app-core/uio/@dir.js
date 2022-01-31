define(['./btnExpcol/builder', './ckeditorToolbar/builder', './frmDialog/builder', './pnlFeedback/builder', './selectorDisplayControl/builder', './selectorList/builder', './selectorPanel/builder', './selectorTree/builder', './subscriptions/builder'],
	function(btnExpcolBuilder, ckeditorToolbar, frmDialogBuilder, pnlFeedback, selectorDisplayControl, selectorList, selectorPanel, selectorTree, subscriptions) {
		"use strict";

		return {
			btnExpcolBuilder: btnExpcolBuilder,
			ckeditorToolbar: ckeditorToolbar,
			frmDialogBuilder: frmDialogBuilder,
			pnlFeedback: pnlFeedback,
			selectorDisplayControl: selectorDisplayControl,
			selectorList: selectorList,
			selectorPanel: selectorPanel,
			selectorTree: selectorTree,
			subscriptions: subscriptions
		};
	});