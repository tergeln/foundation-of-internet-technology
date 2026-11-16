// RSS-ийн хаяг. ikon.mn хаавал (CORS) rss.xml хуулбарыг уншина
var RSS_URL = "https://ikon.mn/rss";
var LOCAL_RSS = "rss.xml";

// XMLHttpRequest ашиглан XML татах
function getXML(url, success, fail) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onload = function () {
        if (xhr.status == 200) {
            var xml = xhr.responseXML;
            if (!xml) {
                xml = new DOMParser().parseFromString(xhr.responseText, "text/xml");
            }
            success(xml);
        } else {
            fail();
        }
    };
    xhr.onerror = fail;
    xhr.send();
}

// Мэдээнүүдийг массив болгож callback руу өгнө
function loadNews(callback) {
    getXML(RSS_URL, function (xml) {
        callback(readItems(xml));
    }, function () {
        getXML(LOCAL_RSS, function (xml) {
            callback(readItems(xml));
        }, function () {
            callback([]);
        });
    });
}

function readItems(xml) {
    var items = xml.getElementsByTagName("item");
    var news = [];

    for (var i = 0; i < items.length; i++) {
        news.push({
            title: items[i].getElementsByTagName("title")[0].textContent,
            description: items[i].getElementsByTagName("description")[0].textContent,
            date: items[i].getElementsByTagName("pubDate")[0].textContent,
            link: items[i].getElementsByTagName("link")[0].textContent
        });
    }
    return news;
}

// "December 19, 2024 at 11:41 AM" хэлбэрийн огноо
function formatDate(text) {
    return new Date(text).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" });
}

// HTML-ээс зөвхөн текстийг нь авах
function getText(html) {
    var div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent.trim();
}
