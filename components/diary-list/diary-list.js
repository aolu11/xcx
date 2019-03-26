// components/diary-list/diary-list.js
const app = getApp()

app.MyComponent({
  /**
   * 组件的属性列表
   */
  properties: {
    feeds: Array,
    hotTagsAds: Array,
    starAlbumCategoryAds: Array,
    page: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    gData: app.globalData
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onRandomStarAlbum() {
      this.triggerEvent('randomStarAlbum')
    }
  }
})
