# Game Resume

This repository contains a small browser-based game demo and assets for resume purpose. The project is structured for simple local development - open `index.html` in a browser to run.

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


**How to run**

- Install `Live Server` from the VSCode extension
- Right click `index.html` and select `Open with Live Server`.




