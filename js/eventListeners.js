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
      keys.a.pressed = true
      break
    case 'ArrowDown':
      event.preventDefault()
      keys.s.pressed = true
      break
    case 'ArrowRight':
      event.preventDefault()
      keys.d.pressed = true
      break

    case ' ':
      event.preventDefault()
      player.attack()
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
