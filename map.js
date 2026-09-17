    // =========================================
    // MAPPED PROJECTS
    // =========================================

    const projects = [

      {
        name:
          "Blue River Habitat Restoration Project",

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
          "This restoration project aims to restore habitat along the Blue River with the goal of improving the overall ecosystem and restoring Gold Medal status to the Blue River below the Dillon Dam."
      },


      {
        name:
          "Peru Creek Mine Restoration",

        locations: [
          {
            lat: 39.600308,
            lng: -105.836425
          }
        ],

        description:
          "Under the Snake River Watershed Plan, several mine mitigation projects have taken place in the Peru Creek Drainage."
      },


      {
        name:
          "Ten Mile Creek Restoration Project",

        locations: [
          {
            lat: 39.575,
            lng: -106.275
          }
        ],

        description:
          "Ten Mile Creek Project addressed severe impacts from development and I-70. This project revitalized this important riparian corridor."
      },


      {
        name:
          "Swan River Restoration Project",

        locations: [
          {
            lat: 39.518128,
            lng: -105.954297
          }
        ],

        description:
          "Dredge mining tailing piles blocking the Swan River were removed, restoring this vital habitat and improving an incredible recreational and educational resource."
      },


      {
        name:
          "North Fork of the Swan River Native Cutthroat Conservation Project",

        locations: [
          {
            lat: 39.513867,
            lng: -105.941422
          }
        ],

        description:
          "North Fork of the Swan River Native Cutthroat Conservation Project."
      },


      {
        name:
          "Upper Blue River Restoration Working Group",

        locations: [
          {
            lat: 39.475823,
            lng: -106.046487
          }
        ],

        description:
          "Upper Blue River Restoration Working Group."
      }

    ];


    // =========================================
    // ADD PROJECT MARKERS
    // =========================================

    let selectedMarker = null;


    projects.forEach(project => {

      // Each project can have one or more mapped locations.
      // Projects with multiple locations will receive multiple
      // markers that all display the same project information.

      project.locations.forEach(location => {

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


        // ---------------------------------------
        // HOVER LABEL
        // ---------------------------------------

        let tooltipLabel =
          project.name;


        if (location.label) {

          tooltipLabel +=
            " — " + location.label;

        }


        marker.bindTooltip(
          tooltipLabel,
          {
            direction: "right",
            offset: [15, 0],
            opacity: 1,
            className: "project-tooltip"
          }
        );


        // ---------------------------------------
        // POPUP CONTENT
        // ---------------------------------------

        let popupContent;


        // =======================================
        // EXPANDED BLUE RIVER POPUP
        // =======================================

        if (
          project.name ===
          "Blue River Habitat Restoration Project"
        ) {

          popupContent = `
            <div class="project-popup project-popup-expanded">

              <h3>
                ${project.name}
              </h3>


              <div class="project-photo-placeholder">

                <div class="photo-placeholder-icon">
                  ▧
                </div>

                <div class="photo-placeholder-text">
                  Project photo coming soon
                </div>

              </div>


              <div class="project-description">

                <p>
                  ${project.description}
                </p>

              </div>


              <div class="project-resources">

                <div class="resources-title">
                  Resources & Links
                </div>

                <div class="resource-placeholder">
                  Project links coming soon
                </div>

              </div>

            </div>
          `;

        }


        // =======================================
        // NORMAL POPUPS
        // =======================================

        else {

          popupContent = `
            <div class="project-popup">

              <h3>
                ${project.name}
              </h3>

              <p>
                ${project.description}
              </p>

            </div>
          `;

        }


        marker.bindPopup(
          popupContent,
          {
            maxWidth: 380
          }
        );


        // ---------------------------------------
        // CLICK MARKER
        // ---------------------------------------

        marker.on(
          "click",
          function () {

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


            selectedMarker =
              marker;

          }
        );


        // ---------------------------------------
        // POPUP CLOSED
        // ---------------------------------------

        marker.on(
          "popupclose",
          function () {

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


            if (
              selectedMarker === marker
            ) {

              selectedMarker = null;

            }

          }
        );

      });

    });
