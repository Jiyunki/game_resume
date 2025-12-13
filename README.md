# Game Resume

This repository contains a small browser-based game demo and assets for resume purpose. The project is structured for simple local development - open `index.html` in a browser to run.

**How to run**

- Install `Live Server` from the VSCode extension
- Right click `index.html` and select `Open with Live Server`.

**Repository layout**

- `index.html`: Project entry page - opens the game in a browser.


- `classes/`: Core JavaScript classes used by the game.
  - `CollisionBlock.js` - collision block logic.
  - `Drop.js` - items or drops handling.
  - `Heart.js` - player health / heart UI.
  - `Monster.js` - enemy logic.
  - `NPC.js` - non-player character behavior.
  - `Player.js` - player character logic and controls.
  - `Sprite.js` - sprite handling and animation helpers.

- `data/`: Static game data and level asset lists.
  - Files like `l_Terrain.js`, `l_Trees_1.js`, `l_Houses.js`, `npcs.js`, and `collisions.js` provide lists and layout data used by the renderer/level loader.

- `font/`: Font assets used by the project.
- `images/`: Image assets (tiles, sprites, decorations, UI images).
- `sound/`: Audio assets (music, SFX).

- `js/`: Application JavaScript and event wiring.
  - `index.js` - main entry JS for the game.
  - `eventListeners.js` - input and DOM event wiring.
  - `utils.js` - shared utilities used across scripts.


**Customizing / Modifying the project**

- Design (images / sprites):
  - Add or replace images in `images/`. Keep filenames descriptive (e.g. `player_walk.png`, `tileset_house.png`).
  - If the project uses sprite sheets, keep tile/sprite sizes consistent. Update any width/height constants in `classes/Sprite.js` or `js/index.js` if needed.
  - Update the level/asset lists in `data/` (for example `l_Terrain.js`, `l_Houses.js`, `l_Trees_*.js`) to reference any new image files or new tile indices so the renderer can pick them up.
  - For UI icons (hearts, inventory), replace or add images and update the code in `classes/Heart.js` or wherever UI sprites are drawn.

- Sound (music / SFX):
  - Add audio files to `sound/` (use common formats: `.mp3`, `.ogg`, `.wav`).
  - Update references in the code that loads audio (search for `new Audio(` or audio-loading helpers in `js/` or `classes/`) and add your filenames.
  - Keep asset sizes reasonable and consider multiple formats for browser compatibility.

- Features / Code (gameplay, controls, AI):
  - Game logic lives in `classes/` (e.g. `Player.js`, `Monster.js`, `NPC.js`). Make changes there for behavior, movement, or collision handling.
  - Wiring and global logic lives in `js/` (e.g. `index.js`, `eventListeners.js`). Update event handling or scene management here.
  - When adding new behaviors, prefer small, focused changes and test them locally with the development server.

- Data / Level changes:
  - Level lists and placements are in `data/`. To add new tiles, decorations, or NPC placements, edit the appropriate `l_*.js` file and follow the existing data formats.

- Testing and iteration:
  - Run a local server (`Live Server` or `python3 -m http.server 8000`) and open the game in the browser to test changes.
  - Use browser devtools (Console, Network) to inspect errors when assets fail to load.
  - When changing images or sound, clear cache or use a cache-busting query string while testing (e.g. `player.png?v=2`).

- Tips:
  - Keep backups of original assets before replacing them.
  - Follow the naming conventions used in `data/` and code to avoid reference mismatches.
  - If you add many new assets, consider adding a short manifest file or updating a top-level comment in `data/` to document them.








