// Create map
const map = L.map("map").setView([39.55, -106.15], 9);


// TOPOGRAPHIC BASEMAP
L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 17,
    attribution:
      'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap'
  }
).addTo(map);


// USGS HUC8 URL
const hucURL =
  "https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/4/query" +
  "?where=huc8%3D%2714010002%27" +
  "&outFields=*" +
  "&returnGeometry=true" +
  "&outSR=4326" +
  "&f=geojson";


fetch(hucURL)
  .then(response => response.json())
  .then(data => {

    console.log("Watershed data:", data);

    // -----------------------------
    // WATERSHED BOUNDARY
    // -----------------------------

    const watershed = L.geoJSON(data, {
      style: {
        color: "#f28c28",
        weight: 5,
        opacity: 1,
        fillColor: "#ffffff",
        fillOpacity: 0
      }
    }).addTo(map);


    // Zoom map to watershed
    map.fitBounds(watershed.getBounds(), {
      padding: [25, 25]
    });


    // -----------------------------
    // DARKEN EVERYTHING OUTSIDE
    // -----------------------------

    const worldBounds = [
      [-90, -180],
      [-90, 180],
      [90, 180],
      [90, -180]
    ];


    // Get watershed coordinates
    const feature = data.features[0];
    const geometry = feature.geometry;

    let holes = [];


    // GeoJSON coordinates are [longitude, latitude]
    // Leaflet wants [latitude, longitude]

    if (geometry.type === "Polygon") {

      geometry.coordinates.forEach(ring => {

        const leafletRing = ring.map(coord => [
          coord[1],
          coord[0]
        ]);

        holes.push(leafletRing);

      });

    }


    else if (geometry.type === "MultiPolygon") {

      geometry.coordinates.forEach(polygon => {

        polygon.forEach(ring => {

          const leafletRing = ring.map(coord => [
            coord[1],
            coord[0]
          ]);

          holes.push(leafletRing);

        });

      });

    }


    // Create polygon covering the world,
    // with the watershed cut out as a hole
    const mask = L.polygon(
      [worldBounds, ...holes],
      {
        stroke: false,
        fillColor: "#333333",
        fillOpacity: 0.55,
        fillRule: "evenodd",
        interactive: false
      }
    ).addTo(map);


    // Keep watershed outline ABOVE the mask
    watershed.bringToFront();

  })


  .catch(error => {
    console.error("Error loading watershed:", error);
  });
