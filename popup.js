// call this when the document is completely loaded.
document.addEventListener('DOMContentLoaded', function() {
	callGitHub();
});

// main call to GitHub
function callGitHub() {
	var div_content = document.getElementById('div_content');
	var url = 'http://api.github.com/repos/clesquir/js-volemon/commits';
	var xmlhttp = new XMLHttpRequest();

	div_content.innerHTML = '<img src="http://www.wrung.fr/themes/jakiro/img/kr_loader.gif">';

	// if readyState is ok, let's parse it's content
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var array = JSON.parse(this.responseText);
			parseGitHub(array);
		}
	};

	xmlhttp.open("GET", url, true);
	xmlhttp.send();

}

// here we parse GitHub's answer
function parseGitHub(array) {
	var out = "";
	var i, title, date, url;
	var div_content = document.getElementById('div_content');
	var last_url = array[0].commit.url;

	out += '<div class="cards-list">';

	// building the output...
	for (i = 0; i < array.length; i++) {
		title = array[i].commit.message.replace(/\n/g, '<br />');
		date = new Date(array[i].commit.author.date);

		var padDatePart = function(datePart) {
			if (datePart < 10) {
				datePart = '0' + datePart;
			}

			return datePart;
		};

		var year = date.getFullYear();
		var month = padDatePart(date.getMonth() + 1);
		var day = padDatePart(date.getDate());

		out += '<div class="card">' +
			'<div class="card-date">' +
			date.getFullYear() + '-' + padDatePart(date.getMonth() + 1) + '-' + padDatePart(date.getDate()) + ' ' +
			padDatePart(date.getHours()) + ':' + padDatePart(date.getMinutes()) +
			'</div>' +
			'<div class="card-title">' + title + '</div>' +
			'</div>';
	}

	out += '</div>';

	// ... and display it.
	div_content.innerHTML = out;

	// saving the last viewed URL to help the background process
	localStorage["volemon-last-url"] = last_url;

	// reset the badge counter
	chrome.browserAction.setBadgeText({text: ''});
}
