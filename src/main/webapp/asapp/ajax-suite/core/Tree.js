define(['ajax-suite/utils/@dir', './TreeBranch'], function(utils, TreeBranch) {
	"use strict";

	/*
	 * ------------- TREE CLASS --------------
	 */
	function Tree(context, path, template, parameters) {
		TreeBranch.call(this, context, path, template, parameters);

		this.element.attr({
			'tabindex': this.element.attr('tabindex') || 0
		});

		this.branchBuilder = parameters.branchBuilder;
	}
	Tree.prototype = Object.create(TreeBranch.prototype);
	Tree.prototype.constructor = Tree;

	Tree.prototype.on = function(control, eventType, data) {
		if (['control:focusin'].includes(eventType) && (control.root === this)) {
			this.send(eventType, data).activeElement.focus();
			return false;
		}
		if (['control:tabulate'].includes(eventType)) {
			this.send(eventType, data);
			return false;
		}
		if (['control:into'].includes(eventType) && (control.root === this)) {
			control.context.setState(((control.context.state === 'expanded')) ? 'collapsed' : 'expanded');
			return false;
		}
		if (['control:updown'].includes(eventType) && (control.root === this)) {
			if (!data.shiftKey) {
				var next = function(entry, updown, itemId) {
					var nextEntry = this.nextEntry(entry, updown);
					var activeControl = (itemId !== undefined && nextEntry.tabLoop[itemId].isVisible()) ? nextEntry.tabLoop[itemId] : nextEntry.getDefaultActiveElement();
					nextEntry.focus(activeControl);
					if (!nextEntry.element.has(document.activeElement).length) {
						next(nextEntry, updown, itemId);
					}
				}.bind(this);

				var updown = (data.which === 38) ? -1 : 1;
				var itemId = (control.activeElement) ? control.activeElement.itemId : null;
				next(control, updown, itemId);
				return false;
			}
		}
		if (['branch:collapse'].includes(eventType)) {
			(this.activeElement && control.context.getEntry(this.activeElement.attributes.code)) ? control.focus() : null;
			return false;
		}

		return TreeBranch.prototype.on.call(this, control, eventType, data);
	}

	Tree.prototype.setActiveElement = function(control) {
		var activeElement = TreeBranch.prototype.setActiveElement.call(this, control);

		(activeElement && !activeElement.isVisible()) ? activeElement.context.expandUp() : null;
		this.send('control:changed');

		return activeElement;
	}

	Tree.prototype.firstEntry = function() {
		return this.entry;
	}

	Tree.prototype.nextEntry = function(entry, updown) {
		function previous(entry) {

			function lastChild(entry) {
				return (entry.context.state === 'expanded') ? lastChild(entry.context.collection[entry.context.collection.length - 1].entry) : entry;
			}

			if (entry.parent) {
				var prevItem = entry.parent.context.collection[entry.itemId - 1];
				return (prevItem) ? (prevItem.entry.context.state === 'expanded') ? lastChild(prevItem.entry) : prevItem.entry : entry.parent;
			} else {
				return lastChild(entry);
			}
		}

		function next(entry) {

			function nextSibling(entry) {
				if (entry.parent) {
					return (entry.parent.context.collection[entry.itemId + 1]) ? entry.parent.context.collection[entry.itemId + 1].entry : nextSibling(entry.parent);
				} else {
					return entry;
				}
			}

			if (entry.context.state === 'expanded') {
				return entry.context.collection[0].entry || entry;
			} else {
				return nextSibling(entry);
			}
		}

		return (updown === 1) ? next(entry) : previous(entry);
	}

	Tree.prototype.setContent = function(data, state) {
		this.buildContent(data.node, data.collection, 1, state);
		this.send('control:refresh');
		return this;
	}

	Tree.prototype.getData = function() {
		function map(branch) {
			return {
				node: branch.entry.attributes,
				collection: branch.collection.map(function(item) {
					return map(item);
				})
			};
		}

		return utils.parseTree(map(this));
	}

	Tree.prototype.getFullData = function() {
		function map(branch) {
			var values = Object.keys(branch.entry.controls).reduce(function(result, key) {
				result[key] = branch.entry.controls[key].getValue();
				return result
			}, {});

			return {
				node: Object.assign({}, branch.entry.attributes, values),
				collection: branch.collection.map(function(item) {
					return map(item);
				})
			};
		}

		return utils.parseTree(map(this));
	}

	Tree.prototype.setValue = function(value) {
		this.setActiveElement(this.getEntryById(value));
		(this.activeElement) ? this.activeElement.context.expandUp() : null;

		return this;
	}

	Tree.prototype.getValue = function() {
		return (this.activeElement) ? this.activeElement.getValue() : null;
	}

	return Tree;
});