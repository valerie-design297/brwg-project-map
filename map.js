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

        fillColor: "#808080",

        // Change this to control darkness
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

        color: "#f28c28",

        weight: 5,

        opacity: 1,

        fillOpacity: 0

      }

    }).addTo(map);


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
    // WATERSHED POPUP
    // -----------------------------------------

    watershedLayer.bindPopup(
      `
      <strong>Blue River Subbasin</strong>
      <br>
      HUC8: 14010002
      `
    );


    // =========================================
    // PROJECT MARKERS
    // =========================================


    // -----------------------------------------
    // CUSTOM PROJECT ICON
    // -----------------------------------------

    const projectIcon = L.divIcon({

      className: "project-marker",

      html: "●",

      iconSize: [26, 26],

      iconAnchor: [13, 13],

      popupAnchor: [0, -15]

    });


    // -----------------------------------------
    // BLUE RIVER HABITAT RESTORATION
    // -----------------------------------------

    L.marker(
      [39.63, -106.08],
      {
        icon: projectIcon
      }
    )

    .addTo(map)

    .bindPopup(
      `
      <div class="project-popup">

        <h3>
          Blue River Habitat Restoration Project
        </h3>

        <p>
          This restoration project aims to restore
          habitat along the Blue River with the goal
          of improving the overall ecosystem and
          restoring Gold Medal status to the Blue
          River below the Dillon Dam.
        </p>

      </div>
      `
    );


  })


  // ---------------------------------------------
  // ERROR HANDLING
  // ---------------------------------------------

  .catch(error => {

    console.error(
      "Error loading Blue River watershed:",
      error
    );

  });
