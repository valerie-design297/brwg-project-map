// =============================================
// BLUE RIVER WATERSHED GROUP
// Projects and Programs Interactive Map
// =============================================


// ---------------------------------------------
// CREATE MAP
// ---------------------------------------------

const map = L.map("map", {
  zoomControl: true
}).setView([39.55, -106.15], 9);


// ---------------------------------------------
// BASEMAP
// ---------------------------------------------
//
// Cleaner, natural-colored basemap.
// The watershed itself will remain completely
// unchanged while the outside is dimmed.
//

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }
).addTo(map);


// ---------------------------------------------
// BLUE RIVER HUC8
// HUC8: 14010002
// ---------------------------------------------

const hucURL =
  "https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/4/query" +
  "?where=HUC8%3D%2714010002%27" +
  "&outFields=*" +
  "&returnGeometry=true" +
  "&outSR=4326" +
  "&f=geojson";


// ---------------------------------------------
// LOAD WATERSHED
// ---------------------------------------------

fetch(hucURL)

  .then(response => {

    if (!response.ok) {
      throw new Error(
        "USGS request failed: " + response.status
      );
    }

    return response.json();

  })

  .then(data => {

    if (!data.features || data.features.length === 0) {
      throw new Error(
        "USGS returned no watershed features."
      );
    }


    // -----------------------------------------
    // GRAY OUT EVERYTHING OUTSIDE HUC8
    // -----------------------------------------

    const outsideMask = turf.mask(data);


    L.geoJSON(outsideMask, {

      style: {

        // Neutral gray
        fillColor: "#808080",

        // Controls how faded the outside is.
        // Try 0.35 - 0.55.
        fillOpacity: 0.45,

        stroke: false

      },

      interactive: false

    }).addTo(map);


    // -----------------------------------------
    // DRAW HUC8 BOUNDARY
    // -----------------------------------------

    const watershedLayer = L.geoJSON(data, {

      style: {

        // Orange boundary
        color: "#f28c28",

        weight: 5,

        opacity: 1,

        // IMPORTANT:
        // absolutely NO fill over watershed
        fillOpacity: 0

      }

    }).addTo(map);


    // Keep orange outline above gray mask
    watershedLayer.bringToFront();


    // -----------------------------------------
    // ZOOM TO WATERSHED
    // -----------------------------------------

    const bounds = watershedLayer.getBounds();

    if (bounds.isValid()) {

      map.fitBounds(bounds, {
        padding: [35, 35]
      });

    }


    // -----------------------------------------
    // POPUP
    // -----------------------------------------

    watershedLayer.bindPopup(
      `
      <strong>Blue River Subbasin</strong>
      <br>
      HUC8: 14010002
      `
    );

  })


  .catch(error => {

    console.error(
      "Error loading Blue River watershed:",
      error
    );

  });
