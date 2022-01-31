define(['./Control'], function(Control) {
	"use strict";

	/*
	 * ------------- LIST CLASS --------------
	 */
	function List(context, path, template, parameters) {
		Control.call(this, context, path, template);

		this.element.attr({
			'tabindex': this.element.attr('tabindex') || 0
		});

		this.entryBuilder = parameters.entryBuilder;

		this.collection = [];
		this.collectionElement = this.element.find('[name="collection"]');
		this.sortFields = [];
	}
	List.prototype = Object.create(Control.prototype);
	List.prototype.constructor = List;

	List.prototype._comparator_ = function(entryA, entryB) {
		var comparison = 0;
		for (var index in this.sortFields) {
			var item = this.sortFields[index], sign = (item.sortOrder === 'desc') ? -1 : 1;
			var fieldA = entryA.controls[item.name], a = fieldA ? ((fieldA.input ? fieldA.input.element.val() : fieldA.getValue())) : entryA.attributes[item.name];
			var fieldB = entryB.controls[item.name], b = fieldB ? ((fieldB.input ? fieldB.input.element.val() : fieldB.getValue())) : entryB.attributes[item.name];
			comparison = (typeof item.comparator === 'function') ? sign * item.comparator(a, b) : 0;
			if (comparison !== 0) {
				break;
			};
		}

		return (comparison === 0) ? (entryA.getValue() - entryB.getValue()) : comparison;
	}

	List.prototype.on = function(control, eventType, data) {
		if (['control:focusin'].includes(eventType) && (control.root === this)) {
			this.send(eventType, data).activeElement.focus();
			return false;
		}
		if (['control:tabulate'].includes(eventType)) {
			this.send(eventType, data);
			return false;
		}
		if (['control:updown'].includes(eventType) && (control.root === this)) {
			if (!data.shiftKey) {
				var updown = (data.which === 38) ? -1 : 1;
				var nextEntry = this.nextEntry(control, updown);
				var itemId = (control.activeElement) ? control.activeElement.itemId : undefined;
				var activeControl = (itemId !== undefined && nextEntry.tabLoop[itemId].isVisible()) ? nextEntry.tabLoop[itemId] : nextEntry.getDefaultActiveElement();
				nextEntry.focus(activeControl);
				return false;
			}
		}
	}

	List.prototype.setActiveElement = function(control) {
		var activeElement = Control.prototype.setActiveElement.call(this, control);
		this.send('control:changed');

		return activeElement;
	}

	List.prototype.sort = function(fields) {
		this.sortFields = (fields || []).concat((this.sortFields || []).filter(function(item) {
			return !fields.includes(item);
		}));

		this.collection.sort(this._comparator_.bind(this)).forEach(function(item, index) {
			item.setItemId(this, index);
			item.element.appendTo(this.collectionElement);
		}.bind(this));

		return this;
	}

	List.prototype.clear = function() {
		this.collection = [];
		this.collectionElement.empty();
		this.setActiveElement(null);

		return this;
	}

	List.prototype.addContent = function(data) {
		var entries = data.map(function(item) {
			return this.entryBuilder(this, 'collection', item);
		}.bind(this));

		this.collection = this.collection.concat(entries);
		this.sort(this.sortFields);

		return entries;
	}

	List.prototype.setContent = function(data) {
		this.clear();
		this.addContent(data);
		this.send('control:refresh');

		return this;
	}

	List.prototype.forEach = function(handler) {
		for (var index = 0; index < this.collection.length; index++) {
			var result = handler(this.collection[index]);
			if (result) {
				return result;
			}
		}
	}

	List.prototype.firstEntry = function() {
		return this.collection.length ? this.collection[0] : null;
	}

	List.prototype.lastEntry = function() {
		return this.collection.length ? this.collection[this.collection.length - 1] : null;
	}

	List.prototype.nextEntry = function(entry, updown) {
		return this.collection.length ? this.collection[entry.itemId + updown] || this.collection[(updown === 1) ? 0 : this.collection.length - 1] : null;
	}

	List.prototype.getEntryById = function(id) {
		if (this.collection) {
			return this.collection.find(function(item) {
				return item.getValue() === id;
			});
		} else {
			return undefined;
		}
	}

	List.prototype.getData = function() {
		return this.collection.map(function(entry) {
			return entry.attributes;
		});
	}

	List.prototype.getFullData = function() {
		return this.collection.map(function(entry) {
			var values = Object.keys(entry.controls).reduce(function(result, key) {
				result[key] = entry.controls[key].getValue();
				return result
			}, {});

			return Object.assign({}, entry.attributes, values);
		});
	}

	List.prototype.setValue = function(value) {
		this.setActiveElement(this.getEntryById(value));
		return this;
	}

	List.prototype.getValue = function() {
		return (this.activeElement) ? this.activeElement.getValue() : null;
	}

	return List;
});