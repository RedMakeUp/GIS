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
var PERSON_MOVE_SPEED = 0.04;
var COORDINATE_ORIGIN = L.point(0,0);
class Person{
  constructor(location){
    this.name = "Tom";
    this.location =  location;
    this.path = [];
    this.presentation = L.marker([location.x,location.y]);
    this.presentation.bindPopup(location.toString());
    this.lastTarget = null;
    this.lastRemovedPathNode = null;
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

  // Set a new path to the person
  setPath(path){
    this.path = path;

    console.log(this.name + " has a new path: " + this.path);
  }

  // Move along with current path
  run(scene){
    if(!verifyObject(this.path[0])) return;

    if(this.path[0].distanceTo(this.location) < PERSON_MOVE_TORANCE){
      var currentEdge = [
        scene.getId(leafletPoint2LatLng(this.path[0])),
        scene.getId(leafletPoint2LatLng(this.path[1]))
      ];
      scene.enterEdge(currentEdge[0],currentEdge[1],this);
      this.lastEnterEdge = currentEdge;

      this.moveTo(this.path[1],scene);
    }else{
      var currentEdge = scene.findEdgeContainLatLng(this.location);
      scene.enterEdge(currentEdge[0],currentEdge[1],this);
      this.lastEnterEdge = currentEdge;

      this.moveTo(this.path[0],scene);
    }

  }

  // Called when the person reached a target
  reachedOnTarget(target,scene){
    console.log(this.name + " has Reached " + target);

    scene.exitEdge(this.lastEnterEdge[0],this.lastEnterEdge[1],this);
    this.redirect(scene);
    this.run(scene);
    // if(this.path.length >= 2){
    //   var id1 = scene.getId(leafletPoint2LatLng(target));
    //   var id2 = scene.getId(leafletPoint2LatLng(this.path[1]));
    //   scene.enterEdge(id1,id2,this);
    //   this.lastEnterEdge = [id1,id2];
    // }
    //
    // this.path.shift();
    //
    // if(this.path.length > 0){
    //   this.moveTo(this.path[0],scene);
    // }
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

  moveTo(target,scene){
    if(!verifyObject(target)) return;

    let lastTime = performance.now();
    let that = this;
    let dir = target.subtract(this.location);
    let d = dir.distanceTo(COORDINATE_ORIGIN);
    if(d > 0){
      dir.x /= d;
      dir.y /= d;
    }else {
      dir.x = 0;
      dir.y = 0;
    }

    requestAnimationFrame(function animate(currentTime) {
      let deltaTime = (currentTime - lastTime) * 0.001;
      lastTime = currentTime;

      that.location.x += (dir.x * PERSON_MOVE_SPEED * deltaTime);
      that.location.y += (dir.y * PERSON_MOVE_SPEED * deltaTime);

      if(that.presentation instanceof L.Marker){
        that.presentation.setLatLng({lat:that.location.x,lng:that.location.y});
      }

      if(target.distanceTo(that.location) < PERSON_MOVE_TORANCE) {
        that.reachedOnTarget(target,scene);
        // onReached(target,that);
      }else {
        requestAnimationFrame(animate);
      }

    });
  }

}
