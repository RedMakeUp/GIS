// ****************************************************************
// Global data initialization
// ****************************************************************

// GeoJSON Format expects (longitude,latitude),
// but, here, leaflet expects (latitude,longitude)
var houses = [{
  "type": "Feature",
  "properties": {"name": "Teaching building 1"},
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [39.93,116.14],
      [39.93,116.16],
      [39.91,116.16],
      [39.91,116.19],
      [39.89,116.19],
      [39.89,116.14],
      [39.93,116.14]
    ]]
  }
}];

var pathKeyPoints = [
  createLatLng(39.85,116.13),// 0
  createLatLng(39.76,116.14),// 1
  createLatLng(39.83,116.23),// 2
  createLatLng(39.77,116.26),// 3
  createLatLng(39.85,116.30),// 4
  createLatLng(39.82,116.33),// 5
  createLatLng(39.85,116.36),// 6
  createLatLng(39.79,116.38),// 7
  createLatLng(39.81,116.42),// 8
  createLatLng(39.85,116.48),// 9
  createLatLng(39.80,116.61),// 10
  createLatLng(40.02,116.61),// 11
  createLatLng(40.05,116.55),// 12
  createLatLng(39.98,116.46),// 13
  createLatLng(39.94,116.39),// 14
  createLatLng(39.98,116.35),// 15
  createLatLng(39.94,116.33),// 16
  createLatLng(39.88,116.32),// 17
  createLatLng(39.92,116.27),// 18
  createLatLng(39.99,116.25),// 19
  createLatLng(39.85,116.20),// 20
  createLatLng(39.91,116.20),// 21
  createLatLng(39.93,116.13)// 22
];

// Add nodes
var scene = new Scene();
for(var i = 0; i < pathKeyPoints.length;i++){
  scene.addNode(pathKeyPoints[i]);
}
scene.addExit(scene.getId(pathKeyPoints[0]));
scene.addExit(scene.getId(pathKeyPoints[13]));
scene.addExit(scene.getId(pathKeyPoints[7]));

