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
