define([ './TreeBranch' ], function(TreeBranch) {
	"use strict";

	/*
	 * ------------- TREE DATA CLASS --------------
	 */
	function TreeData(data) {
		this.node = data.node;
		this.collection = data.collection;
	}

	TreeData.prototype.find = function(handler) {
		function find(branch) {
			if (handler(branch.node)) {
				return branch.node;
			} else {
				for ( var key in branch.collection) {
					var result = find(branch.collection[key]);
					if (result) {
						return result;
					}
				}
			}
		}

		return find(this);
	}

	/*
	 * ------------- TREE CLASS --------------
	 */
	function Tree(context, name, template, container, rootEntryBuilder, branchBuilder) {
		TreeBranch.call(this, context, name, template, container, rootEntryBuilder, branchBuilder);
	}
	Tree.prototype = Object.create(TreeBranch.prototype);
	Tree.prototype.constructor = Tree;

	Tree.prototype.on = function(control, eventType, data) {
		if ([ 'control:focusin' ].includes(eventType) && (control.root === this)) {
			(control != this.activeElement) ? this.setActiveElement(control) : null;
			this.send(eventType, data).activeElement.focus();
			return false;
		}
		if ([ 'control:tabulate' ].includes(eventType)) {
			this.send(eventType, data);
			return false;
		}
		if ([ 'control:into' ].includes(eventType) && (control.root === this)) {
			control.context.setState(((control.context.state === 'expanded')) ? 'collapsed' : 'expanded');
			return false;
		}
		if ([ 'control:updown' ].includes(eventType) && (control.root === this)) {
			if (!data.shiftKey) {
				var updown = (data.which === 38) ? -1 : 1;
				var nextEntry = nextEntry = this.nextEntry(control, updown);
				var itemId = (control.activeElement) ? control.activeElement.itemId : null;
				var activeControl = (itemId != undefined && nextEntry.tabLoop[itemId].isVisible()) ? nextEntry.tabLoop[itemId] : nextEntry.getDefaultActiveElement();
				nextEntry.focus(activeControl);
				return false;
			}
		}
		if ([ 'branch:collapse' ].includes(eventType)) {
			(this.activeElement && control.context.getEntry(this.activeElement.attributes.code)) ? control.focus() : null;
			return false;
		}
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

	Tree.prototype.getDefaultActiveElement = function() {
		return this.entry;
	}

	Tree.prototype.setActiveElement = function(entry) {
		(this.activeElement && (this.activeElement != entry)) ? this.activeElement.setActiveStatus('none') : null;
		(entry && !entry.isActive) ? entry.setActiveStatus('inactive') : null;

		this.activeElement = entry;
		this.send('control:changed');

		return this.activeElement;
	}

	Tree.prototype.setContent = function(data) {
		delete this.activeElement;
		data.state = 'expanded';
		this.buildContent(data.node, data.collection, 1);

		return this.send('content:set');
	}

	Tree.prototype.create = function(data) {
		var parentBranch = this.getEntry(data.node.code).context.refresh(data);
		parentBranch.setState('expanded');
		parentBranch.collection[parentBranch.collection.length - 1].entry.focus();
		this.send('content:create');
	}

	Tree.prototype.edit = function(data) {
		var entry = this.getEntry(data.node.code).fillContent(data.node);
		this.send('content:edit');
	}

	Tree.prototype.moveBranch = function(data, entryId) {
		var parentBranch = this.getEntry(data.node.code).context.refresh(data);
		var entry = this.getEntryById(entryId);
		entry.context.expandUp();
		entry.focus();
		this.send('content:moveBranch');
	}

	Tree.prototype.removeBranch = function(data) {
		var parentBranch = this.getEntry(data.node.code).context.refresh(data);
		parentBranch.entry.focus();
		this.send('content:removeBranch');
	}

	Tree.prototype.getData = function() {
		function map(branch) {
			return new TreeData({
				node : branch.entry.attributes,
				collection : branch.collection.map(function(item) {
					return map(item);
				})
			});
		}

		return map(this);
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