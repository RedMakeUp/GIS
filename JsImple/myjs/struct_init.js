// *********************************************************************
// Define: Heap-based PriorityQueue
// See: https://stackoverflow.com/a/42919752
// Time: 2019/11/20
// *********************************************************************
const pq_top = 0;
const pq_parent = i => ((i + 1) >>> 1) - 1;
const pq_left = i => (i << 1) + 1;
const pq_right = i => (i + 1) << 1;

class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[pq_top];
  }
  push(...values) {
    values.forEach(value => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > pq_top) {
      this._swap(pq_top, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[pq_top] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > pq_top && this._greater(node, pq_parent(node))) {
      this._swap(node, pq_parent(node));
      node = pq_parent(node);
    }
  }
  _siftDown() {
    let node = pq_top;
    while (
      (pq_left(node) < this.size() && this._greater(pq_left(node), node)) ||
      (pq_right(node) < this.size() && this._greater(pq_right(node), node))
    ) {
      let maxChild = (pq_right(node) < this.size() && this._greater(pq_right(node), pq_left(node))) ? pq_right(node) : pq_left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}

// *********************************************************************
// Define: Undirected weighted map
// *********************************************************************
class Graph{
  constructor(noOfVertices){
    this.noOfVertices = noOfVertices;
    this.AdjList = new Map();
    this.polylines = [];
    this.hotAreas = new Map();
  }

  // Add vertex to the graph
  addVertex(v){
    this.AdjList.set(v,[]);
  }

  // Add edge to the graph with a weight(By default, 0)
  addEdge(v1,v2){
    var distance = v1.distanceTo(v2);
    this.AdjList.get(v1).push({neighbor: v2, weight: distance});
  }

  // WARNING!!!
  // Not care about removing weights
  removeEdge(v1,v2){
    var toBeRemoved = null;
    var neighbors = this.getNeighbors(v1);
    if(neighbors === undefined){
      console.log("Not find neighbors of " + v1);
      return;
    }

    for(var i of neighbors){
      if(i.neighbor === v2){
        toBeRemoved = i;
        break;
      }
    }

    if(toBeRemoved !== null){
      var index = neighbors.indexOf(toBeRemoved);
      if (index > -1) {
        console.log("Remove Edge: From " + v1 + " to " + toBeRemoved.neighbor);
        neighbors.splice(index, 1);
      }else{
        console.log("Remove: Can not find the point" + toBeRemoved.neighbor);
      }
    }
  }

  getNeighbors(v){
    return this.AdjList.get(v);
  }

  getVertices(){
    return Array.from( this.AdjList.keys());
  }

  // update the weight between two vertices
  updateWeight(v1,v2,w){
    for (var neighborPair of this.AdjList.get(v1)){
      if(neighborPair.neighbor === v2){
        neighborPair.weight = w;
        break;
      }
    }
  }

  // Get the weight of two vertex.If they aren't linked, return -1
  getWeight(v1,v2){
    var w = -1;
    for (var neighborPair of this.AdjList.get(v1)){
      if(neighborPair.neighbor === v2){
        w = neighborPair.weight;
        break;
      }
    }

    return w;
  }

  draw(map, lineStyle = {color: '#555'}, circleStyle = {color: '#f03',fillColor: '#f03',fillOpacity: 0.5,weight: 0,radius: 500}){
    var isDrawed = new Map();
    var get_keys = this.AdjList.keys();
    for (var i of get_keys)
    {
      L.circle([i.x, i.y],circleStyle).bindPopup(i.toString()).addTo(map);

      var get_values = this.AdjList.get(i);

      for (var j of get_values){
        if(isDrawed[[i, j.neighbor]] === true
         || isDrawed[[j.neighbor,i]] === true) continue;

        var points = [
          [i.x, i.y],
          [j.neighbor.x, j.neighbor.y]
        ];

        this.polylines[this.polylines.length] = L.polyline(points,lineStyle);

        isDrawed[[i, j.neighbor]] = true;
      }
    }

    var that = this;
    this.polylines.forEach(function(polyline){
      polyline.addTo(map);

      var arr = that.getPolylingVertices(polyline);
      var v1 = arr[0];
      var v2 = arr[1];
      that.hotAreas.set(polyline, createRect(v1,v2));
    });
  }

  getPolylingVertices(polyline){
    var v_1 = polyline.getLatLngs()[0];
    var v_2 = polyline.getLatLngs()[1];

    var v1;
    var v2;
    var get_keys = this.AdjList.keys();
    for(var i of get_keys){
      if(i.x === v_1.lat && i.y === v_1.lng){
        v1 = i;
      }else if (i.x === v_2.lat && i.y === v_2.lng) {
        v2 = i;
      }
    }

    return [v1,v2];
  }

  onEdgeDisabled(func,disabledStyle = {color: '#e00'} ){
    var that = this;
    this.polylines.forEach(function(polyline){
      polyline.on("click",function(){
        polyline.setStyle(disabledStyle);
        var arr = that.getPolylingVertices(polyline);
        var v1 = arr[0];
        var v2 = arr[1];

        that.removeEdge(v1,v2);
        that.removeEdge(v2,v1);
        func(v1, v2, that.hotAreas.get(polyline));
      });
    });
  }

  // Return whether the vertex is in the graph
  contain(v){
    return this.AdjList.get(v) ? true:false;
  }

  // Return an array of all vertices(lat,lng)
  getVerticesByArray(){
    var vertices = [];
    var get_keys = this.AdjList.keys();

    for (var i of get_keys){
      vertices[vertices.length] = [i.latitude,i.longitude];
    }

    return vertices;
  }

  // Prints the vertex and adjacency list
  printGraph()
  {
      // get all the vertices
      var get_keys = this.AdjList.keys();
      // iterate over the vertices
      for (var i of get_keys)
      {
          // great the corresponding adjacency list for the vertex
          var get_values = this.AdjList.get(i);
          var conc = "";
          // iterate over the adjacency list
          // concatenate the values into a string
          for (var j of get_values)
              conc += "[" + j.neighbor.toString() + ", " + j.weight + "] ";
          // print the vertex and its adjacency list
          console.log(i.toString() + " -> " + conc);
      }
  }
}

// *********************************************************************
// Find the shortest path from start vertex to goal vertex in graph.
// If the path exists, return the array of vertices in the path; Otherwise,
// return an empty array.
// *********************************************************************
function findShortestPath(graph, start, goal){
  var frontier = new PriorityQueue((a, b) => a[1] < b[1]);
  var came_from = new Map();
  var cost_so_far = new Map();
  var current = null;
  var new_cost = 0;
  came_from[start] = null;
  cost_so_far[start] = 0;
  frontier.push([start,0]);

  while(!frontier.isEmpty()){
    current = frontier.pop()[0];

    if(current === goal) break;

    for(var next of graph.getNeighbors(current)){
      var nextPoint = next.neighbor;
      new_cost = cost_so_far[current] + graph.getWeight(current,nextPoint);
      if(cost_so_far[nextPoint] == null || new_cost < cost_so_far[nextPoint]){
        cost_so_far[nextPoint] = new_cost;
        frontier.push([nextPoint,new_cost]);
        came_from[nextPoint] = current;
      }
    }
  }

  var path = [];

  if(came_from[goal] !== null && came_from[goal] !== undefined){
    current = goal;
    while(current !== null && current !== undefined){
      path.push(current);
      current = came_from[current];
    }
  }

  path.reverse();

  return path;
}

// *********************************************************************
// Define: Person
// *********************************************************************
var PERSON_MOVE_TORANCE = 0.005;
var PERSON_MOVE_SPEED = 0.005;
var COORDINATE_ORIGIN = L.point(0,0);
class Person{
  constructor(location, style){
    this.location =  location;
    this.path = [];
    this.presentation = L.marker([location.x,location.y],style);
    this.presentation.bindPopup(location.toString());
  }

  addTo(map){
    this.presentation.addTo(map);
  }

  isVertexOnMyWay(v){
    return this.path.indexOf(v) > -1;
  }

  isEdgeOnMyWay(v1,v2){
    var index1 = this.path.indexOf(v1);
    var index2 = this.path.indexOf(v2);

    if(index1 > -1 && index2 > -1){
      return true;
    }else{
      return false;
    }
  }

  getcloserVertexOnMyWay(v1,v2){
    var index1 = this.path.indexOf(v1);
    var index2 = this.path.indexOf(v2);

    if(index1 > -1 && index2 > -1){
      return index1 < index2 ? v1 : v2;
    }else{
      return null;
    }
  }

  setPath(path){
    this.path = path;
  }

  updatePath(relayPoint, newPath){
    if(this.path.length === 0)
      this.setPath(newPath);
    else{
      var index = this.path.indexOf(relayPoint);
      if(index > -1){
        index++;
        var removedLen =  this.path.length - index;
        if(removedLen > 0) this.path.splice(index, removedLen);
        for(var i = 1;i<newPath.length;i++) this.path[index++] = newPath[i];
      }else{
        this.setPath(newPath);
      }
    }

    if(this.path.length === 0) {this.path[0] = relayPoint;}
  }

  get loc(){
    return this.location;
  }

  get locLat(){
    return this.location.x;
  }

  get locLng(){
    return this.location.y;
  }

  isInDisabledEdge(area){
    return isMarkerInsidePolygon(this.location,area);
  }

  findCloestKeyPoint(graph){
    var target = pathKeyPoints[0];
    var minDistance = this.location.distanceTo(target);
    for(var p of pathKeyPoints){
      var d = this.location.distanceTo(p);

      if(d < minDistance){
        minDistance = d;
        target = p;
      }
    }

    return target;
  }

  // Update person location, say, per second
  // Use elementInUI to show state of the person in ui
  move(){
    if(this.path.length === 0) return;

    var target = this.path[0];
    var dir = target.subtract(this.location);
    var d = dir.distanceTo(COORDINATE_ORIGIN);
    dir.x /= d;
    dir.y /= d;
    this.location.x += (dir.x * PERSON_MOVE_SPEED);
    this.location.y += (dir.y * PERSON_MOVE_SPEED);

    if(target.distanceTo(this.location) < PERSON_MOVE_TORANCE){
      this.path.shift();
    }

    if(this.presentation instanceof L.Marker)
      this.presentation.setLatLng({lat:this.location.x,lng:this.location.y});
  }
}
