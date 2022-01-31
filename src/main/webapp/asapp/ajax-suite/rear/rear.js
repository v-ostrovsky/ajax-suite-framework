define([], function() {
	"use strict";

	// TODO Сделать выбрасывание ошибки при вызове execute внутри execute, вызываемом на объекте из той же цепочки
	var debug = false;

	/*
	 * ------------- REAR SINGLETON --------------
	 */
	var rear = {
		currentContext: null
	};

	/*
	 * ------------- PENDENT ABSTRACT CLASS --------------
	 */
	function Pendent(requestParams) {
		Pendent.instanceId = (Pendent.instanceId === undefined) ? 0 : Pendent.instanceId + 1;
		this.instanceId = Pendent.instanceId;
		this._status_ = 'none';
		this._children_ = [];
		this._context_ = rear.currentContext;
		if (this._context_) {
			this._context_._children_.push(this);
		}
		this._requestParams = requestParams;

		if (debug) {
			rear.instances[this.instanceId] = this;
		}
	}

	Pendent.prototype._setHandler_ = function(handler) {
		if (['resolved', 'terminated'].includes(this._status_)) {
			handler('resolved');
		} else {
			this._handler_ = handler;
		}

		return this;
	}

	Pendent.prototype._resolve_ = function(status) {
		if (['resolved'].includes(status)) {
			if (['resolved', 'terminated'].includes(this._status_)) {
				console.error('The object with the instanceId=' + this.instanceId + ' has already been ' + this._status_);
				return this;
			}

			var unresolved = this._children_.filter(function(item) {
				return (['none'].includes(item._status_));
			});

			if (unresolved.length > 0) {
				return this;
			}
		}

		if (this.hasOwnProperty('_handler_')) {
			this._handler_(status);
		}

		this._status_ = status;
		if (this._context_) {
			this._context_._resolve_(status);
		}

		return this;
	}

	Pendent.prototype._sendRequest = function() { }

	Pendent.prototype._postProcessor = function(response) {
		return response;
	}

	Pendent.prototype._oncomplete = function(response) {
		this._response = this._postProcessor(response);
		this._resolve_('resolved');
	}

	/*
	 * ------------- FETCHER ABSTRACT CLASS --------------
	 */
	function Fetcher() {
		Pendent.call(this);

		this._status_ = 'resolved';
	}
	Fetcher.prototype = Object.create(Pendent.prototype);
	Fetcher.prototype.constructor = Pendent;

	Fetcher.prototype.fetch = function(requestParams) {
		var reopened = Object.create(this);
		Pendent.call(reopened, requestParams);

		this._setHandler_(function(status) {
			if (['resolved'].includes(status)) {
				if (typeof reopened._requestParams === 'function') {
					reopened._requestParams = reopened._requestParams(reopened._response);
				}

				reopened._sendRequest();
			} else {
				reopened._resolve_('terminated');
				this._status_ = 'resolved';
			}
		}.bind(this));

		return reopened;
	}

	Fetcher.prototype.execute = function(callback) {
		var reopened = Object.create(this);
		Pendent.call(reopened, callback);

		this._setHandler_(function(status) {
			if (['resolved'].includes(status)) {
				var currentContext = rear.currentContext;
				rear.currentContext = reopened;
				var dummyChild = new Pendent();
				var returnValue = reopened._requestParams(reopened._response);
				reopened._response = (returnValue !== undefined) ? returnValue : reopened._response;
				if (reopened._response === false) {
					dummyChild._resolve_('terminated');
				} else {
					dummyChild._resolve_('resolved');
				}
				rear.currentContext = currentContext;
			} else {
				reopened._resolve_('terminated');
			}
		}.bind(this));

		return reopened;
	}

	rear.Fetcher = Fetcher;

	/*
	 * ------------- EXECUTION --------------
	 */
	if (debug) {
		rear.instances = [];
		console.log('rear', rear);
	}

	return rear;
});