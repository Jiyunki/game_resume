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
      "Hey — I'm Noyuri. I'm a friend of Jiyun's from Minerva.",
      "She's out in Hyderabad right now, after semester in Seoul, Berlin, Taipei, and Buenos Aires.",
      "Besides being great at code, she used to act and direct in musicals."
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
    dialogues: ["Jiyun's worked at a few startups - it was a fast, steep learning curve.",
      "She taught herself a ton: from Excel for finance to scripting and automation in Python.",
      "I wonder where she'll head next."],
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
    dialogues: ["Hi, I'm Peter — I used to work with Jiyun at ASML.",
      "It was her first time in big tech, so she learned quickly working with a big team.",
      "She got her hands on everything: planning, building, testing, and deploying software.",
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
    dialogues: ["Here's a fun fact about her.", 
      "She helped out as a liaison at the Nobel Peace Prize Summit in Korea.",
      "She even worked as a junior English–Korean interpreter alongside a Nobel laureate."],
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
