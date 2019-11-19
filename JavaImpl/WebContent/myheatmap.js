
// Host address
const host = "http://support.supermap.com.cn:8090";
// Url of our model
const url = host+"/iserver/services/map-china400/rest/maps/China";
// Interval between two updates. By default, 1000 milliseconds
const fixedTime = 300;
// Properties of heat map
const heatRadius = 25;
const heatMinOpacity = 0.5;

const Key_Start_sample = 'KeyZ';

// Container of all layers
var map;
// Heat map layer
var resultLayer;
// The key socket connected to server
var webSocket;

var isStartSample = false;
var sampledPoints = [];

var templngData = '';
var templatData = '';
var autoUpdate = false;


// Called at the page's initialization
function onPageLoad(){	
  // Initialize the socket connected to server
  webSocket = new WebSocket("ws://localhost:8080/DataFlowImpl_1/dataflowimpl");
  webSocket.onopen = function(event){
	  console.log('Connect to server successfully');
	  webSocket.send(JSON.stringify({'isNeedPosData': 'yes'}));
  }
  webSocket.onmessage = function(incomingMsg){
	  // Parse Json data
	  var jsonData = JSON.parse(incomingMsg.data);
	  var i = 0;
	  var len = jsonData.longitudes.length;
	  var heatPoints = new Array(len);
	  while(i<len){
		  var longitude = jsonData.longitudes[i];
		  var latitude = jsonData.latitudes[i];
		  var intensity = jsonData.intensities[i];
		  
		  heatPoints[i] = [latitude,longitude,intensity];

		  i++;
	  }
	  
	  console.log(heatPoints);
	  
	  // Remove old one and render a new heat layer
	  if(resultLayer!=null) map.removeLayer(resultLayer);
	  resultLayer = L.heatLayer(heatPoints, {radius: heatRadius, minOpacity: heatMinOpacity});
	  resultLayer.addTo(map);
  }
  
  // Initialize the base map
  map = L.map('mymap',{
    preferCanvas: true,
    center: [39.89, 116.35],
    maxZoom: 18,
    zoom: 11
  });
  map.on('mousemove',function(e){
	 if(isStartSample) {
		 sample(e);
	 }
  });
  map.on('click',function(e){
	  doStuff(e);
  });

  L.supermap.tiledMapLayer(url).addTo(map);
  setInterval("sendToServer()",fixedTime);
  
  var frameRect = [];
  frameRect[0] = [39.93,116.14];
  frameRect[1] = [39.93,116.16];
  frameRect[2] = [39.89,116.16];
  frameRect[3] = [39.89,116.14];
  frameRect[4] = [39.93,116.14];
  frameRect[5] = [39.91,116.16];
  frameRect[6] = [39.91,116.19];
  frameRect[7] = [39.89,116.19];
  frameRect[8] = [39.89,116.16];
  
  var frameRectpolyline = new L.polyline(frameRect, {
      color: 'red',
      weight: 10,
      opacity: 0.5,
      smoothFactor: 1
  });
  frameRectpolyline.addTo(map);

  document.addEventListener('keydown', function(event) {
	  if (event.code == Key_Start_sample && !isStartSample) {
	    console.log('Start to sample');
	    sampledPoints = [];
	    isStartSample = true;
	  }
  });
  
  document.addEventListener('keyup', function(event) {
	  if (event.code == Key_Start_sample && isStartSample) {
	    console.log('Stop to sample');
	    //console.log(sampledPoints);
	    
	    var firstpolyline = new L.polyline(sampledPoints, {
	        color: 'red',
	        weight: 10,
	        opacity: 0.5,
	        smoothFactor: 1
	    });
	    firstpolyline.addTo(map);
	    
	    templngData = '';
	    templatData = '';
	    sampledPoints.forEach(joinString);
	    
	    autoUpdate = true;
	    webSocket.send(JSON.stringify({'isNeedPosData': 'no','longitudes': templngData,'latitudes':templatData}));
	    
	    isStartSample = false;
	  }
  });
  
  console.log('Page load successfully');
}

// Send a data request to server
function sendToServer(){
	if(autoUpdate) webSocket.send(JSON.stringify({'isNeedPosData': 'yes'}));
}


function doStuff(e) {
	  console.log(e.latlng);
	  // coordinates in tile space
	  var x = e.layerPoint.x;
	  var y = e.layerPoint.y;
	  console.log([x, y]);

	  // calculate point in xy space
	  var pointXY = L.point(x, y);
	  console.log("Point in x,y space: " + pointXY);

	  // convert to lat/lng space
	  var pointlatlng = map.layerPointToLatLng(pointXY);
	  // why doesn't this match e.latlng?
	  console.log("Point in lat,lng space: " + pointlatlng);
}


function sample(event){
	sampledPoints[sampledPoints.length] = [event.latlng.lat,event.latlng.lng];
}

function joinString(point) {
	templngData += (point[0] + '') + ' ';
	templatData += (point[1] + '') + ' ';
}