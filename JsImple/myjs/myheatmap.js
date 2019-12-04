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


function test(){
  // pathGraph.onEdgeDisabled(func);
  //
  persons.forEach(function(person){
    person.addTo(map);
    person.redirect(scene);
  });

  persons.forEach(function(person){
    person.run(scene);
  });
}

// ********************************************************

var mapClick = function(e){
  console.log(e);
}

// Called at the page's initialization
function onPageLoad(){
  map = L.map('mymap',{
    preferCanvas: true,
    //crs: L.CRS.EPSG3857,
    center: [39.89, 116.35],
    maxZoom: 18,
    zoom: 11
  });

  map.on("click",mapClick);

  L.supermap.tiledMapLayer(url).addTo(map);

  scene.draw(map);
  scene.addClickOnNode();
  scene.addClickOnEdge();

  test();
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
