define([ 'as' ], function(as) {
	"use strict";

	var Class = as.generics.panel.Class;

	/*
	 * ------------- UTILITIES --------------
	 */
	function cast(value) {
		return Array.isArray(value) ? ('r' + value[0] + 'c' + value[1]) : value.slice(1).split('c');
	}

	/*
	 * ------------- TABLE DROPDOWN CONTENT CLASS --------------
	 */
	function Panel(context, path, template, parameters) {
		Class.call(this, context, path, template, parameters);
	}
	Panel.prototype = Object.create(Class.prototype);
	Panel.prototype.constructor = Panel;

	Panel.prototype._cellBuilders_ = function() {
		var element = this.controls['content'].element;

		var createRows = function(element) {
			var rows = [];
			for (var index = 0; index <= this.numOfRows; index++) {
				rows.push($('<div>').css({
					'display' : 'flex'
				}).attr({
					'name' : 'r' + index
				}).appendTo(element));
			}

			return rows;
		}.bind(this)

		var controls = [];
		createRows(element).forEach(function(row) {
			var rowName = $(row).attr('name');

			var cellsInRow = [];
			for (var index = 0; index <= this.numOfColumns; index++) {
				cellsInRow.push(rowName + 'c' + index);
			}

			cellsInRow.forEach(function(item) {
				var element = $('<div>').css({
					'padding' : '5px',
					'margin' : '0.5px',
					'border' : '1px solid rgb(170, 170, 170)'
				}).attr({
					'name' : item
				});

				controls.push({
					name : item,
					builder : function(context) {
						var properties = {
							template : 'create:' + element[0].outerHTML
						};

						var button = as.generics.button.builder(context, '*/' + rowName, properties);
						button.element.hover(function(event) {
							button.send('item:mouseenter', event);
						});

						return button;
					}
				});
			});
		}.bind(this));

		return controls;
	}

	Panel.prototype._selectCellRange_ = function(control) {
		var cell = control ? cast(control.name) : [ -1, -1 ];
		for (var rowIndex = 0; rowIndex <= this.numOfRows; rowIndex++) {
			for (var colIndex = 0; colIndex <= this.numOfColumns; colIndex++) {
				var condition = (rowIndex <= cell[0]) && (colIndex <= cell[1]);
				this.getItem(cast([ rowIndex, colIndex ])).element.toggleClass('table-cell-selected', condition);

				this.controls['caption'].setValue(cell.map(function(item) {
					return (parseInt(item) + 1)
				}).join(' &#x2715 '));
			}
		}
	}

	Panel.prototype.on = function(control, eventType, data) {
		if ([ 'item:selected' ].includes(eventType) && (control.context === this)) {
			this.send(eventType, data);
			return false;
		}
		if ([ 'item:mouseenter' ].includes(eventType) && (control.context === this.controls['content'])) {
			this._selectCellRange_(control);
			return false;
		}

		return Class.prototype.on.call(this, control, eventType, data);
	}

	Panel.prototype.getItem = function(value) {
		return this.controls['content'].getItem(value);
	}

	Panel.prototype.setValue = function(value) {
		this.controls['content'].setValue(cast(value));
		return this;
	}

	Panel.prototype.getValue = function(value) {
		return cast(this.controls['content'].getValue(value));
	}

	Panel.prototype.executeCommand = function() {
		var activeCell = this.getValue().map(function(item) {
			return (parseInt(item) + 1)
		});

		this.command.execute({
			rows : activeCell[0],
			columns : activeCell[1]
		});
	}

	Panel.prototype.init = function(command) {
		this.command = command;

		this.numOfRows = this.numOfColumns = 9;
		this.controls['content'].setContent(this._cellBuilders_()).element.on({
			'mouseleave' : function(event) {
				this._selectCellRange_();
			}.bind(this)
		});
		this._selectCellRange_();

		// this.command.editor.editing.view.document.on('mousedown', function(eventInfo, domEventData) {
		// var rootElement = domEventData.target.findAncestor(function(element) {
		// return element.is('table');
		// });
		// console.log('document', this.command.editor.editing.view.document);
		// console.log('rootElement', rootElement);
		// // this.command.editor.editing.model.change(function(writer) {
		// // writer.setAttribute('name', 'test', domEventData.target);
		// // });
		// }.bind(this));

		return this;
	}

	return Panel;
});