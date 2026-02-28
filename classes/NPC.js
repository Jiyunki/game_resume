class NPC {
  constructor({
    x,
    y,
    imageSrc = null,
    image = null,
    width = 16,
    height = 16,
    speed = 24,
    patrol = null,
    dialogues = [],
    spriteConfig = null,
  }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.speed = speed // pixels per second

    // movement state
    this.vx = 0
    this.vy = 0
    this.patrol = patrol // array of {x,y} points in world coords
    this.patrolIndex = 0
    this.isTalking = false

    this.dialogues = dialogues || []
    this.spriteConfig = spriteConfig || null

    // dialog/info icon animation state (4-frame sprite strip)
    this._dialogIconFrame = 0
    this._dialogIconElapsed = 0
    this._dialogIconInterval = 0.22
    this._showDialogIcon = false

    // Animation state (assumes a 4-frame per direction sheet: down, left, right, up)
    this.frameCount = 4
    this.currentFrame = 0
    this.frameElapsed = 0
    this.frameInterval = 0.2
    this.facing = 'down' // 'down'|'left'|'right'|'up'

    // image loading
    this.image = image || null
    if (!this.image && imageSrc) {
      this.image = new Image()
      this.image.src = imageSrc
    }
  }

  // Simple linear move toward patrol target
  update(deltaTime) {
    if (!deltaTime) return

    if (this.isTalking) {
      // freeze animation when talking
      this.vx = 0
      this.vy = 0
      this.currentFrame = 0
      return
    }
    if (this.patrol && this.patrol.length > 0) {
      // determine current animation frame count if spriteConfig provides per-animation info
      let animFrameCount = this.frameCount
      if (
        this.spriteConfig &&
        this.spriteConfig.animations &&
        typeof this.spriteConfig.animations === 'object'
      ) {
        const facingToAnim = { down: 'walkDown', left: 'walkLeft', right: 'walkRight', up: 'walkUp' }
        const animName = facingToAnim[this.facing] || 'walkDown'
        const animDef = this.spriteConfig.animations[animName]
        if (animDef && animDef.frameCount) animFrameCount = animDef.frameCount
      }

      const target = this.patrol[this.patrolIndex]
      const dx = target.x - this.x
      const dy = target.y - this.y
      const dist = Math.hypot(dx, dy)
      if (dist < 2) {
        // reached target: optionally pause a moment then go to next
        if (!this._waitTimer) {
          this._waitTimer = 0
          this._waitDuration = 0.5 + Math.random() * 1.5 // 0.5 - 2s pause
        }

        this._waitTimer += deltaTime
        if (this._waitTimer >= this._waitDuration) {
          this._waitTimer = 0
          this.patrolIndex = (this.patrolIndex + 1) % this.patrol.length
        }
        return
      }

      // normalize and move with smoothing (lerp toward ideal next position)
      const nx = dx / dist
      const ny = dy / dist
      const idealX = this.x + nx * this.speed * deltaTime
      const idealY = this.y + ny * this.speed * deltaTime

      // lerp factor helps to smooth movement; closer to 1 is more direct
      const lerpFactor = Math.min(1, 6 * deltaTime)
      this.x += (idealX - this.x) * lerpFactor
      this.y += (idealY - this.y) * lerpFactor

      this.vx = (idealX - this.x) / deltaTime
      this.vy = (idealY - this.y) / deltaTime

      // set facing by dominant axis
      if (Math.abs(dx) > Math.abs(dy)) {
        this.facing = dx > 0 ? 'right' : 'left'
      } else {
        this.facing = dy > 0 ? 'down' : 'up'
      }

      // animation frame (use animFrameCount computed above)
      this.frameElapsed += deltaTime
      if (this.frameElapsed >= this.frameInterval) {
        this.currentFrame = (this.currentFrame + 1) % animFrameCount
        this.frameElapsed -= this.frameInterval
      }
    }
  }

  draw(ctx) {
    if (!this.image) {
      // fallback: draw a magenta box
      ctx.fillStyle = 'magenta'
      ctx.fillRect(this.x, this.y, this.width, this.height)
      // draw dialog/info icon if enabled
      try {
        if (this._showDialogIcon && window.dialogInfoImage) {
          const img = window.dialogInfoImage
          const fw = Math.floor(img.width / 4) || img.width / 4
          const fh = img.height
          const sx = this._dialogIconFrame * fw
          const sy = 0
          const iconW = Math.min(20, this.width * 1.2)
          const iconH = (fh / fw) * iconW
          const dx = this.x + this.width / 2 - iconW / 2
          const dy = this.y - iconH - 2
          ctx.drawImage(img, sx, sy, fw, fh, dx, dy, iconW, iconH)
        }
      } catch (e) {}
      return
    }
    // helper to draw images without smoothing and using integer coordinates
    const _drawImageNoSmooth = (ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) => {
      try {
        ctx.save()
        if (ctx.imageSmoothingEnabled !== undefined) ctx.imageSmoothingEnabled = false
        ctx.drawImage(
          img,
          Math.floor(sx),
          Math.floor(sy),
          Math.floor(sw),
          Math.floor(sh),
          Math.round(dx),
          Math.round(dy),
          Math.round(dw),
          Math.round(dh)
        )
      } catch (e) {
        // drawing failed silently
      } finally {
        try {
          ctx.restore()
        } catch (e) {}
      }
    }

    // helper to draw dialog icon when present
    const _drawDialogIcon = (ctx) => {
      try {
        if (this._showDialogIcon && window.dialogInfoImage) {
          const img = window.dialogInfoImage
          const fw = Math.floor(img.width / 4) || img.width / 4
          const fh = img.height
          const sx = this._dialogIconFrame * fw
          const sy = 0
          const iconW = Math.min(20, this.width * 1.2)
          const iconH = (fh / fw) * iconW
          const dx = this.x + this.width / 2 - iconW / 2
          const dy = this.y - iconH - 2
          _drawImageNoSmooth(ctx, img, sx, sy, fw, fh, dx, dy, iconW, iconH)
        }
      } catch (e) {}
    }
    // If spriteConfig defines per-animation objects (player-style), use that first
    const cfg = this.spriteConfig
    if (cfg && cfg.animations && typeof cfg.animations === 'object') {
      const facingToAnim = { down: 'walkDown', left: 'walkLeft', right: 'walkRight', up: 'walkUp' }
      const animName = facingToAnim[this.facing] || 'walkDown'
      const anim = cfg.animations[animName] || cfg.animations['walkDown'] || Object.values(cfg.animations)[0]

      if (anim) {
        const aFrameCount = anim.frameCount || this.frameCount
        const aw = anim.width || cfg.frameWidth || Math.floor(this.image.width / aFrameCount)
        const ah = anim.height || cfg.frameHeight || Math.floor(this.image.height / (cfg.directions || 4))

        // player-style uses vertical stacking for frames (same as `Player.draw`)
        const srcX = anim.x || 0
        const srcY = (anim.y || 0) + ah * this.currentFrame

        _drawImageNoSmooth(ctx, this.image, srcX, srcY, aw, ah, this.x, this.y, this.width, this.height)
        _drawDialogIcon(ctx)
        return
      }
    }

    // Fallback to generic spriteConfig handling (horizontal rows etc.)
    // Determine direction row index (assume sheet rows: down, left, right, up)
    const directionIndex = { down: 0, left: 1, right: 2, up: 3 }[this.facing] || 0
    let frameW = Math.floor(this.image.width / this.frameCount)
    let frameH = Math.floor(this.image.height / 4) || this.image.height
    let srcX = this.currentFrame * frameW
    let srcY = directionIndex * frameH

    if (cfg) {
      const frames = cfg.frameCount || this.frameCount
      const directions = cfg.directions || 4
      frameW = cfg.frameWidth || Math.floor(this.image.width / frames)
      frameH = cfg.frameHeight || Math.floor(this.image.height / directions)

      if (cfg.orientation === 'vertical') {
        srcX = (cfg.startX || 0) + (cfg.directionColumn || 0) * frameW
        srcY = (cfg.startY || 0) + this.currentFrame * frameH + directionIndex * frameH * frames
      } else {
        srcX = (cfg.startX || 0) + this.currentFrame * frameW
        srcY = (cfg.startY || 0) + directionIndex * frameH
      }
    }

    _drawImageNoSmooth(ctx, this.image, srcX, srcY, frameW, frameH, this.x, this.y, this.width, this.height)
    _drawDialogIcon(ctx)
  }

  // simple proximity check using squared distance
  isNear(player, threshold = 32) {
    const px = player.x + player.width / 2
    const py = player.y + player.height / 2
    const nx = this.x + this.width / 2
    const ny = this.y + this.height / 2
    const dx = px - nx
    const dy = py - ny
    return dx * dx + dy * dy <= threshold * threshold
  }

  getDialog(index) {
    return this.dialogues[index] || null
  }
}

window.NPC = NPC
