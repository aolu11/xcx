// components/gallery/gallery.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgs: Array,
    source: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    galleryImgClass: []
  },
  observers: {
    "imgs, source": function(imgs, source) {
      let imgClass = "gallery-img"
      if (source === "list") {
        imgClass += " gallery-img-list"
      } else if (source === "detail") {
        imgClass += " gallery-img-detail"
      }
      this.setData({
        galleryImgClass: Array(imgs.length).fill(imgClass)
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onImageTap(event) {
      const self = this
      const width = app.globalData.systemInfo.screenWidth
      const height = app.globalData.systemInfo.screenHeight
      const index = event.currentTarget.dataset.index
      const urls = this.properties.imgs.map(img => self.formatQiniuUrl(img.url, width, height))
      wx.previewImage({
        urls,
        current: urls[index], width, height
      })
    },
    formatQiniuUrl(key, width, height) {
      return `${key}?imageView2/2/w/${width * 2}/h/${height * 2}`
    }
  }
})