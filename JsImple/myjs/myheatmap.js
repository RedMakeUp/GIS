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

// For test
// ********************************************************
var func = function(v1,v2,hotArea){
  persons.forEach(function(person){
    var newStart;

    // Strategy One
    // Only one Exit
    // Move along current path as long as possible
    if(person.isInEdgeHotArea(hotArea)){
      newStart = person.loc.distanceTo(v1) < person.loc.distanceTo(v2) ? v1 : v2;
    }else if(person.isEdgeOnMyWay(v1,v2)){
      newStart = person.getcloserVertexOnMyWay(v1,v2);
    }

    if(newStart !== undefined){
      var newPath = findShortestPath(pathGraph,newStart,pathKeyPoints[0])
      person.updatePath(newStart, newPath);
    }
  })
};


function test(){
  // pathGraph.onEdgeDisabled(func);
  //
  persons.forEach(function(person){
    person.addTo(map);
    person.redirect(scene);
  });

  // TODO: EnterEdge and ExitEdge
  var personReached = function(person){
    console.log("Reached");

    // if(person.path.length >= 2){
    //   scene.exitEdge(person.lastEnterEdge[0],person.lastEnterEdge[1],this);
    //   var id1 = scene.getId(leafletPoint2LatLng(target));
    //   var id2 = scene.getId(leafletPoint2LatLng(person.path[1]));
    //   scene.enterEdge(id1,id2,this);
    //   this.lastEnterEdge = [id1,id2];
    // }

    person.path.shift();

    if(person.path.length > 0){
      person.moveTo({
        target: person.path[0],
        onReached: personReached
      });
    }
  }

  persons.forEach(function(person){
    person.moveTo({
      target: person.path[0],
      onReached: personReached
    });
  });

  // setInterval("movePerson()",200);

}
function movePerson() {
  persons.forEach(function(person){
    person.move(scene);
  });
  //
  // pathGraph.setSafeExitStyle(0, {fillColor: generateRandomByString()});
  // pathGraph.setSafeExitPopupContent(0, "" + pathGraph.calcPersonNumOfVertex(persons,pathKeyPoints[0],func));
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
