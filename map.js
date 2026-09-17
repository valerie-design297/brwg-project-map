// =============================================
// BLUE RIVER WATERSHED GROUP
// Projects and Programs Interactive Map
// =============================================


// =====================================================
// BRWG EDITING GUIDE
// =====================================================
//
// MOST ROUTINE UPDATES CAN BE MADE IN THE TWO
// "EDITABLE CONTENT" SECTIONS BELOW.
//
// --------------------
// ADDING PHOTOS
// --------------------
//
// 1. Upload the photo to the "images" folder
//    in this GitHub repository.
//
// 2. Find the correct project or program below.
//
// 3. Add the image path next to "photo".
//
// Example:
//
// photo: "images/river-watch.jpg",
//
// If there is no photo yet, leave:
//
// photo: "",
//
// The website will automatically show a
// "Photo coming soon" placeholder.
//
// --------------------
// ADDING LINKS
// --------------------
//
// Add links inside the links array.
//
// Example:
//
// links: [
//   {
//     label: "Project Website",
//     url: "https://example.com"
//   }
// ],
//
// If there are no links yet, leave:
//
// links: [],
//
// --------------------
// IMPORTANT
// --------------------
//
// Be careful not to remove commas, quotation marks,
// brackets, or braces when editing content.
//
// =====================================================


// =====================================================
// EDITABLE CONTENT — MAPPED PROJECTS
// =====================================================
//
// To edit a mapped project:
// - Change its name
// - Change/add its coordinates
// - Add a photo
// - Edit its description
// - Add resource links
//
// A project may have MORE THAN ONE map location.
//
// =====================================================

const projects = [

  {
    name:
      "Blue River Habitat Restoration Project",

    photo: "images/salmon.avif",

    locations: [
      {
        label: "Upper",
        lat: 39.626449,
        lng: -106.068722
      },
      {
        label: "Lower",
        lat: 39.722039,
        lng: -106.125105
      }
    ],

    description:
      "This restoration project aims to restore habitat along the Blue River with the goal of improving the overall ecosystem and restoring Gold Medal status to the Blue River below the Dillon Dam.",

    links: []
  },


  {
    name:
      "Peru Creek Mine Restoration",

    photo: "",

    locations: [
      {
        lat: 39.600308,
        lng: -105.836425
      }
    ],

    description:
      "Under the Snake River Watershed Plan, several mine mitigation projects have taken place in the Peru Creek Drainage.",

    links: []
  },


  {
    name:
      "Ten Mile Creek Restoration Project",

    photo: "",

    locations: [
      {
        lat: 39.503503,
        lng: -106.140115
      }
    ],

    description:
      "Ten Mile Creek Project addressed severe impacts from development and I-70. This project revitalized this important riparian corridor.",

    links: []
  },


  {
    name:
      "Swan River Restoration Project",

    photo: "",

    locations: [
      {
        lat: 39.518128,
        lng: -105.954297
      }
    ],

    description:
      "Dredge mining tailing piles blocking the Swan River were removed, restoring this vital habitat and improving an incredible recreational and educational resource.",

    links: []
  },


  {
    name:
      "North Fork of the Swan River Native Cutthroat Conservation Project",

    photo: "",

    locations: [
      {
        lat: 39.513867,
        lng: -105.941422
      }
    ],

    description:
      "North Fork of the Swan River Native Cutthroat Conservation Project.",

    links: []
  }

];


// =====================================================
// EDITABLE CONTENT — WATERSHED-WIDE PROGRAMS
// =====================================================
//
// Each program can have:
// - Name
// - Photo
// - Description
// - Resource links
//
// PHOTOS:
//
// photo: "images/example.jpg",
//
// OR:
//
// photo: "",
//
// =====================================================

const programs = [

  {
    name:
      "Summit County Outdoor Coalition",

    photo: "",

    description:
      "Part of CPW's Regional Partnership Initiative, SCOC works to ensure collaborative solutions for conservation and recreation.",

    links: []
  },


  {
    name:
      "River Watch: Water Quality Monitoring",

    photo: "",

    description:
      "Through CPW's River Watch and our citizen science program BRWG ensures water quality is regularly monitored.",

    links: []
  },


  {
    name:
      "Educational Programming",

    photo: "",

    description:
      "BRWG provides environmental and water policy educational programming to adults and youth throughout the year in Summit County.",

    links: []
  },


  {
    name:
      "Wildfire Ready Watersheds",

    photo: "",

    description:
      "BRWG has secured funding to bring a Wildfire Ready Action Plan to our Community to prepare for pre and post fire impacts.",

    links: []
  },


  {
    name:
      "Blue River Clean-up Festival",

    photo: "",

    description:
      "BRWG's annual county-wide River Cleanup brought 215 volunteers together to remove 4000 lbs of trash from our rivers.",

    links: []
  }

];


