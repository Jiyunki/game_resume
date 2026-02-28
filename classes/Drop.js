class Drop {
  constructor({
    x,
    y,
    imageSrc,
    // If width/height are omitted (null), we'll auto-size from the image
    // using `scale`. If one is provided and the other omitted, we preserve aspect ratio.
    width = null,
    height = null,
    scale = 0.6,
    velocity = { x: 0, y: 0 }, // px/sec
    collectDelay = 0.25, // seconds
    lifeTime = 30, // seconds before auto-remove/fade
  }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.scale = scale
    this.velocity = velocity
    this.collectDelay = collectDelay
    this.collectElapsed = 0
    this.collectible = collectDelay <= 0
    this.lifeTime = lifeTime
    this.elapsed = 0
    this.alpha = 1
    this.dead = false

    this.image = new Image()
    this.loaded = false
    this.image.onload = () => {
      this.loaded = true
      // If width/height were not provided, auto-compute using natural size and scale
      try {
        const iw = this.image.naturalWidth || this.image.width
        const ih = this.image.naturalHeight || this.image.height
        if (!this.width && !this.height) {
          this.width = Math.max(1, Math.round(iw * this.scale))
          this.height = Math.max(1, Math.round(ih * this.scale))
        } else if (this.width && !this.height) {
          // preserve aspect ratio
          this.height = Math.max(1, Math.round((this.width * ih) / iw))
        } else if (!this.width && this.height) {
          this.width = Math.max(1, Math.round((this.height * iw) / ih))
        }
      } catch (e) {
        // fallback to defaults if something goes wrong
        if (!this.width) this.width = 16
        if (!this.height) this.height = 16
      }
    }
    this.image.onerror = (e) => { console.error('Drop image failed to load:', imageSrc, e) }
    this.image.src = imageSrc
  }

  update(deltaTime) {
    if (!deltaTime) return
    // movement (px/sec)
    this.x += (this.velocity.x || 0) * deltaTime
    this.y += (this.velocity.y || 0) * deltaTime

    // collect delay
    if (!this.collectible) {
      this.collectElapsed += deltaTime
      if (this.collectElapsed >= this.collectDelay) this.collectible = true
    }

    // lifetime / fade
    this.elapsed += deltaTime
    if (this.elapsed > this.lifeTime) {
      this.alpha -= 0.5 * deltaTime
      if (this.alpha <= 0) this.dead = true
    }
  }

  draw(c) {
    if (!this.loaded) return
    c.save()
    c.globalAlpha = this.alpha
    // Ensure pixel-art stays crisp when scaled by disabling smoothing
    const prevSmoothing = (c.imageSmoothingEnabled !== undefined) ? c.imageSmoothingEnabled : true
    if (c.imageSmoothingEnabled !== undefined) c.imageSmoothingEnabled = false
    c.drawImage(this.image, this.x, this.y, this.width, this.height)
    if (c.imageSmoothingEnabled !== undefined) c.imageSmoothingEnabled = prevSmoothing
    c.restore()
  }

  collidesWith(entity) {
    return (
      this.x < entity.x + entity.width &&
      this.x + this.width > entity.x &&
      this.y < entity.y + entity.height &&
      this.y + this.height > entity.y
    )
  }
}