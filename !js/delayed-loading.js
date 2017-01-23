var loadedCount = 0;
function callbackCss(load) {
    loadedCount++;
    if (loadedCount == window.delayCss.length) {
        $('#minimum-head-style').remove();
        $('#loading-container').hide();
        $('#menu.navbar').show();
        $('#container').css('visibility', 'visible');
    }
}

if (window.delayCss.length) {

    var df = document.createDocumentFragment();
    for (var i in window.delayCss) {
        var link = document.createElement("link");
        if (link.readyState && !link.onload) {
            js.onreadystatechange = function () {
                if (link.readyState == "loaded" || link.readyState == "complete") {
                    link.onreadystatechange = null;
                    callbackCss();
                }
            }
            link.onerror = function () {
                callbackCss();
            }
        }
        else {
            link.onload = callbackCss;
            link.onerror = callbackCss;
        }
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = window.delayCss[i];
        df.appendChild(link);
    }
    var head = document.getElementsByTagName("head")[0].firstChild;
    document.getElementsByTagName("head")[0].insertBefore(df, head);
}