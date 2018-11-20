define([], function() {
	"use strict";

	return {
		root : {
			error : {
				'202' : {
					header : 'Сообщение базы данных',
					'03.01' : 'Невозможно переместить ветвь внутрь самой себя.'
				},
				'401' : {
					header : 'Сообщение сервера',
					'00' : 'Ошибка авторизации. Пожалуйста, авторизуйтесь снова.'
				},
				'404' : {
					header : 'Сообщение браузера',
					'00' : 'Нет связи с сервером.'
				},
				'500' : {
					header : 'Сообщение сервера',
					'00' : 'Внутренняя ошибка сервера.'
				},
				'000' : {
					header : 'Сообщение браузера',
					'00' : 'еееееееееееееееееее'
				}
			},

			/*
			 * ------------- MAIN MENU --------------
			 */
			mainmenu : {
				login : 'Войти',
				loginform : {
					title : 'Авторизация',
					username : 'Логин:',
					password : 'Пароль:'
				},
				logout : 'Выйти'
			},

			/*
			 * ------------- SIDE MENU --------------
			 */
			sidemenu : {
				users : 'Пользователи',
				dumpDb : 'Создать архив'
			},

			/*
			 * ------------- USERS --------------
			 */
			users : {
				name : 'Пользователи',
				table : {
					firstName : 'Имя',
					lastName : 'Фамилия',
					username : 'Логин',
					roleText : 'Роль'
				},
				editForm : {
					firstName : 'Имя:',
					lastName : 'Фамилия:',
					username : 'Логин:',
					password : 'Пароль:',
					role : 'Роль:'
				}
			},

			/*
			 * ------------- DOCS --------------
			 */
			docs : {
				name : '',
				editForm : {
					code : 'Код:',
					name : 'Текст:'
				},
				selectForm : {
					position : {
						text : 'Выберите расположение для перемещаемой ветви ',
						labels : {
							inside : 'внутрь ',
							before : 'перед '
						}
					}
				},
			},

			/*
			 * ------------- DOC CONTENT --------------
			 */
			ckEditor : {
				edit : 'Редактировать',
				submit : 'Сохранить'
			}
		}
	};
});