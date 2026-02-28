class Heart {
  constructor({ x, y }) {
    this.x = x
    this.y = y
    this.width = 20
    this.height = 20
    this.center = {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    }

    this.loaded = false
    this.image = new Image()
    this.image.onload = () => {
      this.loaded = true
    }
    this.image.src = './images/heart.png'
    this.currentFrame = 4

    this.currentSprite = {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
      frameCount: 4,
    }
  }

  draw(c) {
    if (!this.loaded) return
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
      } finally {
        try {
          ctx.restore()
        } catch (e) {}
      }
    }

    _drawImageNoSmooth(
      c,
      this.image,
      this.currentSprite.x + this.currentSprite.width * this.currentFrame,
      this.currentSprite.y,
      this.currentSprite.width,
      this.currentSprite.height,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }
}
