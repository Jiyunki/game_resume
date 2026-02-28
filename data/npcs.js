// NPC definitions: use tile coordinates (tileX, tileY) or world coords (x,y)
// sprite: relative path under ./images/
// dialogues: array of strings
// patrol: optional array of world coords {x,y} (pixels)
// spriteConfig: optional object to control frame slicing

const NPC_DEFS = [
  // villager_7 at the location where l_Characters has a 7 (tileX:5, tileY:6)
  {
    tileX: 5,
    tileY: 6,
    sprite: './images/villager_7.png',
    dialogues: [
      "Hey, I'm Noyuri — I'm Jiyun's friend from Minerva University.",
      "She is currently in Hyderabad, the last rotation city after semesters in Seoul, Berlin, Taipei and Buenos Aires.",
      "Aside from her coding skills, she was a talented actor and director in musical performances!"
    ],
    // patrol 2 tiles right (48px) and back
    patrol: [{ x: 5 * 16, y: 6 * 16 }, { x: 5 * 16 + 48, y: 6 * 16 }],
    speed: 24,
    spriteConfig: {
      // player-style animations: frames stacked vertically per animation column
      animations: {
        walkDown: { x: 0, y: 0, width: 16, height: 16, frameCount: 4 },
        walkUp: { x: 16, y: 0, width: 16, height: 16, frameCount: 4 },
        walkLeft: { x: 32, y: 0, width: 16, height: 16, frameCount: 4 },
        walkRight: { x: 48, y: 0, width: 16, height: 16, frameCount: 4 },
      },
      frameWidth: 16,
      frameHeight: 16,
    },
  },

  // villager_6 at tile where l_Characters has a 6 (tileX:22,tileY:10)
  {
    tileX: 22,
    tileY: 10,
    sprite: './images/villager_6.png',
    dialogues: ["Jiyun worked at three different startups; it was indeed a steep learning curve.",
      "She mostly taught herself skills, from advanced Excel for financial modeling to automating workflows in Python.",
      "Where will she be heading next?"],
    patrol: [{ x: 22 * 16, y: 10 * 16 }, { x: 22 * 16 + 48, y: 10 * 16 }],
    speed: 24,
    spriteConfig: {
      animations: {
        walkDown: { x: 0, y: 0, width: 16, height: 16, frameCount: 2 },
        walkUp: { x: 16, y: 0, width: 16, height: 16, frameCount: 2 },
        walkLeft: { x: 32, y: 0, width: 16, height: 16, frameCount: 2 },
        walkRight: { x: 48, y: 0, width: 16, height: 16, frameCount: 2 },
      },
      frameWidth: 16,
      frameHeight: 16,
    },
  },

  // villager_4 near tile (tileX:3,tileY:22)
  {
    tileX: 3,
    tileY: 15,
    sprite: './images/villager_4.png',
    dialogues: ["I'm Peter, her former colleague at ASML.",
      "It was her first time working in big tech, with many people.",
      "She really got into all parts of the software development lifecycle, from planning and development to testing and deployment.",
      "You're lucky to have found her."
    ],
    patrol: [{ x: 3 * 16, y: 15 * 16 }, { x: 3 * 16 + 20, y: 15 * 16 }],
    speed: 24,
    spriteConfig: {
      animations: {
        walkDown: { x: 0, y: 0, width: 16, height: 16, frameCount: 4 },
        walkUp: { x: 16, y: 0, width: 16, height: 16, frameCount: 4 },
        walkLeft: { x: 32, y: 0, width: 16, height: 16, frameCount: 4 },
        walkRight: { x: 48, y: 0, width: 16, height: 16, frameCount: 4 },
      },
      frameWidth: 16,
      frameHeight: 16,
    },
  },

  // villager_2 at tileX:20,tileY:22
  {
    tileX: 20,
    tileY: 20,
    sprite: './images/villager_2.png',
    dialogues: ["I know a fun fact about her.", 
      "She served as a liaison at the Nobel Peace Prize Summit held in South Korea.",
      "She was a junior interpreter (English–Korean) and worked side-by-side with a Nobel Peace Laureate!"],
    patrol: null,
    speed: 0,
    spriteConfig: {
      animations: {
        walkDown: { x: 0, y: 0, width: 16, height: 16, frameCount: 4 },
        walkUp: { x: 16, y: 0, width: 16, height: 16, frameCount: 4 },
        walkLeft: { x: 32, y: 0, width: 16, height: 16, frameCount: 4 },
        walkRight: { x: 48, y: 0, width: 16, height: 16, frameCount: 4 },
      },
      frameWidth: 16,
      frameHeight: 16,
    },
  },
]

window.NPC_DEFS = NPC_DEFS
