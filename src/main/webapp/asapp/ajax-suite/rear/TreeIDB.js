define([ './IDB' ], function(IDB) {
	"use strict";

	/* УСТАРЕВШИЙ!!! */

	/*
	 * ------------- UTILITIES --------------
	 */
	function getCodeLevel(code) {
		var level = 0;
		while (code.includes('.')) {
			code = code.slice(code.indexOf('.') + 1);
			level += 1;
		}
		return level;
	}

	function getCodeHead(code, level) {
		var head = '';
		for (var i = 0; i < level; i++) {
			head = head + code.slice(0, code.indexOf('.') + 1);
			code = code.slice(code.indexOf('.') + 1);
		}
		return head;
	}

	function parentCode(code) {
		return getCodeHead(code, getCodeLevel(code) - 1);
	}

	function isNested(nodeCode, branchCode) {
		return (nodeCode.slice(0, branchCode.length) === branchCode);
	}

	function getBranchNumber(code, level) {
		var head = getCodeHead(code, level - 1);
		var body = getCodeHead(code, level).slice(head.length);
		return body.slice(0, body.length - 1);
	}

	function shiftBranchNumber(code, level, shift) {
		var head = getCodeHead(code, level - 1);
		var body = getCodeHead(code, level).slice(head.length);
		var tail = code.slice(getCodeHead(code, level).length);
		return head + ((body.length) ? (parseInt(body) + shift) + '.' : '') + tail;
	}

	/*
	 * ------------- TREE INDEXEDDB CLASS --------------
	 */
	function TreeIDB(requestParams) {
		IDB.call(this, requestParams);
	}
	TreeIDB.prototype = Object.create(IDB.prototype);
	TreeIDB.prototype.constructor = TreeIDB;

	TreeIDB.prototype.create = function(entry) {

		function create() {
			var parentBranchCode = parentCode(entry.code);
			var boundKeyRange = null;
			if (parentBranchCode.length) {
				var lowerBound = parentBranchCode, upperBound = shiftBranchNumber(parentBranchCode, getCodeLevel(parentBranchCode), 1);
				boundKeyRange = IDBKeyRange.bound(lowerBound, upperBound, false, true);
			}

			this.index('code').openKeyCursor(boundKeyRange, "prev").onsuccess = function(event) {
				var cursor = event.target.result;
				if (cursor && (entry.code.includes('*'))) {
					var lastWhereCode = getCodeHead(shiftBranchNumber(cursor.key, getCodeLevel(parentBranchCode) + 1, 1), getCodeLevel(parentBranchCode) + 1);
					entry.code = (lastWhereCode === parentBranchCode) ? parentBranchCode + '1.' : lastWhereCode
				}
				this['add'](entry);
				this.transaction.result = entry.code;
			}.bind(this);
			return this.transaction;
		}

		var requestParams = {
			exec : create
		}
		return this.fetch(requestParams);
	}

	TreeIDB.prototype.edit = function(entry) {

		function edit() {
			this['put'](entry);
			this.transaction.result = entry.code;
			return this.transaction;
		}

		var requestParams = {
			exec : edit
		}
		return this.fetch(requestParams);
	}

	TreeIDB.prototype.move = function(data) {
		var what = data.what, position = data.position, where = data.where;

		function moveInBatch() {
			var lowerBound = where.code, upperBound = shiftBranchNumber(where.code, getCodeLevel(where.code), 1);
			var boundKeyRange = (where.code.length === 0) ? null : IDBKeyRange.bound(lowerBound, upperBound, false, true);

			this.index('code').openKeyCursor(boundKeyRange, "prev").onsuccess = function(event) {
				var whatBranchCode = what.code, whatBranchLevel = getCodeLevel(whatBranchCode);
				var whatParentBranchCode = parentCode(whatBranchCode);

				var lastWhereCode = getCodeHead(shiftBranchNumber(event.target.result.key, getCodeLevel(where.code) + 1, 1), getCodeLevel(where.code) + 1);
				var whereBranchCode = (position === 'inside') ? ((lastWhereCode === where.code) ? where.code + '1.' : lastWhereCode) : where.code;
				var whereParentBranchCode = parentCode(whereBranchCode);
				var newBranchCode = (isNested(whereBranchCode, whatParentBranchCode) && (getCodeHead(whereBranchCode, getCodeLevel(whatBranchCode)) > whatBranchCode)) ? shiftBranchNumber(whereBranchCode, getCodeLevel(whatBranchCode), -1) : whereBranchCode;;

				this.openCursor().onsuccess = function(event) {
					var cursor = event.target.result;
					if (cursor) {
						var code = cursor.value.code;
						if (isNested(cursor.value.code, whatParentBranchCode) && (getCodeHead(cursor.value.code, getCodeLevel(whatBranchCode)) > whatBranchCode)) {
							code = shiftBranchNumber(code, getCodeLevel(whatBranchCode), -1);
						}
						if (isNested(cursor.value.code, whereParentBranchCode) && (getCodeHead(cursor.value.code, getCodeLevel(whereBranchCode)) >= whereBranchCode)) {
							code = shiftBranchNumber(code, getCodeLevel(whereBranchCode), 1);
						}
						if (isNested(cursor.value.code, whatBranchCode)) {
							var codeHead = getCodeHead(code, getCodeLevel(whatBranchCode));
							code = newBranchCode + code.slice(codeHead.length);
						}
						if (code != cursor.value.code) {
							cursor.value.code = code;
							this['put'](cursor.value)
						}
						cursor['continue']();
					}
				}.bind(this);
				this.transaction.result = newBranchCode;
			}.bind(this);
			return this.transaction;
		}

		var requestParams = {
			exec : moveInBatch
		}
		return this.fetch(requestParams);
	}

	TreeIDB.prototype.remove = function(entry) {

		function removeInBatch() {
			var whatBranchCode = entry.code;
			var whatParentBranchCode = parentCode(whatBranchCode);

			this.openCursor().onsuccess = function(event) {
				var cursor = event.target.result;
				if (cursor) {
					var code = cursor.value.code;
					if (isNested(cursor.value.code, whatParentBranchCode) && (getCodeHead(cursor.value.code, getCodeLevel(whatBranchCode)) > whatBranchCode)) {
						code = shiftBranchNumber(code, getCodeLevel(whatBranchCode), -1);
					}
					if (isNested(cursor.value.code, whatBranchCode)) {
						this['delete'](cursor.primaryKey);
					}
					if (code != cursor.value.code) {
						cursor.value.code = code;
						this['put'](cursor.value)
					}
					cursor['continue']();
				}
			}.bind(this);
			this.transaction.result = whatParentBranchCode;
			return this.transaction;
		}

		var requestParams = {
			exec : removeInBatch
		}
		return this.fetch(requestParams);
	}

	return TreeIDB;
});