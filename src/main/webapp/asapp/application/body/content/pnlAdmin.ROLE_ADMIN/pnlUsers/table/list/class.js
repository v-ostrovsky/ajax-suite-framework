define([ 'as', './frmEdit/builder' ], function(as, frmEditBuilder) {
	"use strict";

	var Class = as.generics.list.Class;

	/*
	 * ------------- USERS LIST CLASS --------------
	 */
	function List(context, name, template, container, entryBuilder, daoBuilder) {
		Class.call(this, context, name, template, container, entryBuilder, daoBuilder);
	}
	List.prototype = Object.create(Class.prototype);
	List.prototype.constructor = List;

	List.prototype.on = function(control, eventType, data) {
		if ([ 'handle:dblclick' ].includes(eventType) && (control.root === this)) {
			this.edit();
			return false;
		}

		return Class.prototype.on.call(this, control, eventType, data);
	}

	List.prototype.create = function() {
		var attributes = {
			id : (this.activeElement) ? this.activeElement.attributes.id : null
		};

		Class.prototype.create.call(this, frmEditBuilder, attributes);
	}

	List.prototype.copy = function() {
		Class.prototype.copy.call(this, frmEditBuilder, this.activeElement.attributes);
	}

	List.prototype.edit = function() {
		Class.prototype.edit.call(this, frmEditBuilder, this.activeElement.attributes);
	}

	List.prototype.remove = function() {
		var header = as.locale.form.titleRemove;
		var message = as.locale.frmRemove.message + '<br>{ ' + this.activeElement.attributes.textId + ' } ?';

		Class.prototype.remove.call(this, as.uio.frmConfirmBuilder, this.activeElement.attributes, header, message);
	}

	return List;
});