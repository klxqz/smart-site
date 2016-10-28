function delayedLoading() {
    function callbackCss(load) {
        console.log(load.type + ' css: ' + load.target.href);
    }
    if (window.delayCss.length) {
        var df = document.createDocumentFragment();
        for (var i in window.delayCss) {
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = window.delayCss[i];
            df.appendChild(link);
        }
        document.getElementsByTagName('head')[0].appendChild(df);
    }


    var loadedCount = 0;
    function evalJsFunction() {
        for (var i in window.delayJsFunctions) {
            try {
                if (typeof window.delayJsFunctions[i] == 'string') {
                    $.globalEval(window.delayJsFunctions[i]);
                } else if (typeof window.delayJsFunctions[i] == 'function') {
                    window.delayJsFunctions[i]();
                }
            } catch (e) {
                console.log(e);
            }
        }
        $('#loading-container').hide();
        $('#menu.navbar').show();
        $('#container').css('visibility', 'visible');
        if (img_lazyload) {
            $('img[data-original],div[data-original]').lazyload({
                effect: "fadeIn"
            });
        }
    }
    function callbackJs(load) {
        console.log(load.type + 'js: ' + load.target.src);
        loadedCount++;
        if (loadedCount == window.delayJs.length) {
            // все скрипты загружены, переходим к выполнению JS
            evalJsFunction();
            $(document).trigger('js_loaded');
        }
    }

    if (window.delayJs.length) {
        for (var i in window.delayJs) {
            var js = document.createElement("script");
            if (js.readyState && !js.onload) {
                /*IE, Opera*/
                js.onreadystatechange = function () {
                    if (js.readyState == "loaded" || js.readyState == "complete") {
                        js.onreadystatechange = null;
                        callbackJs();
                    }
                }
                js.onerror = function () {
                    callbackJs();
                }
            }
            else {
                js.onload = callbackJs;
                js.onerror = callbackJs;
            }
            js.type = "text/javascript";
            js.src = window.delayJs[i];
            /*js.async = true;*/
            document.getElementsByTagName("head")[0].appendChild(js);
        }
    } else {
        evalJsFunction();
    }
}