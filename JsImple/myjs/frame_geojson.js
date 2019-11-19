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
