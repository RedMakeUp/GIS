function LatLng(lat,lng){
  this.Lat = lat;
  this.Lng = lng;
}
LatLng.prototype.toString = function(){
  return this.Lat + " , " + this.Lng;
}
LatLng.prototype.add = function(p1,p2){
  if(p2 !== undefined){
    this.Lat += p1;
    this.Lng += p2;
  }else {
    this.Lat += p1;
    this.Lng += p1;
  }
}
LatLng.prototype.subtract = function(p1,p2){
  if(p2 !== undefined){
    this.Lat -= p1;
    this.Lng -= p2;
  }else {
    this.Lat -= p1;
    this.Lng -= p1;
  }
}
LatLng.prototype.multiplyBy = function(p1,p2){
  if(p2 !== undefined){
    this.Lat *= p1;
    this.Lng *= p2;
  }else {
    this.Lat *= p1;
    this.Lng *= p1;
  }
}
LatLng.prototype.divideBy = function(p1,p2){
  if(p2 !== undefined){
    this.Lat /= p1;
    this.Lng /= p2;
  }else {
    this.Lat /= p1;
    this.Lng /= p1;
  }
}



// TODO:
// Problem: Different CRS projection will affect what a circle or polygon looks like
class Scene{
  constructor(){
    this.MAX_NODE_NUM = 30;
    this.MAX_PERSON_NUM_PER_EDGE_BY_DEFAULT = 3;
    this.wholeEdgeLength = 0;
    this.wholePersonNum = 0;
    this.nodes = new Map();
    this.neighbors = new Map();
    this.edges = new Map();
    this.normalEdgeStyle = {color: '#555',weight: '5'};
    this.normalNodeStyle = {color: '#f03',fillColor: '#f03',fillOpacity: 0.5,weight: 0,radius: 500};
    this.hotAreaStyle = {color: '756',weight: 0};
    this.exitStyle = {color: '#1ed82c', fillColor: '#1ed82c',fillOpacity: 0.85,weight: 0};
  }

  // Add a node to the scene. Its id will be allocated automatically.
  // A node is represented as:
  //    id -> {IsExit: false, Pos: position, Circle: circle}
  //
  // @param position {Lat:lat, Lng:lng}
  addNode(position){
    if(this.nodes.size >= this.MAX_NODE_NUM){
      alert("The node number has reached the upper limit!")
    }else{
      var id = this.generateId(position);
      this.nodes.set(
        this.generateId(position),
        {
          IsExit: false,
          Pos: position,
          Circle: L.circle(LatLng2Array(position),this.normalNodeStyle)
          // Circle: L.circleMarker(LatLng2Array(position),{fillColor:'#1e69d8', weight:0, fillOpacity: 0.9,  radius:20})
        });
      this.neighbors.set(id,new Set());
    }
  }

  // Set the IsExit property of the node to true
  addExit(id){
    if(this.nodes.get(id) !== undefined){
      this.nodes.get(id).IsExit = true;
      this.nodes.get(id).Circle.setStyle(this.exitStyle).setRadius(1000);
    }
  }

  // Get all exit node by id
  getExitIds(){
    var allExits = [];

    this.nodes.forEach(function(value,key){
      if(value.IsExit){
        allExits.push(key)
      }
    });

    return allExits;
  }

  // Get {Lat:lat, Lng:lng} message by id
  // If the id doesn't exist, return undefined
  getPosition(id){
    if(this.nodes.get(id) === null || this.nodes.get(id) === undefined) return undefined;
    return this.nodes.get(id).Pos;
  }

  // Get the id specified by the position
  // If the position doesn't exist in the scene, return -1
  getId(position){
    var id = -1;
    if(typeof position === 'object'){
      this.nodes.forEach(function(value,key){
        if(value.Pos.Lat === position.Lat && value.Pos.Lng === position.Lng){
          id = key;
          return;
        }
      })
    }

    return id;
  }

