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
    this.lastTarget = null;
    this.currentExit = 0;
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
    this.lastTarget = path[0];
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

  // TODO
  redirect(scene){
    var allExits = scene.getExitIds();

    for(var i = 0; i < allExits.length; i++){
      if(allExits[i] !== this.currentExit){

      }
    }
  }

  // Update person location, say, per second
  // Use elementInUI to show state of the person in ui
  move(scene){
    if(this.path.length === 0) return;

    var target = this.path[0];
    var dir = target.subtract(this.location);
    var d = dir.distanceTo(COORDINATE_ORIGIN);
    dir.x /= d;
    dir.y /= d;
    this.location.x += (dir.x * PERSON_MOVE_SPEED);
    this.location.y += (dir.y * PERSON_MOVE_SPEED);

    if(target.distanceTo(this.location) < PERSON_MOVE_TORANCE){
      if(this.path.length >= 2){
        scene.exitEdge(scene.getId(leafletPoint2LatLng(this.lastTarget)),scene.getId(leafletPoint2LatLng(target)));
        scene.enterEdge(scene.getId(leafletPoint2LatLng(target)),scene.getId(leafletPoint2LatLng(this.path[1])));
        this.lastTarget = target;
      }
      this.path.shift();
    }

    if(this.presentation instanceof L.Marker)
      this.presentation.setLatLng({lat:this.location.x,lng:this.location.y});
  }
}
