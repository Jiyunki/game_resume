const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

let dpr = window.devicePixelRatio || 1

// Use a fixed internal logical resolution for the game and let CSS scale it
// for display. This avoids offset issues while keeping crisp scaling via DPR.
function setCanvasResolution() {
  dpr = window.devicePixelRatio || 1
  canvas.width = 1024 * dpr
  canvas.height = 576 * dpr
}

// Initialize canvas internal resolution
setCanvasResolution()

const MAP_ROWS = 28
const MAP_COLS = 28

const MAP_WIDTH = 16 * MAP_COLS
const MAP_HEIGHT = 16 * MAP_ROWS

// These values depend on `dpr` and `canvas` size; make mutable so we can
// recompute them when the window is resized.
let MAP_SCALE = dpr + 3

let VIEWPORT_WIDTH = canvas.width / MAP_SCALE
let VIEWPORT_HEIGHT = canvas.height / MAP_SCALE

let VIEWPORT_CENTER_X = VIEWPORT_WIDTH / 2
let VIEWPORT_CENTER_Y = VIEWPORT_HEIGHT / 2

let MAX_SCROLL_X = MAP_WIDTH - VIEWPORT_WIDTH
let MAX_SCROLL_Y = MAP_HEIGHT - VIEWPORT_HEIGHT

const layersData = {
  l_Terrain: l_Terrain,
  l_Trees_1: l_Trees_1,
  l_Trees_2: l_Trees_2,
  l_Trees_3: l_Trees_3,
  l_Trees_4: l_Trees_4,
  l_Landscape_Decorations: l_Landscape_Decorations,
  l_Landscape_Decorations_2: l_Landscape_Decorations_2,
  l_Houses: l_Houses,
  l_House_Decorations: l_House_Decorations,
  l_Collisions: l_Collisions,
}

const frontRendersLayersData = {
  l_Front_Renders: l_Front_Renders,
  l_Front_Renders_2: l_Front_Renders_2,
  l_Front_Renders_3: l_Front_Renders_3,
}

const tilesets = {
  l_Terrain: { imageUrl: './images/terrain.png', tileSize: 16 },
  l_Front_Renders: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_Front_Renders_2: { imageUrl: './images/characters.png', tileSize: 16 },
  l_Front_Renders_3: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_Trees_1: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_Trees_2: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_Trees_3: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_Trees_4: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_Landscape_Decorations: {
    imageUrl: './images/decorations.png',
    tileSize: 16,
  },
  l_Landscape_Decorations_2: {
    imageUrl: './images/decorations.png',
    tileSize: 16,
  },
  l_Houses: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_House_Decorations: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_Characters: { imageUrl: './images/characters.png', tileSize: 16 },
  l_Collisions: { imageUrl: './images/characters.png', tileSize: 16 },
}

// Tile setup
const collisionBlocks = []
const blockSize = 16 // Assuming each tile is 16x16 pixels

collisions.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1) {
      collisionBlocks.push(
        new CollisionBlock({
          x: x * blockSize,
          y: y * blockSize,
          size: blockSize,
        })
      )
    }
  })
})

const renderLayer = (tilesData, tilesetImage, tileSize, context) => {
  tilesData.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== 0) {
        const srcX = ((symbol - 1) % (tilesetImage.width / tileSize)) * tileSize
        const srcY =
          Math.floor((symbol - 1) / (tilesetImage.width / tileSize)) * tileSize

        context.drawImage(
          tilesetImage, // source image
          srcX,
          srcY, // source x, y
          tileSize,
          tileSize, // source width, height
          x * 16,
          y * 16, // destination x, y
          16,
          16 // destination width, height
        )
      }
    })
  })
}

