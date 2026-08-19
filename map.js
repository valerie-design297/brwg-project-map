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


    // =========================================
    // OUTSIDE WATERSHED MASK
    // =========================================

    const outsideMask = turf.mask(data);

    L.geoJSON(outsideMask, {

      style: {

        fillColor: "#808080",

        // Change this number to adjust
        // how faded the outside area is
        fillOpacity: 0.45,

        stroke: false

      },

      interactive: false

    }).addTo(map);


    // =========================================
    // WATERSHED BOUNDARY
    // =========================================

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


    // =========================================
    // PROJECT MARKER DESIGN
    // =========================================

    const projectIcon = L.divIcon({

      className: "project-marker",

      html: "●",

      iconSize: [26, 26],

      iconAnchor: [13, 13],

      popupAnchor: [0, -15]

    });


    // =========================================
    // PROJECT DATA
    // =========================================
    //
    // IMPORTANT:
    // Blue River Habitat Restoration has a
    // published precise coordinate.
    //
    // The other coordinates are currently
    // representative points and can be refined
    // later when exact project coordinates
    // are available.
    // =========================================

    const projects = [

      {
        name:
          "Blue River Habitat Restoration Project",

        lat: 39.627140,
        lng: -106.071730,

        description:
          "The Blue River Habitat Restoration Project aims to improve river and riparian habitat below Dillon Dam and help restore the health of the Blue River fishery."
      },


      {
        name:
          "Peru Creek Mine Restoration",

        // Approximate representative location
        // in the Peru Creek drainage
        lat: 39.603,
        lng: -105.995,

        description:
          "Under the Snake River Watershed Plan, several mine mitigation and restoration projects have taken place in the Peru Creek drainage."
      },


      {
        name:
          "Swan River Restoration Project",

        // Approximate representative location
        // in the upper Swan River drainage
        lat: 39.504,
        lng: -106.001,

        description:
          "This multi-phase restoration project addresses damage caused by historic dredge mining in the upper Swan River drainage and restores river habitat and ecological function."
      },


      {
        name:
          "Tenmile Creek Restoration Project",

        // Approximate representative location
        // along Tenmile Creek
        lat: 39.575,
        lng: -106.275,

        description:
          "BRWG and the U.S. Forest Service restored a heavily impacted section of Tenmile Creek, improving stream habitat, wetlands, floodplain connectivity, recreation, and public access."
      }

    ];


    // =========================================
    // ADD PROJECT MARKERS TO MAP
    // =========================================

    projects.forEach(project => {

      const marker = L.marker(

        [
          project.lat,
          project.lng
        ],

        {
          icon: projectIcon
        }

      ).addTo(map);


      marker.bindPopup(
        `
        <div class="project-popup">

          <h3>
            ${project.name}
          </h3>

          <p>
            ${project.description}
          </p>

        </div>
        `
      );

    });


    // -----------------------------------------
    // KEEP WATERSHED BORDER VISIBLE
    // -----------------------------------------

    watershedLayer.bringToFront();


  })


  // ===========================================
  // ERROR HANDLING
  // ===========================================

  .catch(error => {

    console.error(
      "Error loading Blue River watershed:",
      error
    );

  });