// Add edges
scene.addEdge(scene.getId(pathKeyPoints[0]), scene.getId(pathKeyPoints[1]));
scene.addEdge(scene.getId(pathKeyPoints[0]), scene.getId(pathKeyPoints[20]));
scene.addEdge(scene.getId(pathKeyPoints[0]), scene.getId(pathKeyPoints[22]));
scene.addEdge(scene.getId(pathKeyPoints[1]), scene.getId(pathKeyPoints[0]));
scene.addEdge(scene.getId(pathKeyPoints[1]), scene.getId(pathKeyPoints[3]));
scene.addEdge(scene.getId(pathKeyPoints[2]), scene.getId(pathKeyPoints[20]));
scene.addEdge(scene.getId(pathKeyPoints[2]), scene.getId(pathKeyPoints[3]));
scene.addEdge(scene.getId(pathKeyPoints[2]), scene.getId(pathKeyPoints[4]));
scene.addEdge(scene.getId(pathKeyPoints[2]), scene.getId(pathKeyPoints[18]));
scene.addEdge(scene.getId(pathKeyPoints[3]), scene.getId(pathKeyPoints[1]));
scene.addEdge(scene.getId(pathKeyPoints[3]), scene.getId(pathKeyPoints[2]));
scene.addEdge(scene.getId(pathKeyPoints[3]), scene.getId(pathKeyPoints[7]));
scene.addEdge(scene.getId(pathKeyPoints[4]), scene.getId(pathKeyPoints[2]));
scene.addEdge(scene.getId(pathKeyPoints[4]), scene.getId(pathKeyPoints[5]));
scene.addEdge(scene.getId(pathKeyPoints[4]), scene.getId(pathKeyPoints[17]));
scene.addEdge(scene.getId(pathKeyPoints[5]), scene.getId(pathKeyPoints[4]));
scene.addEdge(scene.getId(pathKeyPoints[5]), scene.getId(pathKeyPoints[6]));
scene.addEdge(scene.getId(pathKeyPoints[6]), scene.getId(pathKeyPoints[5]));
scene.addEdge(scene.getId(pathKeyPoints[6]), scene.getId(pathKeyPoints[17]));
scene.addEdge(scene.getId(pathKeyPoints[6]), scene.getId(pathKeyPoints[9]));
scene.addEdge(scene.getId(pathKeyPoints[6]), scene.getId(pathKeyPoints[8]));
scene.addEdge(scene.getId(pathKeyPoints[7]), scene.getId(pathKeyPoints[3]));
scene.addEdge(scene.getId(pathKeyPoints[7]), scene.getId(pathKeyPoints[8]));
scene.addEdge(scene.getId(pathKeyPoints[8]), scene.getId(pathKeyPoints[7]));
scene.addEdge(scene.getId(pathKeyPoints[8]), scene.getId(pathKeyPoints[6]));
scene.addEdge(scene.getId(pathKeyPoints[8]), scene.getId(pathKeyPoints[10]));
scene.addEdge(scene.getId(pathKeyPoints[9]), scene.getId(pathKeyPoints[6]));
scene.addEdge(scene.getId(pathKeyPoints[9]), scene.getId(pathKeyPoints[10]));
scene.addEdge(scene.getId(pathKeyPoints[9]), scene.getId(pathKeyPoints[13]));
scene.addEdge(scene.getId(pathKeyPoints[10]), scene.getId(pathKeyPoints[8]));
scene.addEdge(scene.getId(pathKeyPoints[10]), scene.getId(pathKeyPoints[9]));
scene.addEdge(scene.getId(pathKeyPoints[10]), scene.getId(pathKeyPoints[11]));
scene.addEdge(scene.getId(pathKeyPoints[11]), scene.getId(pathKeyPoints[10]));
scene.addEdge(scene.getId(pathKeyPoints[11]), scene.getId(pathKeyPoints[12]));
scene.addEdge(scene.getId(pathKeyPoints[12]), scene.getId(pathKeyPoints[11]));
scene.addEdge(scene.getId(pathKeyPoints[12]), scene.getId(pathKeyPoints[13]));
scene.addEdge(scene.getId(pathKeyPoints[13]), scene.getId(pathKeyPoints[9]));
scene.addEdge(scene.getId(pathKeyPoints[13]), scene.getId(pathKeyPoints[12]));
scene.addEdge(scene.getId(pathKeyPoints[13]), scene.getId(pathKeyPoints[14]));
scene.addEdge(scene.getId(pathKeyPoints[14]), scene.getId(pathKeyPoints[13]));
scene.addEdge(scene.getId(pathKeyPoints[14]), scene.getId(pathKeyPoints[15]));
scene.addEdge(scene.getId(pathKeyPoints[14]), scene.getId(pathKeyPoints[16]));
scene.addEdge(scene.getId(pathKeyPoints[15]), scene.getId(pathKeyPoints[19]));
scene.addEdge(scene.getId(pathKeyPoints[15]), scene.getId(pathKeyPoints[14]));
scene.addEdge(scene.getId(pathKeyPoints[16]), scene.getId(pathKeyPoints[14]));
scene.addEdge(scene.getId(pathKeyPoints[16]), scene.getId(pathKeyPoints[18]));
scene.addEdge(scene.getId(pathKeyPoints[17]), scene.getId(pathKeyPoints[4]));
scene.addEdge(scene.getId(pathKeyPoints[17]), scene.getId(pathKeyPoints[6]));
scene.addEdge(scene.getId(pathKeyPoints[18]), scene.getId(pathKeyPoints[16]));
scene.addEdge(scene.getId(pathKeyPoints[18]), scene.getId(pathKeyPoints[2]));
scene.addEdge(scene.getId(pathKeyPoints[19]), scene.getId(pathKeyPoints[15]));
scene.addEdge(scene.getId(pathKeyPoints[19]), scene.getId(pathKeyPoints[21]));
scene.addEdge(scene.getId(pathKeyPoints[20]), scene.getId(pathKeyPoints[2]));
scene.addEdge(scene.getId(pathKeyPoints[20]), scene.getId(pathKeyPoints[0]));
scene.addEdge(scene.getId(pathKeyPoints[21]), scene.getId(pathKeyPoints[19]));
scene.addEdge(scene.getId(pathKeyPoints[21]), scene.getId(pathKeyPoints[22]));
scene.addEdge(scene.getId(pathKeyPoints[22]), scene.getId(pathKeyPoints[21]));
scene.addEdge(scene.getId(pathKeyPoints[22]), scene.getId(pathKeyPoints[0]));




var persons = [

  new Person(L.point(40.02025,116.63154)),//11
  new Person(L.point(39.97027,116.46070)),//13
  new Person(L.point(39.94027,116.40070)),//14
  new Person(L.point(39.94027,116.34070)),//16
  new Person(L.point(39.92027,116.27070)),//18


	new Person(L.point(39.98027,116.35070)),//15
	new Person(L.point(39.98027,116.25070)),//19
	new Person(L.point(39.90027,116.19070)),//21

  new Person(L.point(39.85175,116.48254)),//9
  new Person(L.point(39.85175,116.37254)),//6
  new Person(L.point(39.85175,116.29254)),//4
  new Person(L.point(39.85175,116.23254)),//2

  new Person(L.point(39.80175,116.60254)),//10
  new Person(L.point(39.80175,116.42254)),//8
  new Person(L.point(39.80175,116.37254)),//7
  new Person(L.point(39.77175,116.25254)),//3
  //library
  new Person(L.point(39.85175,116.33254)),//4.1
  new Person(L.point(39.86175,116.34254)),//6.1
  new Person(L.point(39.84175,116.35254)),//6.2
  //dorm room1
  new Person(L.point(39.95175,116.33254)),//16.1
  new Person(L.point(39.9575,116.34254)),//16.2
  new Person(L.point(39.95175,116.32254)),//16.3
  //dorm room2
  new Person(L.point(39.99175,116.36254)),//15.1
  new Person(L.point(39.99175,116.374254)),//15.2
  new Person(L.point(39.98175,116.38254)),//15.3
  //dorm room3
  new Person(L.point(39.99175,116.47254)),//13.1
  new Person(L.point(39.99175,116.464254)),//13.2
  new Person(L.point(40.01175,116.47254)),//13.3
  //playground
  new Person(L.point(39.86175,116.552354)),//9.1
  new Person(L.point(39.85175,116.534254)),//9.2
  new Person(L.point(39.83175,116.59254)),//10.1
  new Person(L.point(39.82175,116.58254)),//10.2
  new Person(L.point(39.82175,116.60254)),//10.3
  //Basketball court
  new Person(L.point(39.80175,116.38254)),//7.1
  new Person(L.point(39.78175,116.394254)),//7.2
  new Person(L.point(39.79175,116.38254)),//7.3
];

