define(['./Control', 'ajax-suite/utils/@dir'], function(Control, utils) {
	"use strict";

	/*
	 * ------------- EXPCOL INTERFACE --------------
	 */
	function Expcol(context, path, template) {
		Control.call(this, context, path, template);

		this.setVisibility(false);
	}
	Expcol.prototype = Object.create(Control.prototype);
	Expcol.prototype.constructor = Expcol;

	Expcol.prototype.setHandler = function(handler) {
		return this;
	}

	Expcol.prototype.setState = function(state) {
		return this;
	}

	/*
	 * ------------- TREE BRANCH CLASS --------------
	 */
	function TreeBranch(context, path, template, parameters) {
		Control.call(this, context, path, 'create:' + template);

		this.expcolBuilder = parameters.expcolBuilder || this.context.expcolBuilder || function(context, path) {
			return new Expcol(context, path, 'create:<div name="expcol"></div>');
		};
		this.entryBuilder = parameters.entryBuilder || this.context.entryBuilder;
		this.branchBuilder = this.context.branchBuilder;

		this.collection = [];
		this.collectionElement = this.element.children('[name="collection"]');
	}
	TreeBranch.prototype = Object.create(Control.prototype);
	TreeBranch.prototype.constructor = TreeBranch;

	TreeBranch.prototype.on = function(control, eventType, data) {
		if (['control:changed'].includes(eventType) && (control === this.expcol)) {
			this.setState(['expanded'].includes(this.state) ? 'collapsed' : 'expanded', data);
			return false;
		}
	}

	TreeBranch.prototype.setState = function(state, animation) {
		if (this.entry) {
			if (this.collection.length) {
				this.state = (state && !['none'].includes(state)) ? state : 'collapsed';

				if (this.state === 'collapsed' && this.element.has(document.activeElement).length) {
					this.entry.focus();
				}

				if (animation) {
					var collection = {
						element: this.collectionElement
					};

					animation = Object.assign(animation, {
						expanded: 'showDown',
						collapsed: 'hideUp'
					});

					utils.animation[animation[this.state]](collection, animation.onComplete, animation.duration * this.collectionElement.outerHeight(true) / 100);
				} else {
					this.collectionElement.toggle(this.state === 'expanded');
				}
			} else {
				this.state = 'none';
				this.collectionElement.toggle(false);
			}

			this.expcol.setState(this.state);
		}

		return this;
	};

	TreeBranch.prototype.clear = function() {
		if (this.entry) {
			this.setActiveElement(null);

			this.entry.element.remove();
			delete this.entry;

			this.expcol.element.remove();
			delete this.expcol;

			this.collection.forEach(function(item) {
				item.element.remove();
			});
			this.collection = [];
		}

		return this;
	}

	TreeBranch.prototype.addBranch = function(data, itemId) {
		return this.branchBuilder(this, 'collection').buildContent(data.node, data.collection, itemId, data.state);
	}

	TreeBranch.prototype.buildContent = function(attributes, collection, itemId, state) {
		this.clear();

		var root = (this.context instanceof TreeBranch) ? this.context.entry.root : this;

		this.expcol = this.expcolBuilder(this, 'node');

		this.entry = this.entryBuilder(this, 'node', attributes).setItemId(root, itemId);
		this.entry.parent = (this.context instanceof TreeBranch) ? this.context.entry : null;

		collection.forEach(function(item, index) {
			this.collection[index] = this.addBranch(item, index);
		}.bind(this));

		this.setState(state);

		return this;
	}

	TreeBranch.prototype.forEach = function(handler) {
		function forEachSubEntry(branch) {
			for (var key in branch.collection) {
				var result = handler(branch.collection[key].entry) || forEachSubEntry(branch.collection[key]);
				if (result) {
					return result;
				}
			}
		}

		return this.entry ? (handler(this.entry) || forEachSubEntry(this)) : null;
	}

	TreeBranch.prototype.getEntry = function(code) {
		function findChild(branch, code) {
			if (code === branch.entry.attributes.code) {
				return branch;
			} else {
				var found = branch.collection.find(function(item) {
					return (code.indexOf(item.entry.attributes.code) === 0)
				});

				return (found) ? findChild(found, code) : null;
			}
		}

		return findChild(this, code).entry;
	}

	TreeBranch.prototype.getEntryById = function(id) {
		return this.forEach(function(entry) {
			if (parseInt(entry.getValue()) === id) {
				return entry;
			}
		});
	}

	TreeBranch.prototype.forEachUp = function(handler) {
		function forEachContext(branch) {
			if (branch.context && branch.context instanceof TreeBranch) {
				return handler(branch.context.entry) || forEachContext(branch.context);
			}
		}

		return forEachContext(this);
	}

	TreeBranch.prototype.expandDown = function() {
		this.forEach(function(entry) {
			entry.context.setState('expanded');
		});
		return this;
	}

	TreeBranch.prototype.collapseDown = function() {
		this.forEach(function(entry) {
			entry.context.setState('collapsed');
		});
		return this;
	}

	TreeBranch.prototype.expandUp = function() {
		this.forEachUp(function(entry) {
			entry.context.setState('expanded');
		});
		return this;
	}

	TreeBranch.prototype.collapseUp = function() {
		this.forEachUp(function(entry) {
			entry.contex.setState('collapsed');
		});
		return this;
	}

	TreeBranch.prototype.mixStates = function(branch, states) {
		branch.state = states[branch.node.id] || 'collapsed';
		branch.collection.forEach(function(item) {
			TreeBranch.prototype.mixStates(item, states)
		});
	}

	TreeBranch.prototype.refresh = function(data) {
		var itemId = this.entry.itemId;

		var states = {};
		this.forEach(function(item) {
			states[item.getValue()] = item.context.state;
		});
		this.mixStates(data, states);

		return this.buildContent(data.node, data.collection, itemId, data.state);
	}

	return TreeBranch;
});