const renderStaticLayers = async (layersData) => {
  const offscreenCanvas = document.createElement('canvas')
  offscreenCanvas.width = canvas.width
  offscreenCanvas.height = canvas.height
  const offscreenContext = offscreenCanvas.getContext('2d')

  for (const [layerName, tilesData] of Object.entries(layersData)) {
    const tilesetInfo = tilesets[layerName]
    if (tilesetInfo) {
      try {
        const tilesetImage = await loadImage(tilesetInfo.imageUrl)
        renderLayer(
          tilesData,
          tilesetImage,
          tilesetInfo.tileSize,
          offscreenContext
        )
      } catch (error) {
        console.error(`Failed to load image for layer ${layerName}:`, error)
      }
    }
  }

  // Optionally draw collision blocks and platforms for debugging
  // collisionBlocks.forEach(block => block.draw(offscreenContext));

  return offscreenCanvas
}
// END - Tile setup

// Change xy coordinates to move player's default position
const player = new Player({
  x: 161,
  y: 128,
  size: 15,
})

const monsterSprites = {
  walkDown: {
    x: 0,
    y: 0,
    width: 16,
    height: 16,
    frameCount: 4,
  },
  walkUp: {
    x: 16,
    y: 0,
    width: 16,
    height: 16,
    frameCount: 4,
  },
  walkLeft: {
    x: 32,
    y: 0,
    width: 16,
    height: 16,
    frameCount: 4,
  },
  walkRight: {
    x: 48,
    y: 0,
    width: 16,
    height: 16,
    frameCount: 4,
  },
}

// Monster definitions. Instantiated later in `startRendering()` to avoid
// first-load race conditions (DPR / canvas sizing / asset load timing).
const MONSTER_DEFS = [
  { x: 200, y: 150, size: 15, imageSrc: './images/bamboo.png', sprites: monsterSprites },
  { x: 300, y: 150, size: 15, imageSrc: './images/dragon.png', sprites: monsterSprites },
  { x: 48, y: 400, size: 15, imageSrc: './images/bamboo.png', sprites: monsterSprites },
  { x: 288, y: 416, size: 15, imageSrc: './images/bamboo.png', sprites: monsterSprites },
  { x: 112, y: 416, size: 15, imageSrc: './images/dragon.png', sprites: monsterSprites },
  { x: 400, y: 400, size: 15, imageSrc: './images/dragon.png', sprites: monsterSprites },
]

// Instantiated after static layers are ready
let monsters = []

// pickups 
const pickups = []

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

// NPCs and dialog state
let npcs = []
let dialogOpen = false
let activeNpc = null
let dialogIndex = 0

// Completion tracking: talked NPCs and unique collected item types
let talkedNpcs = new Set()
let collectedItems = new Set()
// Icons for collected items (drawn in HUD)
let collectedItemIcons = []

function resetCompletionProgress() {
  try {
    talkedNpcs.clear()
    collectedItems.clear()
    collectedItemIcons.length = 0
    for (const npc of npcs) {
      if (npc) npc._hasBeenTalked = false
    }
    const completeOverlay = document.getElementById('game-complete')
    if (completeOverlay) completeOverlay.style.display = 'none'
  } catch (e) {}
}

function checkForCompletion() {
  if (talkedNpcs.size >= 4 && collectedItems.size >= 3) {
    showGameComplete()
  }
}

function showGameComplete() {
  try {
    window.isGameOver = true
    if (player) player.canMove = false
    try { if (window.backgroundMusic) { window.backgroundMusic.pause(); window.backgroundMusic.currentTime = 0 } } catch (e) {}
    const overlay = document.getElementById('game-complete')
    if (overlay) {
      overlay.style.display = 'flex'
      const btn = document.getElementById('complete-restart-button')
      if (btn) {
        btn.focus()
        btn.addEventListener('click', () => window.location.reload())
      }
    }
  } catch (e) {}
}

// Game state
let isGameOver = false