// =====================================================
// MAP SETUP
// =====================================================


// ---------------------------------------------
// CREATE MAP
// ---------------------------------------------

const map = L.map("map", {
  zoomControl: true
}).setView([39.55, -106.15], 9);


let watershedBounds = null;


// =============================================
// BASEMAPS
// =============================================

const standardMap = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }
);


const topoMap = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 19,
    attribution: "Tiles &copy; Esri"
  }
);


const satelliteMap = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 19,
    attribution: "Tiles &copy; Esri"
  }
);


standardMap.addTo(map);


const baseMaps = {
  "Standard": standardMap,
  "Topographic": topoMap,
  "Satellite": satelliteMap
};


L.control.layers(
  baseMaps,
  null,
  {
    position: "topright",
    collapsed: false
  }
).addTo(map);


// =============================================
// SCALE BAR
// =============================================

L.control.scale({
  position: "bottomleft",
  metric: true,
  imperial: true,
  maxWidth: 130
}).addTo(map);


// =============================================
// RESET VIEW BUTTON
// =============================================

const resetControl = L.control({
  position: "bottomleft"
});


resetControl.onAdd = function () {

  const div = L.DomUtil.create(
    "div",
    "reset-view-control"
  );


  div.innerHTML = `
    <button
      class="reset-view-button"
      type="button"
      title="Return to the full Blue River watershed"
    >
      ↺ Reset View
    </button>
  `;


  L.DomEvent.disableClickPropagation(div);
  L.DomEvent.disableScrollPropagation(div);


  const button =
    div.querySelector(".reset-view-button");


  button.addEventListener(
    "click",
    function () {

      if (watershedBounds) {

        map.fitBounds(
          watershedBounds,
          {
            padding: [35, 35]
          }
        );

      }

    }
  );


  return div;

};


resetControl.addTo(map);


// =============================================
// BLUE RIVER HUC8
// HUC8: 14010002
// =============================================

const hucURL =
  "https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/4/query" +
  "?where=HUC8%3D%2714010002%27" +
  "&outFields=*" +
  "&returnGeometry=true" +
  "&outSR=4326" +
  "&f=geojson";


// =============================================
// HELPER FUNCTIONS
// =============================================


// ---------------------------------------------
// CREATE PHOTO CONTENT
// ---------------------------------------------

function createPhotoHTML(
  photo,
  type,
  name
) {

  if (photo) {

    return `
      <img
        class="${type}-photo"
        src="${photo}"
        alt="${name}"
      >
    `;

  }


  return `
    <div class="${type}-photo-placeholder">

      <div class="${type}-photo-icon">
        ▧
      </div>

      <div class="${type}-photo-text">
        ${type === "project"
          ? "Project"
          : "Program"} photo coming soon
      </div>

    </div>
  `;

}


// ---------------------------------------------
// CREATE RESOURCE LINKS
// ---------------------------------------------

function createLinksHTML(
  links,
  type
) {

  if (
    links &&
    links.length > 0
  ) {

    const linkItems =
      links.map(link => {

        return `
          <a
            class="${type}-resource-link"
            href="${link.url}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${link.label}
          </a>
        `;

      }).join("");


    return linkItems;

  }


  return `
    <div class="${type}-resource-placeholder">
      ${type === "project"
        ? "Project"
        : "Program"} links coming soon
    </div>
  `;

}


// =============================================
// LOAD WATERSHED
// =============================================

