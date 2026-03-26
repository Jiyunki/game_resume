window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w':
      keys.w.pressed = true
      break
    case 'a':
      keys.a.pressed = true
      break
    case 's':
      keys.s.pressed = true
      break
    case 'd':
      keys.d.pressed = true
      break

    // Arrow keys: map to the same WASD movement flags so existing logic stays unchanged
    case 'ArrowUp':
      event.preventDefault()
      keys.w.pressed = true
      break
    case 'ArrowLeft':
      event.preventDefault()
      // If a dialog is open, navigate it (go back); otherwise use for movement
      if (typeof dialogOpen !== 'undefined' && dialogOpen) {
        try {
          if (dialogIndex > 0) {
            dialogIndex = Math.max(0, dialogIndex - 1)
            try {
              if (dialogSound) {
                dialogSound.currentTime = 0
                dialogSound.play()
              }
            } catch (err) {}
          }
        } catch (err) {}
      } else {
        keys.a.pressed = true
      }
      break
    case 'ArrowDown':
      event.preventDefault()
      keys.s.pressed = true
      break
    case 'ArrowRight':
      event.preventDefault()
      // If a dialog is open, navigate it (advance); otherwise use for movement
      if (typeof dialogOpen !== 'undefined' && dialogOpen) {
        try {
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
        } catch (err) {}
      } else {
        keys.d.pressed = true
      }
      break

    case ' ':
      event.preventDefault()
      // If a dialog is open, advance it. If near an NPC, open dialog.
      // Fallback: perform attack when not interacting with NPCs.
      try {
        if (typeof dialogOpen !== 'undefined' && dialogOpen) {
          // Advance dialog (mirrors index.js KeyE behavior)
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
          // Not currently in dialog — check for nearby NPCs to start one
          let opened = false
          for (const npc of npcs) {
            if (npc.isNear(player, 28)) {
              dialogOpen = true
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
              opened = true
              break
            }
          }
          if (!opened) {
            // No interaction — perform attack
            player.attack()
          }
        }
      } catch (err) {
        // If dialog-related globals aren't present, fallback to attack
        try { player.attack() } catch (e) {}
      }
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'w':
      keys.w.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
    case 'ArrowUp':
      event.preventDefault()
      keys.w.pressed = false
      break
    case 'ArrowLeft':
      event.preventDefault()
      keys.a.pressed = false
      break
    case 'ArrowDown':
      event.preventDefault()
      keys.s.pressed = false
      break
    case 'ArrowRight':
      event.preventDefault()
      keys.d.pressed = false
      break
  }
})

// On return to game's tab, ensure delta time is reset
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    lastTime = performance.now()
  }
})
