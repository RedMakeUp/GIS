class Scene{
  constructor(){
    this.nodes = new Map();
    this.edges = new Map();

    // Two maps
    // Id:0 -> {Lat:lat, Lng:lng}
    // {StartId:id1, EndId:id2} -> {Weight:weight, Polyline:polyline, HotArea:hotArea}
  }

  // Add a node to the scene. Its id will be allocated automatically
  //
  // @param position {Lat:lat, Lng:lng}
  addNode(position){
    this.nodes.set(this.generateId(position),position);
  }

  // Get {Lat:lat, Lng:lng} message by id
  // If the id doesn't exist, return undefined
  getPosition(id){
    return this.nodes.get(id);
  }

  // Get the id specified by the position
  // If the position doesn't exist in the scene, return -1
  getId(position){
    var id = -1;
    this.nodes.forEach(function(value,key){
      if(value.Lat === position.Lat && value.Lng === position.Lng){
        id = key;
        return;
      }
    })

    return id;
  }

  // Generate a unique id(not less than 0) for the node
  generateId(node){
    return this.nodes.size;
  }
}
