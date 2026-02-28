
# Game Resume

This repository contains a small browser-based game demo and assets intended for a resume project. It's designed to be easy to run locally for development and experimentation, and published on web by GitHub Pages

**About this template**

- This is a customizable interactive resume template.
- You can fork it and replace text, images, and dialogue to personalize the experience.
- No advanced JavaScript knowledge is required for basic edits (text, images, and dialogue).
- The project is designed for both CS and non-CS users. Content edits are straightforward; deeper behavior changes require programming knowledge.

**Getting started**

1) Clone the project

```bash
git clone https://github.com/Jiyungi/gamed_resume.git
cd gamed_resume
```

If you prefer, click **Code > Download ZIP** on the GitHub page and unzip the folder.

2) Open in VS Code

- Install Visual Studio Code from https://code.visualstudio.com if you don't have it.
- Open the folder from VS Code: `File > Open Folder...` and select the `gamed_resume` folder.
- Or, from the terminal run `code .` if the `code` command is set up.

3) Run the game locally (two options)

- Option A — Live Server (easy)
  - In VS Code, install the **Live Server** extension.
  - Open `index.html`, right-click and choose **Open with Live Server**.

- Option B — Simple Python server
  - From the project folder run:
```bash
python3 -m http.server 8000
```
  - Open your browser at `http://localhost:8000` and click `index.html`.

4) Quick tips for editing and testing

- After changing images, text, or scripts, refresh the browser.
- Use the browser Console to see errors.
- If assets do not update, try a hard refresh or clear the browser cache.

5) Publish to GitHub Pages (simple steps)

- Create a GitHub repository (or fork this repo) on github.com.
- Push your files to your repo:
```bash
git add .
git commit -m "My changes"
git push origin main
```
- On GitHub, go to `Settings > Pages`. Choose branch `main` and folder `/ (root)`, then save.
- Your site will appear at `https://<your-username>.github.io/<repo>` within minutes.

If you are new to GitHub: use the website buttons **Fork**, **New repository**, or **Upload files**. Then follow the push steps above after cloning your repo.

**VS Code setup tips**

- Recommended extensions:
  - Live Server — quickly preview `index.html` over a local server.
    - You can right-click index.html and select 'Open with Live Server'
  - ESLint (optional) — helps with JavaScript linting.

- Useful built-in features:
  - Debugging: Open the `Run and Debug` panel to configure browser debugging with the "Edge" or "Chrome" debug extensions if you want breakpoints.
  - Integrated terminal: Use the terminal (`Ctrl+`` / Cmd+``) to run the Python server or git commands.

**Repository layout**

- `index.html`: Project entry page — opens the game in a browser.

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


## What You Can Customize (examples)

The list below shows common files or folders you can edit to change visuals, text, and simple game data. These are examples — exact file names or locations may vary between projects. Look for files that perform the described function if the names differ.

- Example: `npcs.js` (or the file that contains NPC dialogue)
  - What it controls: NPC dialogue and lines displayed during interactions.
  - What not to modify: core NPC engine functions or the data-format structure expected by the renderer.

- Example: `images/` (replace character sprites and item images)
  - What it controls: visual appearance of characters, items, tiles, and decorations.
  - What not to modify: filenames referenced by `data/` unless you update those references accordingly.

- Example: `classes/Heart.js` or `js/index.js` (change number of hearts)
  - What it controls: how many health hearts are displayed and the UI for player health.
  - What not to modify: other game-health or respawn engine logic unless you know the interactions.

-- Example: `index.html` (modify intro text)
  - What it controls: the page title, introductory text, and any static markup shown before the game loads.
  - What not to modify: core script and stylesheet includes unless you understand dependency order.

## Using AI to help customize

- You can ask an AI assistant to help edit this project.
- Paste or point the AI to the files you want to change (for example `npcs.js` or `index.html`).
- Tell the AI exactly what you want. Examples:
  - "Change NPC dialogue to friendly tone. Update `data/npcs.js`."
  - "Replace player sprite with `images/player_new.png`. Update sprite path only."
  - "Increase hearts to 5 in `classes/Heart.js`. Do not change other files."
- Ask the AI to only edit content files (text, images, simple constants).
- Ask the AI to avoid changing core engine code in `classes/`, `js/`, or `data/` unless you ask for that specifically.
- Always make a backup before applying changes. Save copies of files you plan to change.
- Ask the AI to explain each edit in one short sentence. Then test the game locally.

### Quick AI prompt examples

- "Edit `data/npcs.js` to make NPCs introduce my name and role. Return only the updated file content."
- "Update `index.html` intro text to: 'Hello - I'm Jane, a game designer.' Return the exact HTML snippet to replace."
- "Change heart count to 5 in `classes/Heart.js`. Show the small code change and one-sentence reason."

### Warning about automated edits

- Do not accept large automated changes without review.
- If unsure, ask the AI for a small patch (one file) first.
- Test changes locally and keep backups.

### Support for non-technical users

- If you are new to this, ask the AI to only change text or image file paths.
- If the AI suggests code edits, ask it to explain what will break if done wrong.

### End AI section

### Warning

The items above are examples of safe, content-level edits. Do not edit files inside `classes/`, `js/`, or `data/` that implement core engine logic unless you understand the code — changing class methods, asset-loading, or data structure formats can break the game.

If you're unsure, make a copy of the file before editing and test changes locally using the development server.








