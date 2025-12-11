class NPC {
  constructor({ x, y, tileIndex, tileSize = 16, image = null, dialogues = [] }) {
    this.x = x
    this.y = y
    this.tileIndex = tileIndex // 1-based index in the characters tileset
    this.tileSize = tileSize
    this.image = image // an Image instance (characters.png)
    this.width = tileSize
    this.height = tileSize
    this.dialogues = dialogues
  }

  draw(ctx) {
    if (!this.image) return
    if (this.tileIndex === 0) return

    const tilesPerRow = Math.floor(this.image.width / this.tileSize)
    const index = this.tileIndex - 1
    const srcX = (index % tilesPerRow) * this.tileSize
    const srcY = Math.floor(index / tilesPerRow) * this.tileSize

    ctx.drawImage(
      this.image,
      srcX,
      srcY,
      this.tileSize,
      this.tileSize,
      this.x,
      this.y,
      this.width,
      this.height
    )
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
