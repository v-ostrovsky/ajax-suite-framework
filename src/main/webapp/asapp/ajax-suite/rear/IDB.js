define([ './rear' ], function(rear) {
	"use strict";

	/*
	 * ------------- INDEXEDDB CLASS --------------
	 */
	function IDB(parameters) {
		rear.Suspended.call(this, parameters);
	}
	IDB.prototype = Object.create(rear.Suspended.prototype);
	IDB.prototype.constructor = IDB;

	IDB.prototype._createDatabase_ = function() {
		var request = window.indexedDB.open(this.parameters.dbName, this.parameters.version);

		request.onupgradeneeded = function(event) {
			var objectStore = request.result.createObjectStore(this.parameters.objectStoreName, {
				keyPath : this.parameters.keyPath,
				autoIncrement : this.parameters.autoIncrement
			});

			var indexes = this.parameters.indexes || [];
			indexes.forEach(function(item) {
				objectStore.createIndex(item.indexName, item.indexName, {
					unique : item.unique
				});
			});
		}.bind(this);

		request.onsuccess = function(event) {
			request.result.close();
			this._oncomplete('success', null);
		}.bind(this);

		request.onerror = function(event) {
			request.result.close();
			this._oncomplete('error', event.target.error);
		}.bind(this);
	}

	IDB.prototype._deleteDatabase_ = function() {
		var request = window.indexedDB.deleteDatabase(this.parameters.dbName);

		request.onsuccess = function(event) {
			this._oncomplete('success', null);
		}.bind(this);

		request.onerror = function(event) {
			this._oncomplete('error', event.target.error);
		}.bind(this);
	}

	IDB.prototype._exec_ = function(callback) {
		var request = window.indexedDB.open(this.parameters.dbName, this.parameters.version);

		request.onupgradeneeded = function(event) {
			event.target.transaction.abort();
		}

		request.onsuccess = function(event) {
			var storeName = this.parameters.objectStoreName;

			var tx = request.result.transaction(storeName, 'readwrite');
			var response = callback(tx.objectStore(storeName));

			tx.oncomplete = function(event) {
				request.result.close();
				this._oncomplete('success', (response ? response.result : null));
			}.bind(this);

			tx.onerror = function(event) {
				request.result.close();
				this._oncomplete('error', event.target.error);
			}.bind(this);
		}.bind(this);

		request.onerror = function(event) {
			this._oncomplete('error', event.target.error);
		}.bind(this);

	}

	IDB.prototype._fillStore_ = function() {
		this._exec_(function(store) {
			this._requestParams.data.forEach(function(item) {
				store.add(item);
			});
		}.bind(this));
	}

	IDB.prototype._clearStore_ = function() {
		this._exec_(function(store) {
			store.clear();
		});
	}

	IDB.prototype._crud_ = function() {
		var method = this._requestParams.type, data = this._requestParams.data;
		this._exec_(function(store) {
			return ((data) ? store[method](data) : store[method]());
		});
	}

	IDB.prototype._sendRequest = function() {
		var type = this._requestParams.type;
		([ 'createDatabase', 'deleteDatabase', 'fillStore', 'clearStore' ].includes(type)) ? this['_' + type + '_']() : this._crud_();
	}

	IDB.prototype.execute = function(onsuccess, onfailure) {
		function callback(response) {
			return (this.status === 'success') ? onsuccess.call(this, response) : onfailure.call(this, this.status, response);
		};

		return rear.Suspended.prototype.execute.call(this, callback);
	}

	IDB.prototype.createDatabase = function() {
		var requestParams = {
			type : 'createDatabase'
		};

		return this.fetch(requestParams);
	}

	IDB.prototype.deleteDatabase = function() {
		var requestParams = {
			type : 'deleteDatabase'
		};

		return this.fetch(requestParams);
	}

	IDB.prototype.fillStore = function(data) {
		var requestParams = {
			type : 'fillStore',
			data : data
		};

		return this.fetch(requestParams);
	}

	IDB.prototype.clearStore = function() {
		var requestParams = {
			type : 'clearStore'
		};

		return this.fetch(requestParams);
	}

	return IDB;
});