persons[0].setPath(scene.findPath(scene.getId(pathKeyPoints[11]),scene.getId(pathKeyPoints[0])));
persons[1].setPath(scene.findPath(scene.getId(pathKeyPoints[13]),scene.getId(pathKeyPoints[0])));
persons[2].setPath(scene.findPath(scene.getId(pathKeyPoints[14]),scene.getId(pathKeyPoints[0])));
persons[3].setPath(scene.findPath(scene.getId(pathKeyPoints[16]),scene.getId(pathKeyPoints[0])));
persons[4].setPath(scene.findPath(scene.getId(pathKeyPoints[18]),scene.getId(pathKeyPoints[0])));
persons[5].setPath(scene.findPath(scene.getId(pathKeyPoints[15]),scene.getId(pathKeyPoints[0])));
persons[6].setPath(scene.findPath(scene.getId(pathKeyPoints[19]),scene.getId(pathKeyPoints[0])));
persons[7].setPath(scene.findPath(scene.getId(pathKeyPoints[21]),scene.getId(pathKeyPoints[0])));
persons[8].setPath(scene.findPath(scene.getId(pathKeyPoints[9]),scene.getId(pathKeyPoints[0])));
persons[9].setPath(scene.findPath(scene.getId(pathKeyPoints[6]),scene.getId(pathKeyPoints[0])));
// persons[10].setPath(findShortestPath(pathGraph,pathKeyPoints[4],pathKeyPoints[0]));
// persons[11].setPath(findShortestPath(pathGraph,pathKeyPoints[2],pathKeyPoints[0]));
// persons[12].setPath(findShortestPath(pathGraph,pathKeyPoints[10],pathKeyPoints[0]));
// persons[13].setPath(findShortestPath(pathGraph,pathKeyPoints[8],pathKeyPoints[0]));
// persons[14].setPath(findShortestPath(pathGraph,pathKeyPoints[7],pathKeyPoints[0]));
// persons[15].setPath(findShortestPath(pathGraph,pathKeyPoints[3],pathKeyPoints[0]));
//
// persons[16].setPath(findShortestPath(pathGraph,pathKeyPoints[4],pathKeyPoints[0]));
// persons[17].setPath(findShortestPath(pathGraph,pathKeyPoints[6],pathKeyPoints[0]));
// persons[18].setPath(findShortestPath(pathGraph,pathKeyPoints[6],pathKeyPoints[0]));
//
// persons[19].setPath(findShortestPath(pathGraph,pathKeyPoints[16],pathKeyPoints[0]));
// persons[20].setPath(findShortestPath(pathGraph,pathKeyPoints[16],pathKeyPoints[0]));
// persons[21].setPath(findShortestPath(pathGraph,pathKeyPoints[16],pathKeyPoints[0]));
//
// persons[22].setPath(findShortestPath(pathGraph,pathKeyPoints[15],pathKeyPoints[0]));
// persons[23].setPath(findShortestPath(pathGraph,pathKeyPoints[15],pathKeyPoints[0]));
// persons[24].setPath(findShortestPath(pathGraph,pathKeyPoints[15],pathKeyPoints[0]));
//
// persons[25].setPath(findShortestPath(pathGraph,pathKeyPoints[13],pathKeyPoints[0]));
// persons[26].setPath(findShortestPath(pathGraph,pathKeyPoints[13],pathKeyPoints[0]));
// persons[27].setPath(findShortestPath(pathGraph,pathKeyPoints[13],pathKeyPoints[0]));
//
// persons[28].setPath(findShortestPath(pathGraph,pathKeyPoints[9],pathKeyPoints[0]));
// persons[29].setPath(findShortestPath(pathGraph,pathKeyPoints[9],pathKeyPoints[0]));
// persons[30].setPath(findShortestPath(pathGraph,pathKeyPoints[10],pathKeyPoints[0]));
// persons[31].setPath(findShortestPath(pathGraph,pathKeyPoints[10],pathKeyPoints[0]));
// persons[32].setPath(findShortestPath(pathGraph,pathKeyPoints[10],pathKeyPoints[0]));
//
// persons[33].setPath(findShortestPath(pathGraph,pathKeyPoints[7],pathKeyPoints[0]));
// persons[34].setPath(findShortestPath(pathGraph,pathKeyPoints[7],pathKeyPoints[0]));
// persons[35].setPath(findShortestPath(pathGraph,pathKeyPoints[7],pathKeyPoints[0]));
