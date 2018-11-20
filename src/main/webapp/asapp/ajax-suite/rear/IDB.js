define([ './rear' ], function(rear) {
	"use strict";

	/* УСТАРЕВШИЙ!!! */

	/*
	 * ------------- INDEXEDDB CLASS --------------
	 */
	function IDB(requestParams) {
		rear.Suspended.call(this, requestParams);
	}
	IDB.prototype = Object.create(rear.Suspended.prototype);
	IDB.prototype.constructor = IDB;

	IDB.prototype._sendRequest = function() {
		// console.log('_sendRequest', this)
		var transaction = this._parent.value.transaction(this._parent.objectStoreName, 'readwrite');
		var objectStore = transaction.objectStore(this._parent.objectStoreName);
		objectStore.exec = this._requestParams.exec;
		var methodResult = objectStore.exec();

		transaction.oncomplete = function(event) {
			// console.log('oncomplete', this)
			this._oncomplete(methodResult);
		}.bind(this);

		transaction.onerror = function(event) {
			this._onerror(event.target.error);
		}.bind(this);
	}

	IDB.prototype._init = function() {
		this.dbName = this._requestParams.dbName;
		this.version = this._requestParams.version;
		this.objectStoreName = this._requestParams.objectStoreName;

		var db = window.indexedDB.open(this.dbName, this.version);

		db.onupgradeneeded = function(event) {
			var objectStore = event.currentTarget.result.createObjectStore(this.objectStoreName, {
				keyPath : this._requestParams.keyPath,
				autoIncrement : this._requestParams.autoIncrement
			});

			var indexes = this._requestParams.indexes || [];
			for ( var i in indexes) {
				objectStore.createIndex(indexes[i].indexName, indexes[i].indexName, {
					unique : indexes[i].unique
				});
			}
		}.bind(this);

		db.onsuccess = function(event) {
			this.objectStore = event.target.result.transaction(this.objectStoreName, 'readwrite').objectStore(this.objectStoreName);
			this._oncomplete(event.target.result);
		}.bind(this);

		db.onerror = function(event) {
			this._oncomplete(event.target.error);
		}.bind(this);
	}

	IDB.prototype.create = function(entry) {
		var requestParams = {
			exec : function() {
				return this['add'](entry);
			}
		}
		return this.fetch(requestParams);
	}

	IDB.prototype.edit = function(entry) {
		var requestParams = {
			exec : function() {
				return this['put'](entry);
			}
		}
		return this.fetch(requestParams);
	}

	IDB.prototype.remove = function(entry) {
		var requestParams = {
			exec : function() {
				return this['delete'](entry[this.keyPath]);
			}
		}
		return this.fetch(requestParams);
	}

	IDB.prototype.findAll = function() {
		var requestParams = {
			exec : function() {
				return this['getAll']();
			}
		}
		return this.fetch(requestParams);
	}

	return IDB;
});