  // Generate a unique id(not less than 0) for the node
  // Currently use bitwise operator, but the limit is 30 bits. So if
  // there is too many nodes, possibly switch to BitInt
  generateId(node){
    return 1 << this.nodes.size;
  }

  // Use the ids of two nodes to uniquely specify an edge, and don't care about
  // the order, which means that both (id1,id2) and (id2,id1) will specify they
  // same edge.
  // Also this will set the neighbor relation
  // An edge is represented as
  //    id1 | id2 -> {Enable:true, Weight: weight, Polyline: polyline}
  addEdge(id1,id2,maxPersonNum){
    var pos1 = this.getPosition(id1);
    var pos2 = this.getPosition(id2);
    // Check the two ids do exist
    if(pos1 !== undefined && pos2 !== undefined){
      var distance = calcDistance(pos1, pos2);
      this.wholeEdgeLength += distance;
      var polyline = L.polyline([LatLng2Array(pos1),LatLng2Array(pos2)], this.normalEdgeStyle);
      var hotArea = createRect(LatLng2leafletPoint(pos1),LatLng2leafletPoint(pos2)).setStyle(this.hotAreaStyle);

      this.neighbors.get(id1).add(id2);
      this.neighbors.get(id2).add(id1);
      this.edges.set(
        id1 | id2,
        {
          Enable:true,
          Distance:distance,
          Polyline:polyline,
          HotArea:hotArea,
          PersonSet: new Set(),
          MaxPersonNum:(maxPersonNum === undefined?this.MAX_PERSON_NUM_PER_EDGE_BY_DEFAULT:maxPersonNum)
        }
      );
    }
  }

  // TODO: Check
  findEdgeContainLatLng(v){
    var edge = [];
    var that = this;
    this.edges.forEach(function(value,key){
      if(isMarkerInsidePolygon(v,value.HotArea)){
        return [
          that.getId(createLatLng(value.Polyline.getLatLngs()[0].lat,value.Polyline.getLatLngs()[0].lng)),
          that.getId(createLatLng(value.Polyline.getLatLngs()[1].lat,value.Polyline.getLatLngs()[1].lng))
        ];
      }
    });

    return edge
  }

  // Get the weight between two nodes
  getWeight(id1,id2){
    // var weight =
    //   this.edges.get(id1 | id2).Distance / this.wholeEdgeLength +
    //   this.edges.get(id1 | id2).PersonNum / this.wholePersonNum;
    var weight = this.edges.get(id1 | id2).Distance;
    return weight;
  }

  // There is one person who has entered this edge
  enterEdge(id1,id2, person){
    if(this.edges.get(id1 | id2) !== null && this.edges.get(id1 | id2) !== undefined){
      this.edges.get(id1 | id2).PersonSet.add(person);

      if(this.edges.get(id1 | id2).PersonSet.size > this.edges.get(id1 | id2).MaxPersonNum){
        this.disableEdge(id1,id2);
      }
    }
  }

  // There is one person who has exited this edge
  exitEdge(id1,id2,person){
    if(this.edges.get(id1 | id2) !== null && this.edges.get(id1 | id2) !== undefined){
      this.edges.get(id1 | id2).PersonSet.delete(person);

      if(this.edges.get(id1 | id2).PersonSet.size <= this.edges.get(id1 | id2).MaxPersonNum){
        this.enableEdge(id1,id2);
      }
    }
  }

  // Remove the neighbor relations and edge between two nodes
  removeEdge(id1,id2){
    var pos1 = this.getPosition(id1);
    var pos2 = this.getPosition(id2);
    // Check the two ids do exist
    if(pos1 !== undefined && pos2 !== undefined){
      this.neighbors.get(id1).delete(id2);
      this.neighbors.get(id2).delete(id1);
      this.wholeEdgeLength -= this.edges.get(id1 | id2).Distance;
      this.edges.delete(id1 | id2);
    }
  }

