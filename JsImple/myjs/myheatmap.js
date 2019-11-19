//*************************************************************************************
// TODO: Retrive the model from iserver
// TODO: Retrive point data from database
//*************************************************************************************

// Host address
var host = "http://support.supermap.com.cn:8090";
// Url of our model
var url = host+"/iserver/services/map-china400/rest/maps/China";
// Container of all layers
var map;
// Heatmap layer
var resultLayer;
// Interval between two updates. By default, 1000 milliseconds
var fixedTime = 1000;

var mapClick = function(e){
  console.log(e.latlng);
}

// Called at the page's initialization
function onPageLoad(){
  map = L.map('mymap',{
    preferCanvas: true,
    center: [39.89, 116.35],
    maxZoom: 18,
    zoom: 11
  });

  map.on("click",mapClick);

  L.supermap.tiledMapLayer(url).addTo(map);
  houses.forEach(function(house){
    var polygon = L.polygon(house.geometry.coordinates,{
      "color": "#ff0000",
      "weight": 2,
      "opacity": 1.0
    }).addTo(map);

    var points = [];
    for(var i = 0;i<100;i++){
      points[i] = randomPointInPoly(polygon);
    }

    loadHeatMap(points);
  });
}

// Update the heatmap per 1 second
function animateHeatMap(){
    setInterval("loadHeatMap()",fixedTime);
}

// Render a heatmap using random-generated points
function loadHeatMap(heatPoints) {
  if(resultLayer!=null) map.removeLayer(resultLayer);

  resultLayer = L.heatLayer(heatPoints, {
      radius: 20,
      minOpacity: 0.5
  }).addTo(map);
}
