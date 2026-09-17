# Blue River Watershed Group Interactive Map

This repository contains the interactive project and program map developed for the Blue River Watershed Group (BRWG).

The map displays restoration and conservation projects throughout the Blue River watershed, along with watershed-wide programs serving Summit County.

## Repository Structure

### `map.js`
Contains the primary map content and functionality.

This is the main file to edit when:
- Adding or updating a mapped project
- Changing project coordinates
- Editing project descriptions
- Adding or updating watershed-wide programs
- Adding project or program photos
- Adding resource links

The sections intended for routine editing are clearly labeled near the top of `map.js`.

### `style.css`
Controls the visual appearance of the map, including:
- Project markers
- Popups
- Program panel
- Photos
- Legend
- Buttons and other map controls

This file generally does not need to be changed when updating project or program content.

### `index.html`
Contains the basic webpage structure and loads the libraries, stylesheet, and JavaScript needed for the interactive map.

This file generally does not need to be changed for routine content updates.

### `images/`
Stores photos for projects and programs.

See `images/README.md` for instructions on uploading and displaying photos.

### `data/`
Stores geographic data used by the map.

## Updating Projects and Programs

For most routine updates:

1. Open `map.js`.
2. Find either:
   - `EDITABLE CONTENT — MAPPED PROJECTS`
   - `EDITABLE CONTENT — WATERSHED-WIDE PROGRAMS`
3. Edit the appropriate project or program.
4. Commit/save the changes.

Each project or program can include a name, photo, description, and resource links.

Mapped projects also contain latitude and longitude coordinates.

## Adding Photos

Photos should be uploaded to the `images/` folder.

Detailed instructions are available in:

`images/README.md`

## Important

Most routine updates should only require changes to the editable content sections near the top of `map.js`.

Avoid changing the map setup and functionality sections unless changes to the map's behavior or design are needed.