function showGameOver() {
  if (isGameOver) return
  isGameOver = true
  window.isGameOver = true
  // Clear completion progress when player dies
  try { resetCompletionProgress() } catch (e) {}
  try { player.canMove = false } catch (e) {}
  try { if (window.backgroundMusic) { window.backgroundMusic.pause(); window.backgroundMusic.currentTime = 0 } } catch (e) {}
  try { if (dialogSound) { dialogSound.pause(); dialogSound.currentTime = 0 } } catch (e) {}
  try {
    if (player) {
      if (player.attackSound) { player.attackSound.pause(); player.attackSound.currentTime = 0 }
      if (player.bumpSound) { player.bumpSound.pause(); player.bumpSound.currentTime = 0 }
    }
  } catch (e) {}
  const overlay = document.getElementById('game-over')
  if (overlay) {
    overlay.style.display = 'flex'
    const btn = document.getElementById('restart-button')
    if (btn) {
      btn.focus()
      btn.addEventListener('click', () => {
        // simple restart by reloading the page
        window.location.reload()
      })
    }
  }
}
window.showGameOver = showGameOver

// Dialog box image (optional) - loaded during startRendering
let dialogBoxImage = null
// Dialog/talk sound (plays when dialog opens or advances)
let dialogSound = null

let lastTime = performance.now()
let backgroundCanvas = null
let frontRendersCanvas = null

function updateViewportMetrics() {
  MAP_SCALE = dpr + 3
  VIEWPORT_WIDTH = canvas.width / MAP_SCALE
  VIEWPORT_HEIGHT = canvas.height / MAP_SCALE
  VIEWPORT_CENTER_X = VIEWPORT_WIDTH / 2
  VIEWPORT_CENTER_Y = VIEWPORT_HEIGHT / 2
  MAX_SCROLL_X = MAP_WIDTH - VIEWPORT_WIDTH
  MAX_SCROLL_Y = MAP_HEIGHT - VIEWPORT_HEIGHT
}

// Set initial viewport metrics
updateViewportMetrics()
const hearts = [
  new Heart({
    x: 10,
    y: 10,
  }),
  new Heart({
    x: 32,
    y: 10,
  }),
  new Heart({
    x: 54,
    y: 10,
  }),
]

const leafs = [
  new Sprite({
    x: 20,
    y: 20,
    velocity: {
      x: 0.08,
      y: 0.08,
    },
  }),
]

let elapsedTime = 0

