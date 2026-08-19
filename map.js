// Create the map
const map = L.map("map").setView([39.55, -106.15], 9);


// BASEMAP
L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 17,
    attribution:
      'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap'
  }
).addTo(map);


// USGS HUC8 QUERY
const hucURL =
  "https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/4/query" +
  "?where=HUC8%3D%2714010002%27" +
  "&outFields=HUC8,NAME" +
  "&returnGeometry=true" +
  "&outSR=4326" +
  "&f=json";


fetch(hucURL)
  .then(response => response.json())
  .then(data => {

    console.log("USGS response:", data);

    if (!data.features || data.features.length === 0) {
      console.error("No watershed found.");
      return;
    }

    const feature = data.features[0];

    // ArcGIS polygon geometry stores coordinates as "rings"
    const rings = feature.geometry.rings;


    // Convert ArcGIS [longitude, latitude]
    // into Leaflet [latitude, longitude]
    const watershedRings = rings.map(ring =>
      ring.map(coord => [coord[1], coord[0]])
    );


    // -----------------------------------
    // OUTSIDE MASK
    // -----------------------------------

    const outerWorld = [
      [-90, -180],
      [-90, 180],
      [90, 180],
      [90, -180]
    ];


    const mask = L.polygon(
      [outerWorld, ...watershedRings],
      {
        stroke: false,
        fillColor: "#555555",
        fillOpacity: 0.55,
        fillRule: "evenodd",
        interactive: false
      }
    ).addTo(map);


    // -----------------------------------
    // WATERSHED OUTLINE
    // -----------------------------------

    const watershed = L.polygon(
      watershedRings,
      {
        color: "#ff8c00",
        weight: 6,
        opacity: 1,

        // Keep inside basically untouched
        fillColor: "#ffffff",
        fillOpacity: 0
      }
    ).addTo(map);


    // Make sure outline sits above mask
    watershed.bringToFront();


    // Automatically zoom to watershed
    map.fitBounds(
      watershed.getBounds(),
      {
        padding: [30, 30]
      }
    );


    // Optional popup on watershed
    watershed.bindPopup(
      "<strong>Blue River Subbasin</strong><br>HUC8: 14010002"
    );

  })
  .catch(error => {
    console.error("Error loading watershed:", error);
  });
