// Generate a point(lat,lng) randomly in a polygon
var randomPointInPoly = function(polygon) {
    var bounds = polygon.getBounds();
    var x_min  = bounds.getEast();
    var x_max  = bounds.getWest();
    var y_min  = bounds.getSouth();
    var y_max  = bounds.getNorth();

    var lat = y_min + (Math.random() * (y_max - y_min));
    var lng = x_min + (Math.random() * (x_max - x_min));

    var point  = turf.point([lng, lat]);
    var poly   = polygon.toGeoJSON();
    var inside = turf.inside(point, poly);

    if (inside) {
        return [point.geometry.coordinates[1],point.geometry.coordinates[0]];
    } else {
        return randomPointInPoly(polygon)
    }
}

// Create a rectangle using two points
// v1 is the middle-left point of the rectangle
// v2 is the middle-right point of the rectangle
// w is its height
function createRect(v1,v2, w = 0.01){
  const R = L.point(1,0);
  const U = L.point(0,1);
  const Origin = L.point(0,0);
  const Theta = Math.PI / 2;

  var center = L.point(
    (v1.x + v2.x) / 2.0,
    (v1.y + v2.y) / 2.0
  );

  var X = L.point(v2.x - center.x , v2.y - center.y);
  var len = X.distanceTo(Origin);
  var unitX = L.point(X.x / len, X.y / len);

  var unitY = L.point(
    unitX.x * Math.cos(Theta) - unitX.y * Math.sin(Theta),
    unitX.x * Math.sin(Theta) + unitX.y * Math.cos(Theta)
  );

  var Y = unitY.multiplyBy(w);

  var points = [
    center.add(X).add(Y),
    center.subtract(X).add(Y),
    center.subtract(X).subtract(Y),
    center.add(X).subtract(Y)
  ];

  var pointsArray = [];
  for(var i = 0; i < points.length;i++) pointsArray[i] = [points[i].x, points[i].y];

  return L.polygon(pointsArray);
}

// Check whether a point is in a polygon
// See: https://stackoverflow.com/questions/31790344/determine-if-a-point-reside-inside-a-leaflet-polygon#
function isMarkerInsidePolygon(point, poly) {
  var inside = false;
  var x = point.x, y = point.y;
  for (var ii=0;ii<poly.getLatLngs().length;ii++){
      var polyPoints = poly.getLatLngs()[ii];
      for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
          var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
          var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

          var intersect = ((yi > y) != (yj > y))
              && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
      }
  }

  return inside;
};