function animate() {
  // Calculate delta time
  const currentTime = performance.now()
  const deltaTime = (currentTime - lastTime) / 1000
  lastTime = currentTime
  elapsedTime += deltaTime

  if (elapsedTime > 1.5) {
    leafs.push(
      new Sprite({
        x: Math.random() * 150,
        y: Math.random() * 50,
        velocity: {
          x: 0.08,
          y: 0.08,
        },
      })
    )
    elapsedTime = 0
  }

  // Update player position
  player.handleInput(keys)
  player.update(deltaTime, collisionBlocks)

  const horizontalScrollDistance = Math.min(
    Math.max(0, player.center.x - VIEWPORT_CENTER_X),
    MAX_SCROLL_X
  )

  const verticalScrollDistance = Math.min(
    Math.max(0, player.center.y - VIEWPORT_CENTER_Y),
    MAX_SCROLL_Y
  )

  // Render scene
  c.save()
  c.scale(MAP_SCALE, MAP_SCALE)
  c.translate(-horizontalScrollDistance, -verticalScrollDistance)
  c.clearRect(0, 0, canvas.width, canvas.height)
  c.drawImage(backgroundCanvas, 0, 0)
  // draw NPCs (they were previously part of a static layer)
  for (const npc of npcs) {
    npc.update(deltaTime)
    npc.draw(c)
  }

  // draw player after NPCs so player appears in front
  player.draw(c)

  // render out our monsters
  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i]
    monster.update(deltaTime, collisionBlocks)
    monster.draw(c)

    // Detect for collision
    if (
      player.attackBox.x + player.attackBox.width >= monster.x &&
      player.attackBox.x <= monster.x + monster.width &&
      player.attackBox.y + player.attackBox.height >= monster.y &&
      player.attackBox.y <= monster.y + monster.height &&
      player.isAttacking &&
      !player.hasHitEnemy
    ) {
      monster.receiveHit()
      player.hasHitEnemy = true

      if (monster.health <= 0) {
          // Choose a random drop among R, Py, JS
          const dropChoices = [
            { imageSrc: './images/R_drop.png' },
            { imageSrc: './images/Py_drop.png' },
            { imageSrc: './images/JS_drop.png' },
          ]
          const choice = dropChoices[Math.floor(Math.random() * dropChoices.length)]

          pickups.push(
            new Drop({
              x: monster.x,
              y: monster.y,
              imageSrc: choice.imageSrc,
              width: 24,
              height: 24,
              velocity: { x: 0, y: 0 },
              collectDelay: 0.25,
              lifeTime: 30,
            })
          )

          // Schedule a respawn at the monster's original position after a delay
          const respawnDelayMs = 10 * 1000 // 10 seconds; change as needed
          const originalPos = monster.originalPosition || { x: monster.x, y: monster.y }
          const imageSrc = monster.image?.src || './images/bamboo.png'
          setTimeout(() => {
            try {
              monsters.push(
                new Monster({
                  x: originalPos.x,
                  y: originalPos.y,
                  size: monster.width || 15,
                  imageSrc: imageSrc,
                  sprites: monsterSprites,
                  health: monster.health || 3,
                })
              )
            } catch (err) {
              console.error('Failed to respawn monster', err)
            }
          }, respawnDelayMs)

          // Remove the dead monster immediately so it no longer updates/renders
          monsters.splice(i, 1)
          continue
      }
    }

    if (
      player.x + player.width >= monster.x &&
      player.x <= monster.x + monster.width &&
      player.y + player.height >= monster.y &&
      player.y <= monster.y + monster.height &&
      !player.isInvincible
    ) {
      player.receiveHit()

      const filledHearts = hearts.filter((heart) => heart.currentFrame === 4)

      if (filledHearts.length > 0) {
        filledHearts[filledHearts.length - 1].currentFrame = 0
      }

      const remaining = hearts.filter((heart) => heart.currentFrame === 4).length
      if (remaining === 0) {
        showGameOver()
      }
    }
  }

  c.drawImage(frontRendersCanvas, 0, 0)

  for (let i = leafs.length - 1; i >= 0; i--) {
    const leaf = leafs[i]
    leaf.update(deltaTime)
    leaf.draw(c)

    if (leaf.alpha <= 0) {
      leafs.splice(i, 1)
    }
    console.log('leafs')
  }

  for (let i = pickups.length - 1; i >= 0; i--) {
    const p = pickups[i]
    p.update(deltaTime)
    p.draw(c)

    // remove faded pickups
    if (p.alpha !== undefined && p.alpha <= 0) {
      pickups.splice(i, 1)
      continue
    }

    // simple AABB collection test with player
    if (
      p.x < player.x + player.width &&
      p.x + p.width > player.x &&
      p.y < player.y + player.height &&
      p.y + p.height > player.y
    ) {
      // Only collect if the drop has become collectible (respect collectDelay)
      if (p.collectible) {
        // Apply pickup effect: heal one heart in UI (set first non-full heart to full)
        const emptyHeart = hearts.find((h) => h.currentFrame < 4)
        if (emptyHeart) {
          emptyHeart.currentFrame = 4
        }
        // Track collected item type for completion (use basename of image)
        try {
          const src = (p.image && p.image.src) ? p.image.src : (p.imageSrc || '')
          const name = (typeof src === 'string') ? src.split('/').pop() : ''
          if (name && !collectedItems.has(name)) {
            collectedItems.add(name)
            // create an Image for HUD icon; use relative images/ path
            const icon = new Image()
            icon.src = './images/' + name
            collectedItemIcons.push(icon)
          }
          checkForCompletion()
        } catch (e) {}

        pickups.splice(i, 1)
      }
    }
  } 

  c.restore()

  c.save()
  c.scale(MAP_SCALE, MAP_SCALE)
  hearts.forEach((heart) => {
    heart.draw(c)
  })
  c.restore()

  // HUD: draw collected item icons under hearts
  c.save()
  c.scale(MAP_SCALE, MAP_SCALE)
  try {
    const iconStartX = 10
    const iconY = 34
    const iconSize = 20
    const iconSpacing = 23
    for (let i = 0; i < collectedItemIcons.length; i++) {
      const img = collectedItemIcons[i]
      if (img && img.complete) {
        c.drawImage(img, iconStartX + i * iconSpacing, iconY, iconSize, iconSize)
      }
    }
  } catch (e) {}
  c.restore()

  // HUD: dialog box
  if (dialogOpen && activeNpc) {
    renderDialogBox(c, activeNpc.getDialog(dialogIndex) || '')
  }

  requestAnimationFrame(animate)
}

