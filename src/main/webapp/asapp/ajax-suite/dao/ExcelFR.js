define([ 'rear/FR', 'i18n!nls/root' ], function(FR, locale) {
	"use strict";

	/*
	 * ------------- EXCEL FILE READER ABSTRACT CLASS --------------
	 */
	function ExcelFR(application) {
		FR.call(this);

		this.application = application;
	}
	ExcelFR.prototype = Object.create(FR.prototype);
	ExcelFR.prototype.constructor = ExcelFR;

	ExcelFR.prototype.parse = function(attributes) {
		return attributes;
	}

	ExcelFR.prototype.processData = function(file, sheetName, handler) {
		var requestParams = {
			method : 'readAsBinaryString',
			file : file
		};

		return this.fetch(requestParams).execute(function(response) {
			var workbook = XLSX.read(response, {
				type : 'binary'
			}), worksheet = workbook.Sheets[sheetName];

			if (!worksheet) {
				this.application.showDialog(locale.error['excelFR'].header, locale.error['excelFR'].text + '"' + sheetName + '"', null);
				return null;
			}

			var data = XLSX.utils.sheet_to_row_object_array(worksheet);

			data = data.map(function(item) {
				return this.parse(item);
			}.bind(this));

			var toWrite = handler(data);

			if (toWrite) {
				XLSX.utils.sheet_add_aoa(worksheet, toWrite.data, {
					origin : toWrite.origin
				});

				XLSX.writeFile(workbook, file.name);
			}
		}.bind(this));
	}

	return ExcelFR;
});