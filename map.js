const map = L.map("map").setView([39.55, -106.15], 9);

L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 17,
    attribution:
      'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap'
  }
).addTo(map);


// Load LOCAL watershed file
fetch("data/blue-river-huc8.geojson")
  .then(response => response.json())
  .then(data => {

    // -----------------------------
    // ADD WATERSHED
    // -----------------------------

    const watershed = L.geoJSON(data, {
      style: {
        color: "#ff8c00",
        weight: 5,
        opacity: 1,
        fillOpacity: 0
      }
    }).addTo(map);


    // Zoom directly to watershed
    map.fitBounds(watershed.getBounds(), {
      padding: [25, 25]
    });


    // -----------------------------
    // DIM AREA OUTSIDE WATERSHED
    // -----------------------------

    const world = {
      type: "Polygon",
      coordinates: [[
        [-180, -90],
        [180, -90],
        [180, 90],
        [-180, 90],
        [-180, -90]
      ]]
    };


    const watershedGeometry = data.features[0].geometry;

    let holes = [];

    if (watershedGeometry.type === "Polygon") {
      holes = watershedGeometry.coordinates;
    }

    if (watershedGeometry.type === "MultiPolygon") {
      watershedGeometry.coordinates.forEach(polygon => {
        holes.push(...polygon);
      });
    }


    const maskGeoJSON = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          world.coordinates[0],
          ...holes
        ]
      }
    };


    L.geoJSON(maskGeoJSON, {
      style: {
        stroke: false,
        fillColor: "#333333",
        fillOpacity: 0.5,
        fillRule: "evenodd"
      },
      interactive: false
    }).addTo(map);


    // Put orange boundary back on top
    watershed.bringToFront();

  })
  .catch(error => {
    console.error("Error loading local watershed:", error);
  });
