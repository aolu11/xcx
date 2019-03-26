class ImgLoader {
  constructor(page, defaultCallback) {
    this.page = page
    this.defaultCallback = defaultCallback || function() {}
    this.callbacks = {}
    this.imgInfo = {}

    this.page.data.imgLoadQ = []
    this.page.onImgLoad = this.onImgLoad.bind(this)
    this.page.onImgError = this.onImgError.bind(this)
  }

  load(src, callback) {
    if (!src) {
      return
    }
    if (Array.isArray(src)) {
      for (const one of src) {
        load(one, callback)
      }
      return
    }
    const q = this.page.data.imgLoadQ
    const imgInfo = this.imgInfo[src]
    if (callback) {
      this.callbacks[src] = callback
    }

    // 已成功加载过
    if (imgInfo) {
      this.runCallback(null, {
        src,
        width: imgInfo.width,
        height: imgInfo.height
      })
      // 未加载，且不在队列中
    } else if (q.indexOf(src) === -1) {
      q.push(src)
      this.page.setData({imgLoadQ: q})
    }
    // 未加载，且已在队列中就说明处理过了，nop
  }

  onImgLoad(event) {
    const src = event.currentTarget.dataset.src
    const width = event.detail.width
    const height = event.detail.height
    this.imgInfo[src] = {width, height}
    this.removeFromQ(src)
    this.runCallback(null, {src, width, height})
  }

  onImgError(event) {
    const src = event.currentTarget.dataset.src
    this.removeFromQ(src)
    this.runCallback("image load failed", {src})
  }

  removeFromQ(src) {
    const q = this.page.data.imgLoadQ
    q.splice(q.indexOf(src), 1)
    this.page.setData({imgLoadQ: q})
  }

  runCallback(err, data) {
    const callback = this.callbacks[data.src] || this.defaultCallback
    callback(err, data)
    delete this.callbacks[data.src]
    setTimeout(() => {
      delete this.imgInfo[data.src]
    }, 3000)
  }
}

module.exports = ImgLoader