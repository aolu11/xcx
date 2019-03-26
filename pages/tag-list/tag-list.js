// pages/tag-list/tag-list.js
const app = getApp()
const api = require("../../utils/api.js")
const util = require("../../utils/util.js")

app.MyPage("/pages/tag-list/tag-list", {
  data: {
    tags: [],
    type: "",
    gData: app.globalData
  },
  onNavigate(query) {
    const type = query.type
    const mid = query.mid
    this.$save('tags', this.prefetchTags(type, mid))
  },
  render(name, data) {
    this.setData({
      [name]: data
    })
  },
  updateTags(type, mid) {
    const url = type === 'hot' ? '/tag/listHot' : '/tag/list'
    const param = type === 'hot' ? {} : {mid}
    return new Promise((resolve, reject) => {
      api.get(url, param).then(tags => {
        this.render('tags', tags)
        resolve(tags)
      })
    })
  },
  prefetchTags(type, mid) {
    const url = type === 'hot' ? '/tag/listHot' : '/tag/list'
    const param = type === 'hot' ? {} : { mid }
    return new Promise((resolve, reject) => {
      api.get(url, param).then(tags => {
        resolve(tags)
      })
    })
  },
  onLoad(query) {
    this.$load('tags') || this.updateTags()
    this.render('type', query.type)
  },
  onReady() {
    let title = ''
    if (this.data.type === 'hot') {
      title = '热门话题'
    } else if (this.data.type === 'mood') {
      title = '全部话题'
    }
    wx.setNavigationBarTitle({title})
  }
})