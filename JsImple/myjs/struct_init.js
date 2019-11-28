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
  clear(){
    while(!this.isEmpty()) this.pop();
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
// Define: Person
// *********************************************************************
var PERSON_MOVE_TORANCE = 0.005;
var PERSON_MOVE_SPEED = 0.005;
var COORDINATE_ORIGIN = L.point(0,0);
class Person{
  constructor(location){
    this.location =  location;
    this.path = [];
    this.presentation = L.marker([location.x,location.y]);
    this.presentation.bindPopup(location.toString());
    this.lastTarget = null;
    this.currentExit = scene.getId(pathKeyPoints[0]);// By default
    this.priorityQueue = new PriorityQueue((a, b) => a[1] < b[1]);
    this.lastEnterEdge = [];
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

  // TODO: Check
  setPath(path,scene){
    if(path.length === 0) return;

    this.path = path;
    console.log(scene.findEdgeContainLatLng(this.location));
    var id1 = scene.getId(leafletPoint2LatLng(this.location));
    var id2 = scene.getId(leafletPoint2LatLng(this.path[0]));
    scene.enterEdge(id1,id2,this);
    this.lastEnterEdge = [id1,id2];
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

  isInEdgeHotArea(area){
    return isMarkerInsidePolygon(this.location,area);
  }

  // Find the closet point to current position
  //
  // @points Should be an array of LatLng
  findCloestKeyPoint(points){
    var target = LatLng2leafletPoint(points[0]);
    var minDistance = this.location.distanceTo(target);
    for(var p of points){
      var pt = LatLng2leafletPoint(p);
      var d = this.location.distanceTo(pt);

      if(d < minDistance){
        minDistance = d;
        target = pt;
      }
    }

    return leafletPoint2LatLng(target);
  }

  // TODO: Check 
  // Find a path to certain exit which has the minimun weigts
  redirect(scene){
    // New start node
    var startPoint;
    if(this.path.length > 0 && (this.lastTarget !== undefined && this.lastTarget !== null)){
      // Check if this.lastTarget is valid
      startPoint = this.findCloestKeyPoint([
        leafletPoint2LatLng(this.path[0]),
        leafletPoint2LatLng(this.lastTarget)
      ]);
    }else{
      startPoint = this.findCloestKeyPoint(pathKeyPoints);
    }

    // Find an exit
    this.priorityQueue.clear();
    var allExits = scene.getExitIds();
    var pathPair;
    for(var i = 0; i < allExits.length; i++){
      pathPair = scene.findPath(scene.getId(startPoint),allExits[i]);
      this.priorityQueue.push([pathPair.Path,pathPair.Weights]);
    }

    // set the path which has the minimun weigts to the move path of the person
    var chosenPath = this.priorityQueue.pop()[0];
    this.setPath(chosenPath,scene);
  }

  // Update person location, say, per second
  move(scene){
    if(this.path.length === 0) return;

    var target = this.path[0];
    var dir = target.subtract(this.location);
    var d = dir.distanceTo(COORDINATE_ORIGIN);
    if(d > 0){
      dir.x /= d;
      dir.y /= d;
      this.location.x += (dir.x * PERSON_MOVE_SPEED);
      this.location.y += (dir.y * PERSON_MOVE_SPEED);
    }


    if(target.distanceTo(this.location) < PERSON_MOVE_TORANCE){
      if(this.path.length >= 2){
        scene.exitEdge(this.lastEnterEdge[0],this.lastEnterEdge[1],this);
        var id1 = scene.getId(leafletPoint2LatLng(target));
        var id2 = scene.getId(leafletPoint2LatLng(this.path[1]));
        scene.enterEdge(id1,id2,this);
        this.lastEnterEdge = [id1,id2];
      }
      this.path.shift();
      this.lastTarget = target;
    }

    if(this.presentation instanceof L.Marker){
      this.presentation.setLatLng({lat:this.location.x,lng:this.location.y});
    }

  }
}