  // Delete the neighbor relations between two nodes but not delete the dege.
  // Just set the Enable property to false
  disableEdge(id1,id2){
    var pos1 = this.getPosition(id1);
    var pos2 = this.getPosition(id2);
    // Check the two ids do exist
    if(pos1 !== undefined && pos2 !== undefined&&
        this.edges.get(id1 | id2).Enable === true){
      this.neighbors.get(id1).delete(id2);
      this.neighbors.get(id2).delete(id1);
      this.edges.get(id1 | id2).Enable = false;
      this.edges.get(id1 | id2).Polyline.setStyle({color: '#f00'});
      if(this.onEdgeOnOffChanged !== undefined) this.onEdgeOnOffChanged();
    }
  }

  // Set the neighbor relations between two nodes and set the Enable property to true
  enableEdge(id1,id2){
    var pos1 = this.getPosition(id1);
    var pos2 = this.getPosition(id2);
    // Check the two ids do exist
    if(pos1 !== undefined && pos2 !== undefined &&
        this.edges.get(id1 | id2).Enable === false){
      this.neighbors.get(id1).add(id2);
      this.neighbors.get(id2).add(id1);
      this.edges.get(id1 | id2).Enable = true;
      this.edges.get(id1 | id2).Polyline.setStyle(this.normalEdgeStyle);

      if(this.onEdgeOnOffChanged !== undefined) this.onEdgeOnOffChanged();
    }
  }

  draw(map){
    var that = this;
    this.edges.forEach(function(value,key){
      value.Polyline.addTo(map);
    });
    this.edges.forEach(function(value,key){
      value.HotArea.addTo(map);
    });
    this.nodes.forEach(function(value,key){
      value.Circle.addTo(map);
    });
  }

  addClickOnNode(){
    this.nodes.forEach(function(value,key){
      value.Circle.on("click",function(){
        console.log("" + value.Pos.toString());
      });
    });
  }

  addClickOnEdge(){
    this.edges.forEach(function(value,key){
      value.Polyline.on("click",function(){
        console.log(value.PersonSet);
      });
    });
  }

  findPath(startId, goalId){
    var frontier = new PriorityQueue((a, b) => a[1] < b[1]);
    var came_from = new Map();
    var cost_so_far = new Map();

    var currentId = null;
    var new_cost = 0;
    came_from[startId] = null;
    cost_so_far[startId] = 0;
    frontier.push([startId,0]);

    while(!frontier.isEmpty()){
      currentId = frontier.pop()[0];

      if(currentId === goalId) break;

      for(var nextId of this.neighbors.get(currentId)){
        new_cost = cost_so_far[currentId] + this.getWeight(currentId,nextId);
        if(cost_so_far[nextId] == null || new_cost < cost_so_far[nextId]){
          cost_so_far[nextId] = new_cost;
          frontier.push([nextId,new_cost]);
          came_from[nextId] = currentId;
        }
      }
    }

    var path = [];

    if(came_from[goalId] !== null && came_from[goalId] !== undefined){
      currentId = goalId;
      while(currentId !== null && currentId !== undefined){
        path.push(currentId);
        currentId = came_from[currentId];
      }
    }

    var pathLeafletPoint = [];
    var lastPathPoint = path.length > 0? path[path.length - 1]:undefined;
    let weights = 0;
    for(var i = path.length - 1; i>=0;i--){
      pathLeafletPoint.push(LatLng2leafletPoint(this.getPosition(path[i])));

      if(lastPathPoint !== path[i]){
        weights += this.getWeight(lastPathPoint,path[i]);
        lastPathPoint = path[i];
      }
    }

    return {
      Path:pathLeafletPoint,
      Weights:weights
    };
  }

  logNeighbors(id){
    if(id === undefined || id === null){
      for(var key of this.neighbors.keys()){
        var str = key + "->";

        for(var value of this.neighbors.get(key)){
          str += " " + value;
        }

        console.log(str);
      }
    }else if(typeof id === 'number'){
      var str = id + "->";
      for(var value of this.neighbors.get(id)){
        str += " " + value;
      }
      console.log(str);
    }
  }
}
