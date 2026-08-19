// =============================================
// BLUE RIVER WATERSHED GROUP
// Projects and Programs Interactive Map
// =============================================


// ---------------------------------------------
// CREATE MAP
// ---------------------------------------------

const map = L.map("map", {
  zoomControl: true
}).setView(
  [39.55, -106.15],
  9
);


// ---------------------------------------------
// TOPOGRAPHIC BASEMAP
// ---------------------------------------------

L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 17,

    attribution:
      'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap'
  }
).addTo(map);


// ---------------------------------------------
// BLUE RIVER HUC8
//
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
// DOWNLOAD WATERSHED
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

    console.log(
      "Blue River watershed data:",
      data
    );


    // Make sure USGS actually returned something
    if (
      !data.features ||
      data.features.length === 0
    ) {

      throw new Error(
        "USGS returned no watershed features."
      );

    }


    // -----------------------------------------
    // CREATE OUTSIDE MASK
    // -----------------------------------------

    /*
      Turf.mask() creates a polygon covering
      the surrounding world with our watershed
      cut out of the middle.

      Result:

      OUTSIDE = darkened
      INSIDE  = normal basemap
    */

    const outsideMask = turf.mask(data);


    const maskLayer = L.geoJSON(
      outsideMask,
      {

        style: {
          fillColor: "#444444",

          // CHANGE THIS NUMBER TO CONTROL
          // HOW DARK THE OUTSIDE AREA IS
          fillOpacity: 0.50,

          stroke: false
        },

        interactive: false

      }
    ).addTo(map);


    // -----------------------------------------
    // DRAW WATERSHED
    // -----------------------------------------

    const watershedLayer = L.geoJSON(
      data,
      {

        style: {

          // Orange outline
          color: "#ff8c00",

          // Thickness of outline
          weight: 5,

          opacity: 1,

          // Leave watershed interior clear
          fillColor: "#ffffff",
          fillOpacity: 0

        }

      }
    ).addTo(map);


    // -----------------------------------------
    // KEEP ORANGE OUTLINE ABOVE MASK
    // -----------------------------------------

    watershedLayer.bringToFront();


    // -----------------------------------------
    // AUTOMATICALLY ZOOM TO WATERSHED
    // -----------------------------------------

    const bounds = watershedLayer.getBounds();


    if (bounds.isValid()) {

      map.fitBounds(
        bounds,
        {
          padding: [30, 30]
        }
      );

    }


    // -----------------------------------------
    // WATERSHED POPUP
    // -----------------------------------------

    watershedLayer.bindPopup(
      `
        <strong>Blue River Subbasin</strong>
        <br>
        HUC8: 14010002
      `
    );


  })


  // -------------------------------------------
  // ERROR HANDLING
  // -------------------------------------------

  .catch(error => {

    console.error(
      "Error loading Blue River watershed:",
      error
    );

  });
