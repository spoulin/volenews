// main function called recursively to check new commits
function goGoGadget() {
    callGitHub();

    // check every 10 minutes
    setTimeout(goGoGadget, 60000);

}

// main call to GitHub
function callGitHub() {
    var url = 'http://api.github.com/repos/clesquir/js-volemon/commits';
    var xmlhttp = new XMLHttpRequest();

    chrome.browserAction.setBadgeText({text: '...'});

    // if readyState is ok, let's parse it's content
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var array = JSON.parse(this.responseText);
            parseGitHub(array);
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

// here we parse the GitHub's answer
function parseGitHub(array) {
    var last_url = localStorage["volemon-last-url"];
    var i;

    chrome.browserAction.setBadgeText({text: ''});

    // loop to find number of new commits since the last one viewed
    for (i = 0; i < array.length; i++) {
        if (last_url === array[i].commit.url) {
            break;
        }
    }

    // display the counter if needed
    if (i > 0) {
        chrome.browserAction.setBadgeText({text: i.toString()});
    }
}

// the beginning of everything, the easy way.
goGoGadget();