const startRendering = async () => {
  console.log('startRendering called')
  try {
    // Clear any previous completion progress when starting
    try { resetCompletionProgress() } catch (e) {}
    backgroundCanvas = await renderStaticLayers(layersData)
    frontRendersCanvas = await renderStaticLayers(frontRendersLayersData)
    if (!backgroundCanvas) {
      console.error('Failed to create the background canvas')
      return
    }

    // Try to preload a decorative dialogue box image; if unavailable, we'll
    // simply render the fallback rectangle. This improves visuals when the
    // asset is present but doesn't block startup if absent.
    try {
      // Try images first (common place), then fall back to the font/ folder
      // where your project keeps the provided asset.
      try {
        dialogBoxImage = await loadImage('./images/dialoguebox.png')
      } catch (errImg) {
        try {
          dialogBoxImage = await loadImage('./font/dialoguebox.png')
        } catch (errFont) {
          console.warn('Dialogue box image not loaded from images/ or font/', errFont)
          dialogBoxImage = null
        }
      }
    } catch (err) {
      console.warn('Unexpected error loading dialogue box image', err)
      dialogBoxImage = null
    }

    // Preload dialog/talk sound so we can play it when opening/advancing dialog
    try {
      dialogSound = new Audio('./sound/talk.wav')
      dialogSound.preload = 'auto'
      dialogSound.volume = (typeof window !== 'undefined' && window.SFX_VOLUME !== undefined) ? window.SFX_VOLUME : 0.6
      dialogSound.load()
    } catch (err) {
      console.warn('Dialog sound could not be loaded', err)
      dialogSound = null
    }

    // Create NPCs using explicit per-NPC definitions if available (data/npcs.js)
    try {
      if (window.NPC_DEFS && Array.isArray(window.NPC_DEFS)) {
        for (const def of window.NPC_DEFS) {
          // convert tile coords to world coords if provided
          const x = def.x !== undefined ? def.x : (def.tileX !== undefined ? def.tileX * 16 : 0)
          const y = def.y !== undefined ? def.y : (def.tileY !== undefined ? def.tileY * 16 : 0)
          npcs.push(
            new NPC({
              x,
              y,
              imageSrc: def.sprite || def.imageSrc || './images/characters.png',
              width: def.width || 16,
              height: def.height || 16,
              speed: def.speed || 18,
              patrol: def.patrol || null,
              dialogues: def.dialogues || ['...'],
              spriteConfig: def.spriteConfig || null,
            })
          )
        }
      } else {
        // Fallback: create NPCs from l_Characters using sprite mapping
        const spriteMap = {
          2: './images/villager_2.png',
          4: './images/villager_4.png',
          6: './images/villager_6.png',
          7: './images/villager_7.png',
        }

        const defaultDialogs = {
          2: ['Welcome, this is the village owned by Jiyun'],
          4: ["I'm tending the garden."],
          5: ["Lovely day, isn't it?"],
          6: ["I lost something around here."],
          7: ['Stay safe, traveler.'],
        }

        for (let y = 0; y < l_Characters.length; y++) {
          const row = l_Characters[y]
          for (let x = 0; x < row.length; x++) {
            const symbol = row[x]
            if (symbol !== 0) {
              const px = x * 16
              const py = y * 16
              const src = spriteMap[symbol] || './images/characters.png'

              const patrol = spriteMap[symbol]
                ? [{ x: px, y: py }, { x: px + 48, y: py }]
                : null

              npcs.push(
                new NPC({
                  x: px,
                  y: py,
                  imageSrc: src,
                  width: 16,
                  height: 16,
                  speed: 18,
                  patrol,
                  dialogues: defaultDialogs[symbol] || ['...'],
                })
              )
            }
          }
        }
      }
    } catch (err) {
      console.warn('Could not create NPCs', err)
    }

    // Dialog input handling (E to talk/advance, Escape to close)
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyE') {
        if (dialogOpen) {
            // Advance dialog only if there is another line; play sound only when
            // moving to the next line. If advancing would close the dialog, do
            // not play the sound and just close.
            const nextIndex = dialogIndex + 1
            const total = activeNpc?.dialogues?.length || 0
            if (nextIndex < total) {
              try {
                if (dialogSound) {
                  dialogSound.currentTime = 0
                  dialogSound.play()
                }
              } catch (err) {}
              dialogIndex = nextIndex
            } else {
              // Conversation finished: mark NPC as talked for completion
              try {
                if (activeNpc && !activeNpc._hasBeenTalked) {
                  activeNpc._hasBeenTalked = true
                  talkedNpcs.add(activeNpc)
                }
                checkForCompletion()
              } catch (e) {}

              dialogOpen = false
              if (activeNpc) activeNpc.isTalking = false
              activeNpc = null
              dialogIndex = 0
              player.canMove = true
            }
          } else {
          for (const npc of npcs) {
            if (npc.isNear(player, 28)) {
              dialogOpen = true
              // play dialog open sound
              try {
                if (dialogSound) {
                  dialogSound.currentTime = 0
                  dialogSound.play()
                }
              } catch (err) {}
              activeNpc = npc
              dialogIndex = 0
              player.canMove = false
              if (activeNpc) activeNpc.isTalking = true
              break
            }
          }
        }
      } else if (e.code === 'Escape' && dialogOpen) {
        dialogOpen = false
        activeNpc = null
        dialogIndex = 0
        player.canMove = true
        // unfreeze any npc that was talking
        for (const npc of npcs) npc.isTalking = false
      }
    })

    // Start background music (looping). If autoplay is blocked by browser,
    // attach a user gesture listener to start playback on first interaction.
    try {
      const bgm = new Audio('./sound/background.ogg')
      bgm.loop = true
      bgm.volume = 0.5
      bgm.preload = 'auto'
      // Try to play immediately; if browser blocks it, wait for user gesture
      const playPromise = bgm.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const startOnGesture = () => {
            bgm.play().catch(() => {})
            window.removeEventListener('pointerdown', startOnGesture)
            window.removeEventListener('keydown', startOnGesture)
          }
          window.addEventListener('pointerdown', startOnGesture)
          window.addEventListener('keydown', startOnGesture)
        })
      }
      // expose for debugging/control
      window.backgroundMusic = bgm
    } catch (err) {
      console.warn('Background music could not be loaded', err)
    }

    animate()
    // Instantiate monsters after static layers/rendering setup to avoid
    // first-load position issues. This ensures canvas size / DPR is stable
    // before monsters pick their positions and movement targets.
    try {
      monsters = MONSTER_DEFS.map(def => new Monster(def))
      console.log('Initial monsters (instantiated):', monsters.map(m => ({ x: m.x, y: m.y, original: m.originalPosition })))
    } catch (e) {
      console.error('Failed to instantiate monsters after rendering setup', e)
    }
  } catch (error) {
    console.error('Error during rendering:', error)
  }
}

