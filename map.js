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


    // =========================================
    // GRAY OUT EVERYTHING OUTSIDE HUC8
    // =========================================

    const outsideMask = turf.mask(data);

    L.geoJSON(outsideMask, {

      style: {
        fillColor: "#808080",
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


    // =========================================
    // ZOOM TO WATERSHED
    // =========================================

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

      className: "project-marker-container",

      html: `
        <div class="project-marker">
          <span class="marker-center"></span>
        </div>
      `,

      iconSize: [32, 32],

      iconAnchor: [16, 16],

      popupAnchor: [0, -18]

    });


    // =========================================
    // PROJECT + PROGRAM DATA
    // =========================================

    const projects = [

      {
        name:
          "Blue River Habitat Restoration Project",

        type:
          "Restoration Project",

        lat: 39.627140,
        lng: -106.071730,

        description:
          "The Blue River Habitat Restoration Project aims to improve river and riparian habitat below Dillon Dam and help restore the health of the Blue River fishery."
      },


      {
        name:
          "Peru Creek Mine Restoration",

        type:
          "Restoration Project",

        lat: 39.603,
        lng: -105.995,

        description:
          "Under the Snake River Watershed Plan, several mine mitigation and restoration projects have taken place in the Peru Creek drainage."
      },


      {
        name:
          "Swan River Restoration Project",

        type:
          "Restoration Project",

        lat: 39.504,
        lng: -106.001,

        description:
          "This multi-phase restoration project addresses damage caused by historic dredge mining in the upper Swan River drainage and restores river habitat and ecological function."
      },


      {
        name:
          "Tenmile Creek Restoration Project",

        type:
          "Restoration Project",

        lat: 39.575,
        lng: -106.275,

        description:
          "BRWG and the U.S. Forest Service restored a heavily impacted section of Tenmile Creek, improving stream habitat, wetlands, floodplain connectivity, recreation, and public access."
      },


      {
        name:
          "Educational Programming",

        type:
          "Watershed-Wide Program",

        lat: 39.640,
        lng: -106.095,

        description:
          "BRWG partners with organizations throughout Summit County to provide educational programs and presentations focused on local watershed issues, water resources, and stewardship.",

        note:
          "This is a watershed-wide program; the marker represents the program rather than a single project site."
      },


      {
        name:
          "River Watch",

        type:
          "Water Quality Monitoring",

        lat: 39.665,
        lng: -106.083,

        description:
          "BRWG participates in Colorado's River Watch program, with staff and volunteers collecting water-quality data that contribute to a statewide monitoring database.",

        note:
          "Monitoring occurs at multiple locations throughout the watershed; this marker is representative."
      },


      {
        name:
          "Wildfire Ready Watersheds",

        type:
          "Watershed Planning",

        lat: 39.610,
        lng: -106.155,

        description:
          "The Wildfire Ready Watersheds program helps identify vulnerable infrastructure and ecosystems and develops strategies to prepare the Blue River watershed for wildfire and post-fire flooding.",

        note:
          "This program covers the broader watershed; the marker is a representative location."
      },


      {
        name:
          "Blue River Clean-Up Festival",

        type:
          "Community Event",

        lat: 39.574,
        lng: -106.098,

        description:
          "BRWG's annual Blue River Clean-Up Festival brings volunteers together across Summit County to remove trash from waterways and surrounding lands while celebrating and learning about the Blue River watershed.",

        note:
          "Cleanup activities occur throughout Summit County; this marker represents the festival's Frisco area activities."
      }

    ];


    // =========================================
    // ADD PROJECT MARKERS
    // =========================================

    let selectedMarker = null;


    projects.forEach(project => {

      const marker = L.marker(
        [project.lat, project.lng],
        {
          icon: projectIcon
        }
      ).addTo(map);


      // =======================================
      // HOVER LABEL
      // =======================================

      marker.bindTooltip(
        project.name,
        {
          direction: "right",

          offset: [15, 0],

          opacity: 1,

          className:
            "project-tooltip"
        }
      );


      // =======================================
      // OPTIONAL NOTE
      // =======================================

      let noteHTML = "";

      if (project.note) {

        noteHTML = `
          <p class="project-note">
            ${project.note}
          </p>
        `;

      }


      // =======================================
      // POPUP
      // =======================================

      marker.bindPopup(`
        <div class="project-popup">

          <div class="project-type">
            ${project.type}
          </div>

          <h3>
            ${project.name}
          </h3>

          <p>
            ${project.description}
          </p>

          ${noteHTML}

        </div>
      `);


      // =======================================
      // CLICK MARKER
      // =======================================

      marker.on("click", function () {

        // Reset old marker

        if (selectedMarker) {

          const oldElement =
            selectedMarker.getElement();

          if (oldElement) {

            const oldCircle =
              oldElement.querySelector(
                ".project-marker"
              );

            if (oldCircle) {

              oldCircle.classList.remove(
                "selected"
              );

            }

          }

        }


        // Highlight clicked marker

        const markerElement =
          marker.getElement();

        if (markerElement) {

          const circle =
            markerElement.querySelector(
              ".project-marker"
            );

          if (circle) {

            circle.classList.add(
              "selected"
            );

          }

        }


        selectedMarker = marker;

      });


      // =======================================
      // POPUP CLOSED
      // =======================================

      marker.on("popupclose", function () {

        const markerElement =
          marker.getElement();

        if (markerElement) {

          const circle =
            markerElement.querySelector(
              ".project-marker"
            );

          if (circle) {

            circle.classList.remove(
              "selected"
            );

          }

        }


        if (selectedMarker === marker) {

          selectedMarker = null;

        }

      });

    });


    // Keep watershed boundary visible
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
