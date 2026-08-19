// Create the map
const map = L.map("map").setView([39.55, -106.15], 9);

// Topographic basemap
L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 17,
    attribution:
      'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap'
  }
).addTo(map);

// USGS Watershed Boundary Dataset
// HUC8 14010002 = Blue River subbasin
const hucURL =
  "https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/4/query" +
  "?where=huc8%3D%2714010002%27" +
  "&outFields=*" +
  "&returnGeometry=true" +
  "&f=geojson";

fetch(hucURL)
  .then(response => response.json())
  .then(data => {

    const watershed = L.geoJSON(data, {
      style: {
        color: "#f28c28",
        weight: 4,
        opacity: 1,
        fillColor: "#f28c28",
        fillOpacity: 0.05
      }
    }).addTo(map);

    // Automatically zoom to the Blue River watershed
    map.fitBounds(watershed.getBounds());

  })
  .catch(error => {
    console.error("Error loading watershed boundary:", error);
  });
