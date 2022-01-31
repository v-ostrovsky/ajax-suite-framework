define(['as', '../Sync'], function(as, Sync) {
	"use strict";

	/*
	 * ------------- LIST SYNCHRONIC ABSTRACT CLASS --------------
	 */
	function ListSync(data) {
		Sync.call(this, data);
	}
	ListSync.prototype = Object.create(Sync.prototype);
	ListSync.prototype.constructor = ListSync;

	ListSync.prototype.unparse = function(attributes) {
		return attributes;
	}

	ListSync.prototype.create = function(attributes) {
		var maxId = 0;
		if (this.data.length) {
			maxId = Math.max.apply(Math, this.data.map(function(item) {
				return item.id;
			}));
		}

		this.data.push(Object.assign({}, this.unparse(attributes), {
			id: maxId + 1
		}));

		this.response = [this.data[this.data.length - 1]];

		return this;
	}

	ListSync.prototype.edit = function(attributes) {
		var index = this.data.findIndex(function(item) {
			return (item.id === attributes.id);
		});

		this.data[index] = this.unparse(attributes);
		this.response = [this.data[index]];

		return this;
	}

	ListSync.prototype.remove = function(attributes) {
		var index = this.data.findIndex(function(item) {
			return (item.id === attributes.id);
		});

		this.data.splice(index, 1);
		this.response = null;

		return this;
	}

	return ListSync;
});