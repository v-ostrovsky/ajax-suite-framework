define([], function() {
	"use strict";

	function composeText() {
		var args = [].slice.call(arguments), layout = args[0], params = args.slice(1);

		var text = '';
		layout.split('{}').forEach(function(item, index) {
			if (params[index] != undefined) {
				text += item + (params[index] || '');
			}
		});

		return text;
	}

	function getFieldValue(array, id, fieldName) {
		if (!id) {
			return null;
		}

		return array.find(function(item) {
			return item.id === id;
		})[fieldName || 'textId'];
	}

	function toNumber(string) {
		return (string != undefined) ? parseFloat(('' + string).replace(',', '.').replace(/\s/g, '')) : null;
	}

	function toLocaleDateString(date, isLong) {
		var options = {
			year : '2-digit',
			month : 'numeric',
			day : 'numeric'
		};

		if (isLong) {
			options = Object.assign(options, {
				hour : 'numeric',
				minute : 'numeric',
				second : 'numeric'
			})
		}

		return (date != undefined) ? new Date(date).toLocaleDateString(undefined, options) : null;
	}

	function pad(num) {
		var s = "0" + num;
		return s.substr(s.length - 2);
	}

	function toDbDate(date) {
		if (date) {
			return [ date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate()) ].join('-');
		}

		return null;
	}

	function fromDbDate(dbDate) {
		if (dbDate) {
			if (dbDate.length === 6) {
				return new Date(dbDate[0], dbDate[1] - 1, dbDate[2], dbDate[3], dbDate[4], dbDate[5]);
			} else {
				return new Date(dbDate[0], dbDate[1] - 1, dbDate[2]);
			}
		}

		return null;
	}

	function localeCompare(type, a, b) {
		type = (type || 'string').charAt(0);

		if ([ 's' ].includes(type)) {
			return String(a).localeCompare(String(b), undefined, {
				sensitivity : 'base'
			});
		}
		if ([ 'n' ].includes(type)) {
			return Math.sign(a - b);
		}
		if ([ 'd' ].includes(type)) {
			return Math.sign(a.getTime() - b.getTime());
		}

		return 0;
	}

	function formatter(typeOfValue, value) {
		if (value != undefined && value != null && !(value === '')) {
			// number
			if ([ 'n' ].includes(typeOfValue.charAt(0))) {
				if (typeof value === 'number') {
					var fractionDigits = typeOfValue.match(/\(([^)]+)\)/)[1];
					return toNumber(value).toLocaleString(undefined, {
						minimumFractionDigits : fractionDigits || 0,
						maximumFractionDigits : fractionDigits || 0
					});
				}
				if (typeof value === 'string') {
					return toNumber(value);
				}
			}
			// percent
			if ([ 'p' ].includes(typeOfValue.charAt(0))) {
				if (typeof value === 'number') {
					return toNumber(value * 100).toLocaleString(undefined, {}) + '%';
				}
				if (typeof value === 'string') {
					return toNumber(value.split('%')[0]) / 100;
				}
			}
			// date
			if ([ 'd' ].includes(typeOfValue.charAt(0))) {
				if (typeof value === 'object') {
					var array = typeOfValue.match(/\(([^)]+)\)/), isLong = (array && array[1] === 'long') ? true : false;
					return toLocaleDateString(value, isLong);
				}
				if (typeof value === 'string' && value.indexOf('.')) {
					var array = value.split(/\D+/);
					if (array[0].length === 2 && array[1].length === 2 && (array[2].length === 2 || array[2].length === 4)) {
						var date = new Date(parseInt(array[2]), parseInt(array[1]) - 1, parseInt(array[0]));
						date.setFullYear(((array[2].length === 2) ? '20' : '') + array[2]);
						return date;
					}
				}
			}
			// month
			if ([ 'm' ].includes(typeOfValue.charAt(0))) {
				var monthNames = [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ];
				var aValue = value.split('.');

				return monthNames[toNumber(aValue[1]) - 1] + ' ' + aValue[0];
			}
		}
		return value || '';
	}

	function msoFormatter(typeOfValue) {
		if ([ 'n' ].includes(typeOfValue.charAt(0))) {
			var fractionDigits = parseInt(typeOfValue.match(/\(([^)]+)\)/)[1]);
			return '\#\,\#\#0' + ((fractionDigits) ? ('\.' + '0'.repeat(fractionDigits)) : '');
		}
		if ([ 'd' ].includes(typeOfValue.charAt(0))) {
			return 'dd.mm.yy';
		}

		return '@';
	}

	function inputMaskBuilder(field) {
		field.element.inputmask({
			mask : '99.99.99',
			positionCaretOnTab : false,
			insertMode : false
		});
	}

	return {
		root : {
			/*
			 * ------------- FUNCTIONS --------------
			 */
			composeText : composeText,
			getFieldValue : getFieldValue,
			toDbDate : toDbDate,
			fromDbDate : fromDbDate,
			toLocaleDateString : toLocaleDateString,
			localeCompare : localeCompare,
			formatter : formatter,
			msoFormatter : msoFormatter,
			inputMaskBuilder : inputMaskBuilder,

			/*
			 * ------------- ERRORS --------------
			 */
			table : {
				summaryText : 'Итого:'
			},

			form : {
				titleMessage : 'Сообщение',
				titleCreate : 'Создание',
				titleCopy : 'Копирование',
				titleEdit : 'Редактирование',
				titleSelect : 'Перемещение',
				titleRemove : 'Удаление',
				submit : 'OK',
				cancel : 'Отмена',
				yes : 'Да',
				no : 'Нет'
			},
			frmRemove : {
				message : 'Вы уверены, что хотите удалить запись '
			},
			frmBranchRemove : {
				message : 'Вы уверены, что хотите удалить ветвь '
			},
			contextmenu : {
				create : {
					text : 'Создать…'
				},
				copy : {
					text : 'Дублировать…'
				},
				edit : {
					text : 'Редактировать…'
				},
				remove : {
					text : 'Удалить'
				},
				moveBranch : {
					text : 'Переместить ветвь…'
				},
				removeBranch : {
					text : 'Удалить ветвь'
				},
				copyData : {
					text : 'Копировать данные',
					hotkey : 'Alt+C'
				},
				copyTable : {
					text : 'Копировать как таблицу',
					hotkey : 'Alt+Shift+C'
				}
			},
			tooltip : {
				create : {
					text : 'Создать…'
				},
				copy : {
					text : 'Дублировать…'
				},
				edit : {
					text : 'Редактировать…'
				},
				remove : {
					text : 'Удалить'
				},
				moveBranch : {
					text : 'Переместить ветвь…'
				},
				removeBranch : {
					text : 'Удалить ветвь'
				},
				refresh : {
					text : 'Обновить'
				},
				expandDown : {
					text : 'Раскрыть выделенную ветвь полностью'
				},
				collapseDown : {
					text : 'Свернуть выделенную ветвь полностью'
				}
			},
			view : {
				create : 'Создать',
				copy : 'Дублировать',
				edit : 'Редактировать',
				remove : 'Удалить'
			}
		}
	};
});