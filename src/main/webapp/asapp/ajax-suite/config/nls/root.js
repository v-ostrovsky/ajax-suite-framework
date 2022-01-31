define([], function() {
	"use strict";

	function composeText() {
		var args = [].slice.call(arguments), layout = args[0], params = args.slice(1);

		var text = '';
		layout.split('{}').forEach(function(item, index) {
			if (params[index] || (params[index] === '') || (params[index] === 0)) {
				text += item + params[index];
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
		return (string !== undefined) ? parseFloat(('' + string).replace(',', '.').replace(/\s/g, '')) : null;
	}

	function toLocaleDateString(date, isLong) {
		var options = {
			year: '2-digit',
			month: 'numeric',
			day: 'numeric'
		};

		if (isLong) {
			options = Object.assign(options, {
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric'
			})
		}

		return date ? new Date(date).toLocaleDateString('ru-RU', options) : null;
	}

	function pad(num) {
		var s = "0" + num;
		return s.substr(s.length - 2);
	}

	function toDbDate(date, type) {
		if (date) {
			var dbDate = [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join('-');
			if (['datetime'].includes(type)) {
				dbDate += 'T' + [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join(':');
			}

			return dbDate;
		}

		return null;
	}

	function fromDbDate(dbDate) {
		if (dbDate) {
			if (dbDate.length === 3) {
				return new Date(dbDate[0], dbDate[1] - 1, dbDate[2]);
			} else {
				return new Date(dbDate[0], dbDate[1] - 1, dbDate[2], dbDate[3] || 0, dbDate[4] || 0, dbDate[5] || 0);
			}
		}

		return null;
	}

	function localeCompare(type, a, b) {
		type = (type || 'string').charAt(0);

		if (['c'].includes(type)) {
			var arrA = ('0.' + a).split(".");
			var arrB = ('0.' + b).split(".");
			for (var i = 0; i < Math.max(arrA.length - 1, arrB.length - 1); i++) {
				var itemA = (i < arrA.length) ? parseInt(arrA[i]) : 0;
				var itemB = (i < arrB.length) ? parseInt(arrB[i]) : 0;
				var comparison = itemA - itemB;
				if (comparison != 0) {
					return Math.sign(comparison);
				}
			}
			return 0;
		}
		if (['s'].includes(type)) {
			return String(a).localeCompare(String(b), undefined, {
				sensitivity: 'base'
			});
		}
		if (['n'].includes(type)) {
			return Math.sign(a - b);
		}
		if (['d'].includes(type)) {
			var timeA = a ? a.getTime() : 0, timeB = b ? b.getTime() : 0;
			return Math.sign(timeA - timeB);
		}

		return 0;
	}

	function formatter(typeOfValue, value) {
		if (value !== undefined && value !== null && !(value === '')) {
			if (['n'].includes(typeOfValue.charAt(0))) {
				// number
				if (typeof value === 'number') {
					var fractionDigits = typeOfValue.match(/\(([^)]+)\)/)[1];
					return toNumber(value).toLocaleString(undefined, {
						minimumFractionDigits: fractionDigits || 0,
						maximumFractionDigits: fractionDigits || 0
					});
				}
				if (typeof value === 'string') {
					return toNumber(value);
				}
			} else if (['d'].includes(typeOfValue.charAt(0))) {
				// date
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
			} else if (['m'].includes(typeOfValue.charAt(0))) {
				// month
				var monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
				var aValue = value.split('.');

				return monthNames[toNumber(aValue[1]) - 1] + ' ' + aValue[0];
			} else if (['percent'].includes(typeOfValue)) {
				// percent
				if (typeof value === 'number') {
					return toNumber(value * 100).toLocaleString(undefined, {}) + '%';
				}
				if (typeof value === 'string') {
					return toNumber(value.split('%')[0]) / 100;
				}
			} else if (['phone'].includes(typeOfValue)) {
				// phone
				var aValue = value.split('');

				if (aValue[0].concat(aValue[1]) === '+7') {
					return aValue[4] + aValue[5] + aValue[6] + aValue[9] + aValue[10] + aValue[11] + aValue[13] + aValue[14] + aValue[16] + aValue[17];
				} else {
					return '+7 (' + aValue[0] + aValue[1] + aValue[2] + ') ' + aValue[3] + aValue[4] + aValue[5] + '-' + aValue[6] + aValue[7] + '-' + aValue[8] + aValue[9];
				}
			}
		}
		return value || '';
	}

	function msoFormatter(typeOfValue, value) {
		if (['n'].includes(typeOfValue.charAt(0))) {
			var fractionDigits = parseInt(typeOfValue.match(/\(([^)]+)\)/)[1]);
			return {
				format: '\#\,\#\#0' + ((fractionDigits) ? ('\.' + '0'.repeat(fractionDigits)) : ''),
				value: (value || 0).toFixed(fractionDigits).replace('.', ',')
			};
		}
		if (['d'].includes(typeOfValue.charAt(0))) {
			return {
				format: 'dd.mm.yy',
				value: value.toLocaleDateString()
			};
		}
		if (['t'].includes(typeOfValue.charAt(0))) {
			return {
				format: 'dd.mm.yy hh:mm:ss',
				value: value.toLocaleDateString() + ' ' + value.toLocaleTimeString()
			};
		}

		return {
			format: '@',
			value: value
		};
	}

	function inputMaskBuilder(typeOfField, field) {
		var mask = {
			date: '99.99.99',
			month: '9999.99',
			phone: '+7 (999) 999-99-99'
		}

		field.element.inputmask({
			mask: mask[typeOfField],
			positionCaretOnTab: false,
			insertMode: false
		});
	}

	return {
		root: {
			/*
			 * ------------- FUNCTIONS --------------
			 */
			composeText: composeText,
			getFieldValue: getFieldValue,
			toDbDate: toDbDate,
			fromDbDate: fromDbDate,
			toLocaleDateString: toLocaleDateString,
			localeCompare: localeCompare,
			formatter: formatter,
			msoFormatter: msoFormatter,
			inputMaskBuilder: inputMaskBuilder,

			/*
			 * ------------- CONNECTION MESSAGE --------------
			 */
			message: {
				'400': {
					header: 'Сообщение сервера',
					'default': 'Операция запрещена'
				},
				'401': {
					header: 'Сообщение сервера',
					'default': 'Логин или пароль неверны.<br>Пожалуйста, попробуйте еще раз.'
				},
				'403': {
					header: 'Сообщение сервера',
					'default': 'Время авторизации истекло.<br>Пожалуйста, авторизуйтесь снова.'
				},
				'404': {
					header: 'Сообщение браузера',
					'default': 'Нет связи с сервером'
				},
				'500': {
					header: 'Сообщение сервера',
					'default': 'Внутренняя ошибка сервера'
				},
				'timeout': {
					header: 'Сообщение браузера',
					'default': 'Превышено время ожидания ответа от сервера.<br>Пожалуйста, попробуйте выполнить последнее действие еще раз.'
				},
				'unknown': {
					header: 'Сообщение браузера',
					'default': 'Ошибка соединения с сервером.'
				},
				'idbSuccess': {
					header: 'Сообщение IndexedDB',
					'default': 'Описание события отсутствует',
					'isUpgraded': 'Создана база данных IndexedDB',
					'isDeleted': 'База данных IndexedDB удалена'
				},
				'idbError': {
					header: 'Сообщение IndexedDB',
					'default': 'Описание ошибки отсутствует',
					'20': 'Отсутствует база данных IndexedDB',
					'notUpgraded': 'База данных IndexedDB уже существует'
				},
				'xlsError': {
					header: 'Сообщение MS Excel',
					'default': 'Описание ошибки отсутствует',
					'noWorksheet': 'В файле "{}" отсутствует лист "{}"'
				},
				'frError': {
					header: 'Сообщение FileReader',
					'default': 'Описание ошибки отсутствует',
					'wrongFileType': function(args) {
						return 'Файл "' + args.slice(1).join('.') + '" имеет неверный тип'
					},
					'wrongFileContent': function(args) {
						return 'Содержимое файла "' + args.slice(1).join('.') + '" имеет неверный формат'
					},
					'emptyFileContent': function(args) {
						return 'Файл "' + args.slice(1).join('.') + '" не содержит записей'
					}
				}
			},

			/*
			 * ------------- COMMON --------------
			 */

			table: {
				summaryText: 'Итого:'
			},

			form: {
				titleMessage: 'Сообщение',
				titleCreate: 'Создание',
				titleCopy: 'Копирование',
				titleEdit: 'Редактирование',
				titleSelect: 'Перемещение',
				titleRemove: 'Удаление',
				titleWarn: 'Предупреждение',
				submit: 'OK',
				cancel: 'Отмена',
				yes: 'Да',
				no: 'Нет'
			},
			frmRemove: {
				message: 'Вы уверены, что хотите удалить запись '
			},
			frmBranchRemove: {
				message: 'Вы уверены, что хотите удалить ветвь '
			},
			contextmenu: {
				create: {
					text: 'Создать…'
				},
				copy: {
					text: 'Дублировать…'
				},
				edit: {
					text: 'Редактировать…'
				},
				remove: {
					text: 'Удалить'
				},
				moveBranch: {
					text: 'Переместить ветвь…'
				},
				removeBranch: {
					text: 'Удалить ветвь'
				},
				copyData: {
					text: 'Копировать данные',
					hotkey: 'Alt+C'
				},
				copyTable: {
					text: 'Копировать как таблицу',
					hotkey: 'Alt+Shift+C'
				}
			},
			tooltip: {
				create: {
					text: 'Создать…'
				},
				copy: {
					text: 'Дублировать…'
				},
				edit: {
					text: 'Редактировать…'
				},
				remove: {
					text: 'Удалить'
				},
				moveBranch: {
					text: 'Переместить ветвь…'
				},
				removeBranch: {
					text: 'Удалить ветвь'
				},
				expandDown: {
					text: 'Раскрыть выделенную ветвь полностью'
				},
				collapseDown: {
					text: 'Свернуть выделенную ветвь полностью'
				}
			},
			view: {
				create: 'Создать',
				copy: 'Дублировать',
				edit: 'Редактировать',
				remove: 'Удалить'
			}
		}
	};
});