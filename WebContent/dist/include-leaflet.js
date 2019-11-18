(function () {
    var r = new RegExp("(^|(.*?\\/))(include-leaflet\.js)(\\?|$)"),
        s = document.getElementsByTagName('script'), targetScript;
    for (var i = 0; i < s.length; i++) {
        var src = s[i].getAttribute('src');
        if (src) {
            var m = src.match(r);
            if (m) {
                targetScript = s[i];
                break;
            }
        }
    }

    function inputScript(url) {
        var script = '<script type="text/javascript" src="' + url + '"><' + '/script>';
        document.writeln(script);
    }

    function inputCSS(url) {
        var css = '<link rel="stylesheet" href="' + url + '">';
        document.writeln(css);
    }

    function inArray(arr, item) {
        for (i in arr) {
            if (arr[i] == item) {
                return true;
            }
        }
        return false;
    }

    //加载类库资源文件
    function load() {
        var includes = (targetScript.getAttribute('include') || "").split(",");
        var excludes = (targetScript.getAttribute('exclude') || "").split(",");
        if (!inArray(excludes, 'leaflet')) {
            inputCSS("libs/leaflet/leaflet.css");
            inputScript("libs/leaflet/leaflet.js");
        }
        if (inArray(includes, 'mapv')) {
            inputScript("libs/mapv/mapv.min.js");
        }
        if (inArray(includes, 'turf')) {
            inputScript("libs/turf/turf.min.js");
        }
        if (inArray(includes, 'echarts')) {
            inputScript("libs/echarts/echarts.min.js");
        }
        if (inArray(includes, 'elasticsearch')) {
            inputScript("libs/elasticsearch/elasticsearch.min.js");
        }
        if (!inArray(excludes, 'iclient9-leaflet')) {
            inputScript("dist/iclient9-leaflet.min.js");
        }
        if (inArray(includes, 'iclient9-leaflet-css')) {
            inputCSS("dist/iclient9-leaflet.min.css");
        }
        if (inArray(includes, 'leaflet.heat')) {
            inputScript("libs/leaflet/plugins/leaflet.heat/leaflet-heat.js");
        }
        if (inArray(includes, 'osmbuildings')) {
            inputScript("libs/osmbuildings/OSMBuildings-Leaflet.js");
        }
        if (inArray(includes, 'leaflet.markercluster')) {
            inputCSS("libs/leaflet/plugins/leaflet.markercluster/MarkerCluster.Default.css");
            inputCSS("libs/leaflet/plugins/leaflet.markercluster/MarkerCluster.css");
            inputScript("libs/leaflet/plugins/leaflet.markercluster/leaflet.markercluster.js");
        }
        if (inArray(includes, 'leaflet-icon-pulse')) {
            inputCSS("libs/leaflet/plugins/leaflet-icon-pulse/L.Icon.Pulse.css");
            inputScript("libs/leaflet/plugins/leaflet-icon-pulse/L.Icon.Pulse.js");
        }
        if (inArray(includes, 'leaflet.draw')) {
            inputCSS("libs/leaflet/plugins/leaflet.draw/0.4.9/leaflet.draw.css");
            inputScript("libs/leaflet/plugins/leaflet.draw/0.4.9/leaflet.draw.js");
        }
        if (inArray(includes, 'leaflet.pm')) {
            inputCSS("libs/leaflet/plugins/leaflet.pm/0.16.0/leaflet.pm.min.css");
            inputScript("libs/leaflet/plugins/leaflet.pm/0.16.0/leaflet.pm.min.js");
        }
    }

    load();
    window.isLocal = true;
})();
