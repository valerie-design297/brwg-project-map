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
    // PROJECTS + PROGRAMS
    //
    // Text below matches the original
    // BRWG static map.
    //
    // Coordinates are temporary and can be
    // replaced with exact locations later.
    // =========================================

    const projects = [


      // ---------------------------------------
      // SUMMIT COUNTY OUTDOOR COALITION
      // ---------------------------------------

      {
        name:
          "Summit County Outdoor Coalition",

        lat: 39.655,
        lng: -106.180,

        description:
          "Part of CPW's Regional Partnership Initiative, SCOC works to ensure collaborative solutions for conservation and recreation."
      },


      // ---------------------------------------
      // BLUE RIVER HABITAT RESTORATION
      // ---------------------------------------

      {
        name:
          "Blue River Habitat Restoration Project",

        lat: 39.627140,
        lng: -106.071730,

        description:
          "This restoration project aims to restore habitat along the Blue River with the goal of improving the overall ecosystem and restoring Gold Medal status to the Blue River below the Dillon Dam."
      },


      // ---------------------------------------
      // RIVER WATCH
      // ---------------------------------------

      {
        name:
          "River Watch: Water Quality Monitoring",

        lat: 39.665,
        lng: -106.083,

        description:
          "Through CPW's River Watch and our citizen science program BRWG ensures water quality is regularly monitored."
      },


      // ---------------------------------------
      // EDUCATIONAL PROGRAMMING
      // ---------------------------------------

      {
        name:
          "Educational Programming",

        lat: 39.640,
        lng: -106.095,

        description:
          "BRWG provides environmental and water policy educational programming to adults and youth throughout the year in Summit County."
      },


      // ---------------------------------------
      // WILDFIRE READY WATERSHEDS
      // ---------------------------------------

      {
        name:
          "Wildfire Ready Watersheds",

        lat: 39.610,
        lng: -106.155,

        description:
          "BRWG has secured funding to bring a Wildfire Ready Action Plan to our Community to prepare for pre and post fire impacts."
      },


      // ---------------------------------------
      // BLUE RIVER CLEAN-UP FESTIVAL
      // ---------------------------------------

      {
        name:
          "Blue River Clean-up Festival",

        lat: 39.574,
        lng: -106.098,

        description:
          "BRWG's annual county-wide River Cleanup brought 215 volunteers together to remove 4000 lbs of trash from our rivers."
      },


      // ---------------------------------------
      // PERU CREEK MINE RESTORATION
      // ---------------------------------------

      {
        name:
          "Peru Creek Mine Restoration",

        lat: 39.603,
        lng: -105.995,

        description:
          "Under the Snake River Watershed Plan, several mine mitigation projects have taken place in the Peru Creek Drainage."
      },


      // ---------------------------------------
      // TEN MILE CREEK
      // ---------------------------------------

      {
        name:
          "Ten Mile Creek Restoration Project",

        lat: 39.575,
        lng: -106.275,

        description:
          "Ten Mile Creek Project addressed severe impacts from development and I-70. This project revitalized this important riparian corridor."
      },


      // ---------------------------------------
      // SWAN RIVER
      // ---------------------------------------

      {
        name:
          "Swan River Restoration Project",

        lat: 39.504,
        lng: -106.001,

        description:
          "Dredge mining tailing piles blocking the Swan River were removed, restoring this vital habitat and improving an incredible recreational and educational resource."
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
          className: "project-tooltip"
        }
      );


      // =======================================
      // POPUP
      // =======================================

      marker.bindPopup(`
        <div class="project-popup">

          <h3>
            ${project.name}
          </h3>

          <p>
            ${project.description}
          </p>

        </div>
      `);


      // =======================================
      // CLICK MARKER
      // =======================================

      marker.on("click", function () {

        // Reset previously selected marker

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


    // =========================================
    // MAP LEGEND
    // =========================================

    const legend = L.control({
      position: "bottomright"
    });


    legend.onAdd = function () {

      const div = L.DomUtil.create(
        "div",
        "map-legend"
      );


      div.innerHTML = `
        <div class="legend-title">
          Map Guide
        </div>

        <div class="legend-instructions">
          Hover for a name • Click for details
        </div>

        <div class="legend-row">
          <span class="legend-dot teal"></span>
          <span>Project or program</span>
        </div>

        <div class="legend-row">
          <span class="legend-dot orange"></span>
          <span>Selected location</span>
        </div>

        <div class="legend-row">
          <span class="legend-line"></span>
          <span>Blue River HUC8 boundary</span>
        </div>
      `;


      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);


      return div;

    };


    legend.addTo(map);


    // =========================================
    // KEEP WATERSHED BORDER VISIBLE
    // =========================================

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
