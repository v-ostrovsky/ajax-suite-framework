define([ './Control' ], function(Control) {
	"use strict";

	/*
	 * ------------- LIST CLASS --------------
	 */
	function List(context, name, template, container, entryBuilder) {
		Control.call(this, context, name, template);

		this.container = this.element.find('[name="' + container + '"]');
		this.entryBuilder = entryBuilder;

		this.collection = [];
		this.sortFields = [];
	}
	List.prototype = Object.create(Control.prototype);
	List.prototype.constructor = List;

	List.prototype._clearCollection_ = function() {
		this.collection = [];
		this.container.empty();
	}

	List.prototype.on = function(control, eventType, data) {
		if ([ 'control:focusin' ].includes(eventType) && (control.root === this)) {
			(control != this.activeElement) ? this.setActiveElement(control) : null;
			this.send(eventType, data).activeElement.focus();
			return false;
		}
		if ([ 'control:tabulate' ].includes(eventType)) {
			this.send(eventType, data);
			return false;
		}
		if ([ 'control:updown' ].includes(eventType) && (control.root === this)) {
			if (!data.shiftKey) {
				var updown = (data.which === 38) ? -1 : 1;
				var nextEntry = this.nextEntry(control, updown);
				var itemId = (control.activeElement) ? control.activeElement.itemId : undefined;
				var activeControl = (itemId != undefined && nextEntry.tabLoop[itemId].isVisible()) ? nextEntry.tabLoop[itemId] : nextEntry.getDefaultActiveElement();
				nextEntry.focus(activeControl);
				return false;
			}
		}
	}

	List.prototype.comparator = function(entryA, entryB) {
		var comparison = 0;
		for ( var index in this.sortFields) {
			var item = this.sortFields[index], sign = (item.sortOrder === 'desc') ? -1 : 1;
			var fieldA = entryA.controls[item.name], a = (fieldA.input ? fieldA.input.element.val() : fieldA.getValue());
			var fieldB = entryB.controls[item.name], b = (fieldB.input ? fieldB.input.element.val() : fieldB.getValue());
			comparison = (typeof item.comparator === 'function') ? sign * item.comparator(a, b) : 0;
			if (comparison != 0) {
				break;
			};
		}

		return (comparison === 0) ? (entryA.getValue() - entryB.getValue()) : comparison;
	}

	List.prototype.firstEntry = function() {
		return (this.collection && this.collection.length) ? this.collection[0] : null;
	}

	List.prototype.lastEntry = function() {
		return (this.collection && this.collection.length) ? this.collection[this.collection.length - 1] : null;
	}

	List.prototype.nextEntry = function(entry, updown) {
		return this.collection[entry.itemId + updown] || this.collection[(updown === 1) ? 0 : this.collection.length - 1];
	}

	List.prototype.getDefaultActiveElement = function() {
		return this.firstEntry();
	}

	List.prototype.setActiveElement = function(entry) {
		(this.activeElement && (this.activeElement != entry)) ? this.activeElement.setActiveStatus('none') : null;
		(entry && !entry.isActive) ? entry.setActiveStatus('inactive') : null;

		this.activeElement = entry;
		this.send('control:changed');

		return this.activeElement;
	}

	List.prototype.sort = function(fields) {
		this.sortFields = fields.concat(this.sortFields.filter(function(item) {
			return !fields.includes(item);
		}));

		this.collection.sort(this.comparator.bind(this)).forEach(function(item, index) {
			item.setItemId(this, index);
			item.element.appendTo(this.container);
		}.bind(this));

		(this.activeElement) ? this.activeElement.focus() : null;

		return this;
	}

	List.prototype.addContent = function(data) {
		var entries = data.map(function(item) {
			return this.entryBuilder(this, item);
		}.bind(this));

		this.collection = this.collection.concat(entries);
		this.sort(this.sortFields);

		return entries;
	}

	List.prototype.setContent = function(data) {
		this._clearCollection_();
		this.addContent(data);

		return this.send('content:set');
	}

	List.prototype.crud = function(defaultEntryId, data) {
		var eventType = '';
		if (defaultEntryId < 0) {
			eventType = 'content:create';
		} else if (data) {
			eventType = 'content:edit';
		} else {
			eventType = 'content:remove';
		}

		var defaultEntry = this.collection.find(function(item) {
			return item.attributes.id === Math.abs(defaultEntryId);
		});

		var entries = [], collection = this.collection.slice();
		this.collection = [];
		collection.forEach(function(item) {
			if (item.attributes.id === defaultEntryId) {
				entries.push(item);
				item.element.remove();
			} else {
				this.collection.push(item);
				item.setItemId(this, this.collection.length - 1);
			}
		}.bind(this));

		var entry = (defaultEntry) ? (this.collection[defaultEntry.itemId] || this.collection[defaultEntry.itemId - 1]) : null;
		if (data && data.length) {
			entry = this.addContent(data)[0];
		}
		this.send(eventType);

		return entry;
	}

	List.prototype.forEach = function(handler) {
		for (var index = 0; index < this.collection.length; index++) {
			var result = handler(this.collection[index]);
			if (result) {
				return result;
			}
		}
	}

	List.prototype.getEntryById = function(id) {
		if (this.collection && id) {
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

	List.prototype.setValue = function(value) {
		this.setActiveElement(this.getEntryById(value));
		return this;
	}

	List.prototype.getValue = function() {
		return (this.activeElement) ? this.activeElement.getValue() : null;
	}

	return List;
});