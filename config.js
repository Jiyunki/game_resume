// ─────────────────────────────────────────────────────────────────────────────
// Resume Game — Config
// ─────────────────────────────────────────────────────────────────────────────
// Run setup.html to generate this file automatically, or edit by hand.
// Set to null to use the default game content (data/npcs.js).
//
// Schema:
//   title        — Game title shown on the start screen
//   description  — One-line description shown on the start screen
//   npcs         — Array of up to 4 NPC definitions:
//     sprite       — Sprite name: "villager_2" | "villager_4" | "villager_6" | "villager_7"
//     tileX/tileY  — Grid position on the map (1–27)
//     patrolRange  — Pixels the NPC walks right and back (0 = stationary)
//     speed        — Movement speed in pixels/sec (0 = stationary)
//     dialogues    — Array of dialogue strings (2–4 recommended, max ~120 chars each)
// ─────────────────────────────────────────────────────────────────────────────

window.GAME_CONFIG = null;
