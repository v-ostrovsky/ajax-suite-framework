define([], function() {
	"use strict";

	var debug = false;

	/*
	 * ------------- UTILITIES --------------
	 */
	function mixin(target, source) {
		var excluded = [ '_requestParams', '_handler_' ];
		for ( var attr in source) {
			if (source.hasOwnProperty(attr) && !target.hasOwnProperty(attr) && !excluded.includes(attr)) {
				target[attr] = source[attr];
			}
		}
	}

	/*
	 * ------------- REAR SINGLETON --------------
	 */
	var rear = {
		currentContext : null
	};

	/*
	 * ------------- PENDENT ABSTRACT CLASS --------------
	 */
	function Pendent(requestParams) {
		Pendent.instanceId = (Pendent.instanceId === undefined) ? 0 : Pendent.instanceId + 1;
		this._instanceId_ = Pendent.instanceId;
		this._isResolved_ = false;
		this._children_ = [];
		this._context_ = rear.currentContext;
		if (this._context_) {
			this._context_._children_.push(this);
		}
		if (requestParams) {
			this._requestParams = requestParams;
		}

		if (debug) {
			this._request_ = requestParams;
			rear.instances[this._instanceId_] = this;
		}
	}

	Pendent.prototype._setHandler_ = function(handler) {
		if (this._isResolved_) {
			handler();
		} else {
			this._handler_ = handler;
		}

		return this;
	}

	Pendent.prototype._resolve_ = function() {
		if (this._isResolved_) {
			console.error('The object with the _instanceId_=' + this._instanceId_ + ' has already been resolved');
			return;
		}

		var unresolved = this._children_.filter(function(item) {
			return !item._isResolved_;
		});

		if (unresolved.length === 0) {
			this._isResolved_ = true;

			if (this.hasOwnProperty('_handler_')) {
				this._handler_();
			} else if (this._context_) {
				this._context_._resolve_();
			}
		}

		return this;
	}

	Pendent.prototype._sendRequest = function() {}

	Pendent.prototype._oncomplete = function(status, response) {
		this.status = status;
		this._response_ = response;
		this._resolve_();
	}

	/*
	 * ------------- SUSPENDED ABSTRACT CLASS --------------
	 */
	function Suspended(parameters) {
		Pendent.call(this);

		this.parameters = parameters || {};
		this._isResolved_ = true;
	}
	Suspended.prototype = Object.create(Pendent.prototype);
	Suspended.prototype.constructor = Pendent;

	Suspended.prototype.fetch = function(requestParams) {
		var reopened = Object.create(this);
		Pendent.call(reopened, requestParams);

		this._setHandler_(function() {
			mixin(reopened, this);
			reopened._sendRequest();
		}.bind(this));

		return reopened;
	}

	Suspended.prototype.execute = function(callback) {
		var reopened = Object.create(this);
		Pendent.call(reopened);

		if (debug) {
			reopened._request_ = 'execute';
		}

		this._setHandler_(function() {
			if (this._response_ !== false) {
				mixin(reopened, this);
				var currentContext = rear.currentContext;
				rear.currentContext = reopened;
				var returnValue = callback.call(reopened, reopened._response_);
				reopened._response_ = (returnValue != undefined) ? returnValue : reopened._response_;
				rear.currentContext = currentContext;
			}
			reopened._resolve_();
		}.bind(this));

		return reopened;
	}

	rear.Suspended = Suspended;

	/*
	 * ------------- EXECUTION --------------
	 */
	if (debug) {
		rear.instances = [];
		console.log('rear', rear);
	}

	return rear;
});