// Only re-render static layers when devicePixelRatio changes (e.g. zoom, display
// changes). CSS will handle the visual scaling for normal window resizes.
let _resizeTimeout = null
async function handleResize() {
  const newDpr = window.devicePixelRatio || 1
  if (newDpr !== dpr) {
    // DPR changed -> update internal resolution and re-render static layers
    setCanvasResolution()
    updateViewportMetrics()
    try {
      backgroundCanvas = await renderStaticLayers(layersData)
      frontRendersCanvas = await renderStaticLayers(frontRendersLayersData)
    } catch (err) {
      console.error('Failed to re-render static layers on DPR change', err)
    }
  }
}

window.addEventListener('resize', () => {
  clearTimeout(_resizeTimeout)
  _resizeTimeout = setTimeout(() => {
    handleResize()
  }, 150)
})

// Render a simple dialog box in HUD space (viewport coordinates)
function renderDialogBox(ctx, text) {
  if (!text) return
  ctx.save()
  ctx.scale(MAP_SCALE, MAP_SCALE)
  const padding = 14
  const boxW = VIEWPORT_WIDTH - 40
  // Tweak these values to control vertical spacing inside the dialog box
  const paddingTop = 28 // increase to move text further down from the top
  const paddingBottom = 8
  // Reduce box height to decrease the space below the text; keep >= paddingTop + at least one line
  const boxH = 90
  const x = 20
  const y = VIEWPORT_HEIGHT - boxH - 20
  ctx.globalAlpha = 0.95

  if (dialogBoxImage) {
    // Draw with a nine-slice (scale center, preserve corners)
    const sw = dialogBoxImage.width
    const sh = dialogBoxImage.height
    // Choose a border size that fits both source and destination
    const border = Math.max(4, Math.min(16, Math.floor(Math.min(sw, sh) / 6), Math.floor(boxW / 6), Math.floor(boxH / 6)))

    const sx = [0, border, sw - border]
    const sy = [0, border, sh - border]
    const sws = [border, sw - border * 2, border]
    const shs = [border, sh - border * 2, border]

    const dx = [x, x + border, x + boxW - border]
    const dy = [y, y + border, y + boxH - border]
    const dws = [border, Math.max(0, boxW - border * 2), border]
    const dhs = [border, Math.max(0, boxH - border * 2), border]

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const sxx = sx[col]
        const syy = sy[row]
        const sww = sws[col]
        const shh = shs[row]
        const dxx = dx[col]
        const dyy = dy[row]
        const dww = dws[col]
        const dhh = dhs[row]
        // Only draw if both source and destination areas are positive
        if (sww > 0 && shh > 0 && dww > 0 && dhh > 0) {
          try {
            ctx.drawImage(dialogBoxImage, sxx, syy, sww, shh, dxx, dyy, dww, dhh)
          } catch (err) {
            // If drawImage fails for any reason, fall back to simple rectangle
            console.warn('Dialog drawImage failed, falling back', err)
            ctx.fillStyle = '#111'
            ctx.fillRect(x, y, boxW, boxH)
            ctx.strokeStyle = '#fff'
            ctx.lineWidth = 2
            ctx.strokeRect(x, y, boxW, boxH)
            row = 3
            col = 3
          }
        }
      }
    }
  } else {
    ctx.fillStyle = '#111'
    ctx.fillRect(x, y, boxW, boxH)
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, boxW, boxH)
  }

  // Use black text for better contrast with the dialogue art
  ctx.fillStyle = '#000'
  ctx.font = '14px PixelFont'
  // Start text at y + paddingTop so you can control the top gap
  wrapText(ctx, text, x + padding, y + paddingTop, boxW - padding * 2, 16)

  ctx.restore()
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y)
      line = words[n] + ' '
      y += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, y)
}

// Expose an init function so the game only starts after a user gesture
// (e.g. clicking a Start button). This prevents autoplay issues and gives
// us a place to wait for the font to load before beginning rendering.
window.initGame = function initGame() {
  if (document.fonts && document.fonts.load) {
    document.fonts
      .load('14px PixelFont')
      .then(() => {
        startRendering()
      })
      .catch(() => {
        // If font fails to load for any reason, start anyway.
        startRendering()
      })
  } else {
    startRendering()
  }
}
