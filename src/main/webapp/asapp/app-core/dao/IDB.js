define(['as'], function(as) {
	"use strict";

	var Fetcher = as.rear.Fetcher;

	// TODO Актуализировать в связи с включением status в параметр response метода _oncomplete класса Pendent

	/*
	 * ------------- INDEXEDDB CLASS --------------
	 */
	function IDB(parameters) {
		Fetcher.call(this);

		this.parameters = parameters;
		this.status = 'idbSuccess';
		this._response = {};
	}
	IDB.prototype = Object.create(Fetcher.prototype);
	IDB.prototype.constructor = IDB;

	IDB.prototype._sendRequest = function() {
		var dbRequest = window.indexedDB.open(this.parameters.dbName, this.parameters.version);

		dbRequest.onupgradeneeded = function(event) {
			event.target.transaction.abort();
		}

		dbRequest.onsuccess = function(event) {
			var storeName = this._requestParams.storeName, method = this._requestParams.type, data = this._requestParams.data
			var tx = dbRequest.result.transaction(storeName, 'readwrite'), store = tx.objectStore(storeName);

			if (['get'].includes(method) && !Number.isInteger(data)) {
				var result = [];

				var indexName = Object.keys(data)[0];
				var request = store.index(indexName).openCursor(IDBKeyRange.only(data[indexName]));
				request.onsuccess = function(event) {
					var cursor = event.target.result;
					if (cursor) {
						result.push(cursor.value);
						cursor['continue']();
					}
				};

				tx.oncomplete = function(event) {
					dbRequest.result.close();
					this._oncomplete('idbSuccess', result);
				}.bind(this);
			} else {
				var request = ((data) ? store[method](data) : store[method]());

				tx.oncomplete = function(event) {
					dbRequest.result.close();
					this._oncomplete('idbSuccess', (request ? request.result : null));
				}.bind(this);
			}

			tx.onerror = function(event) {
				dbRequest.result.close();
				this._oncomplete('idbError', event.target.error);
			}.bind(this);
		}.bind(this);

		dbRequest.onerror = function(event) {
			this._oncomplete('idbError', event.target.error);
		}.bind(this);
	}

	IDB.prototype.execute = function(onsuccess, onfailure) {
		function callback(response) {
			return (this.status === 'idbSuccess') ? onsuccess.call(this, response) : onfailure.call(this, this.status, response);
		};

		return Fetcher.prototype.execute.call(this, callback);
	}

	return IDB;
});