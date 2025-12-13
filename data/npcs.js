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
      "Hey, I am Noyuri. Jiyun's friend at Minerva University.",
      "She is currently at Taipei, the 4th rotation city after semesters at Seoul, Berlin and Buenos Aires.",
      "Aside her coding skill, she was a nice actor and director in the musical performnace!"
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
    dialogues: ["Jiyun worked in 3 different startups. It was indeed steep learning curve",
        "She mostly self-taught skills from advanced excel for financial modeling, and automated workflow in Python",
        "Where would she be heading next?"],
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
    dialogues: ["I am Peter, her past college at ASML",
        "It was her first time working in Big Tech, with a lot of people",
        "She really got into all parts of software development life sycle from planning and developing to testing and deploying",
        "You are lucky to find her"
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
    dialogues: ["I know fun fact about her", 
        "She served as liasion in the World Nobel Peace Prize Summit that was held in South Korea",
        "She was a junior interpreter (English-Korean) and worked side-by-side with Nobel Peace Laureate!"],
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
