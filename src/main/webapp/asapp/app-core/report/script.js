function toNumber(string) {
	return (string !== undefined) ? parseFloat(('' + string).replace(',', '.').replace(/\s/g, '')) : null;
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

	return (date !== undefined) ? new Date(date).toLocaleDateString(undefined, options) : null;
}

document.querySelectorAll('td[data-type]').forEach(function(item) {
	if (item.innerHTML) {
		switch (item.getAttribute('data-type')) {
		case 'number':
			item.innerHTML = toNumber(item.innerHTML).toLocaleString(undefined, {});
			break;
		case 'currency':
			item.innerHTML = toNumber(item.innerHTML).toLocaleString(undefined, {
				minimumFractionDigits : 2,
				maximumFractionDigits : 2
			});
			break;
		case 'date':
			item.innerHTML = toLocaleDateString(item.innerHTML);
			break;
		}
	}
});