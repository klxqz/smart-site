function delayedLoading() {


    var loadedCount = 0;
    function callbackCss(load) {
        console.log(load.type + ': ' + load.target.href);
        loadedCount++;
        if (loadedCount == window.delayCss.length) {
            $('#loading-container').hide();
            $('#menu.navbar').show();
            $('#container').css('visibility', 'visible');
            if (img_lazyload) {
                $('img[data-original],div[data-original]').lazyload({
                    effect: "fadeIn"
                });
            }
        }
    }

    if (window.delayCss.length) {

        var df = document.createDocumentFragment();
        for (var i in window.delayCss) {
            var link = document.createElement("link");
            if (link.readyState && !link.onload) {
                /*IE, Opera*/
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
        document.getElementsByTagName('head')[0].appendChild(df);
    }
}