fetch(hucURL)

  .then(response => {

    if (!response.ok) {

      throw new Error(
        "USGS request failed: " +
        response.status
      );

    }


    return response.json();

  })


  .then(data => {

    if (
      !data.features ||
      data.features.length === 0
    ) {

      throw new Error(
        "USGS returned no watershed features."
      );

    }


    // =========================================
    // GRAY OUT EVERYTHING OUTSIDE HUC8
    // =========================================

    const outsideMask =
      turf.mask(data);


    L.geoJSON(
      outsideMask,
      {

        style: {
          fillColor: "#808080",
          fillOpacity: 0.45,
          stroke: false
        },

        interactive: false

      }
    ).addTo(map);


    // =========================================
    // WATERSHED BOUNDARY
    // =========================================

    const watershedLayer =
      L.geoJSON(
        data,
        {

          style: {
            color: "#f28c28",
            weight: 5,
            opacity: 1,
            fillOpacity: 0
          }

        }
      ).addTo(map);


    watershedLayer.bringToFront();


    // =========================================
    // STORE + ZOOM TO WATERSHED
    // =========================================

    const bounds =
      watershedLayer.getBounds();


    watershedBounds =
      bounds;


    if (bounds.isValid()) {

      map.fitBounds(
        bounds,
        {
          padding: [35, 35]
        }
      );

    }


    // =========================================
    // PROJECT MARKER DESIGN
    // =========================================

    const projectIcon =
      L.divIcon({

        className:
          "project-marker-container",

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
    // ADD PROJECT MARKERS
    // =========================================

    let selectedMarkers = [];


    const projectMarkers =
      new Map();


    projects.forEach(project => {

      const markersForThisProject =
        [];


      project.locations.forEach(
        location => {

          const marker =
            L.marker(
              [
                location.lat,
                location.lng
              ],
              {
                icon: projectIcon
              }
            )
            .addTo(map);


          markersForThisProject.push(
            marker
          );


          // -----------------------------------
          // HOVER LABEL
          // -----------------------------------

          let tooltipLabel =
            project.name;


          if (location.label) {

            tooltipLabel +=
              " — " +
              location.label;

          }


          marker.bindTooltip(
            tooltipLabel,
            {
              direction: "right",
              offset: [15, 0],
              opacity: 1,
              className:
                "project-tooltip"
            }
          );


          // -----------------------------------
          // PROJECT POPUP
          // -----------------------------------

          const popupContent = `
            <div class="project-popup project-popup-expanded">

              <h3>
                ${project.name}
              </h3>


              ${createPhotoHTML(
                project.photo,
                "project",
                project.name
              )}


              <div class="project-description">

                <p>
                  ${project.description}
                </p>

              </div>


              <div class="project-resources">

                <div class="resources-title">
                  Resources & Links
                </div>


                ${createLinksHTML(
                  project.links,
                  "project"
                )}

              </div>

            </div>
          `;


          marker.bindPopup(
            popupContent,
            {
              maxWidth: 380
            }
          );


          // -----------------------------------
          // CLICK MARKER
          // -----------------------------------

          marker.on(
            "click",
            function () {

              // Remove previous selection

              selectedMarkers.forEach(
                selectedMarker => {

                  const oldElement =
                    selectedMarker
                      .getElement();


                  if (oldElement) {

                    const oldCircle =
                      oldElement
                        .querySelector(
                          ".project-marker"
                        );


                    if (oldCircle) {

                      oldCircle
                        .classList
                        .remove(
                          "selected"
                        );

                    }

                  }

                }
              );


              selectedMarkers = [];


              // Highlight every marker
              // belonging to this project

              const relatedMarkers =
                projectMarkers.get(
                  project.name
                ) || [marker];


              relatedMarkers.forEach(
                relatedMarker => {

                  const markerElement =
                    relatedMarker
                      .getElement();


                  if (markerElement) {

                    const circle =
                      markerElement
                        .querySelector(
                          ".project-marker"
                        );


                    if (circle) {

                      circle
                        .classList
                        .add(
                          "selected"
                        );

                    }

                  }


                  selectedMarkers.push(
                    relatedMarker
                  );

                }
              );

            }
          );


          // -----------------------------------
          // POPUP CLOSED
          // -----------------------------------

          marker.on(
            "popupclose",
            function () {

              const relatedMarkers =
                projectMarkers.get(
                  project.name
                ) || [marker];


              relatedMarkers.forEach(
                relatedMarker => {

                  const markerElement =
                    relatedMarker
                      .getElement();


                  if (markerElement) {

                    const circle =
                      markerElement
                        .querySelector(
                          ".project-marker"
                        );


                    if (circle) {

                      circle
                        .classList
                        .remove(
                          "selected"
                        );

                    }

                  }

                }
              );


              selectedMarkers = [];

            }
          );

        }
      );


      projectMarkers.set(
        project.name,
        markersForThisProject
      );

    });


    // =========================================
    // WATERSHED-WIDE PROGRAMS PANEL
    // =========================================

    const programsControl =
      L.control({
        position: "topleft"
      });


    programsControl.onAdd =
      function () {

        const div =
          L.DomUtil.create(
            "div",
            "programs-panel"
          );


        // Generate all program entries
        // automatically from editable content.

        const programsHTML =
          programs.map(program => {

            return `

              <div class="program-item program-item-rich">

                <button
                  class="program-button"
                  type="button"
                >

                  <span class="program-dot"></span>

                  <span>
                    ${program.name}
                  </span>

                  <span class="program-arrow">
                    +
                  </span>

                </button>


                <div class="program-description program-rich-content">


                  ${createPhotoHTML(
                    program.photo,
                    "program",
                    program.name
                  )}


                  <div class="program-rich-description">

                    ${program.description}

                  </div>


                  <div class="program-resources">

                    <div class="program-resources-title">
                      Resources & Links
                    </div>


                    ${createLinksHTML(
                      program.links,
                      "program"
                    )}

                  </div>

                </div>

              </div>

            `;

          }).join("");


        div.innerHTML = `

          <div class="programs-header">

            <div>

              <div class="programs-title">
                Watershed-Wide Programs
              </div>

              <div class="programs-subtitle">
                Programs serving Summit County
              </div>

            </div>


            <button
              class="programs-toggle"
              type="button"
              aria-label="Collapse programs"
            >
              −
            </button>

          </div>


          <div class="programs-content">

            ${programsHTML}

          </div>
        `;


        // -------------------------------------
        // PREVENT PANEL FROM MOVING MAP
        // -------------------------------------

        L.DomEvent.disableClickPropagation(
          div
        );

        L.DomEvent.disableScrollPropagation(
          div
        );


        // -------------------------------------
        // EXPAND / COLLAPSE PROGRAM ITEMS
        // -------------------------------------

        const programButtons =
          div.querySelectorAll(
            ".program-button"
          );


        programButtons.forEach(
          button => {

            button.addEventListener(
              "click",
              function () {

                const item =
                  this.closest(
                    ".program-item"
                  );


                const currentlyOpen =
                  item.classList.contains(
                    "open"
                  );


                // Close all programs

                div
                  .querySelectorAll(
                    ".program-item"
                  )
                  .forEach(
                    otherItem => {

                      otherItem
                        .classList
                        .remove(
                          "open"
                        );


                      const arrow =
                        otherItem.querySelector(
                          ".program-arrow"
                        );


                      if (arrow) {

                        arrow.textContent =
                          "+";

                      }

                    }
                  );


                // Open selected program

                if (!currentlyOpen) {

                  item
                    .classList
                    .add(
                      "open"
                    );


                  const arrow =
                    item.querySelector(
                      ".program-arrow"
                    );


                  if (arrow) {

                    arrow.textContent =
                      "−";

                  }

                }

              }
            );

          }
        );


        // -------------------------------------
        // COLLAPSE WHOLE PANEL
        // -------------------------------------

        const toggle =
          div.querySelector(
            ".programs-toggle"
          );


        const content =
          div.querySelector(
            ".programs-content"
          );


        toggle.addEventListener(
          "click",
          function () {

            const collapsed =
              div.classList.toggle(
                "collapsed"
              );


            if (collapsed) {

              content.style.display =
                "none";


              toggle.textContent =
                "+";


              toggle.setAttribute(
                "aria-label",
                "Expand programs"
              );

            }


            else {

              content.style.display =
                "block";


              toggle.textContent =
                "−";


              toggle.setAttribute(
                "aria-label",
                "Collapse programs"
              );

            }

          }
        );


        return div;

      };


    programsControl.addTo(map);


    // =========================================
    // MAP LEGEND
    // =========================================

    const legend =
      L.control({
        position: "bottomright"
      });


    legend.onAdd =
      function () {

        const div =
          L.DomUtil.create(
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

            <span>
              Mapped project
            </span>

          </div>


          <div class="legend-row">

            <span class="legend-dot orange"></span>

            <span>
              Selected location
            </span>

          </div>


          <div class="legend-row">

            <span class="legend-line"></span>

            <span>
              Blue River HUC8 boundary
            </span>

          </div>

        `;


        L.DomEvent.disableClickPropagation(
          div
        );

        L.DomEvent.disableScrollPropagation(
          div
        );


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
