define(['as', '../FR'], function(as, FR) {
	"use strict";

	/*
	 * ------------- EXCEL FILE READER ABSTRACT CLASS --------------
	 */
	function ExcelFR() {
		FR.call(this);
	}
	ExcelFR.prototype = Object.create(FR.prototype);
	ExcelFR.prototype.constructor = ExcelFR;

	ExcelFR.prototype.parse = function(attributes) {
		return attributes;
	}

	ExcelFR.prototype.getData = function(file, sheetName) {
		var requestParams = {
			method: 'readAsBinaryString',
			file: file
		};

		return this.fetch(requestParams).execute(function(response) {
			var workbook = XLSX.read(response, {
				type: 'binary'
			}), worksheet = workbook.Sheets[sheetName];

			if (worksheet) {
				return {
					workbook: workbook,
					status: 'xlsSuccess',
					result: XLSX.utils.sheet_to_row_object_array(worksheet).map(function(item) {
						return this.parse(item);
					}.bind(this))
				};
			} else {
				return {
					workbook: workbook,
					status: 'xlsError',
					code: 'noWorksheet'
				};
			}
		}.bind(this));
	}

	return ExcelFR;
});