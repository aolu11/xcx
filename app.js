//app.js
const api = require("./utils/api.js")

App({
  globalData: {
    systemInfo: null,
    pages: [],
    moods: [],
    feedAdsIndex: {
      starAlbumCategory: 0,
      secondStarAlbumCategory: 1,
      hotTags: 2
    },
    img: {
      male: "/img/male.svg",
      female: "/img/female.svg",
      like: "/img/like.svg",
      comment: "/img/comment.svg",
      like_thick: "/img/like_thick.svg",
      comment_thick: "/img/comment_thick.svg",
      album: "/img/album.svg",
      hot_tag: "/img/hot_tag.svg",
      star_album: "/img/star_album.svg",
      hot: "/img/hot.svg"
    },
  },
  onLaunch() {
    const app = this
    wx.getSystemInfo({
      success: function(res) {
        app.globalData.systemInfo = res
      },
      fail: function(res) {
        console.log("getSystemInfo failed")
      }
    })
  },
  onShow() {
    this.boot()
  },
  boot() {
    api.get("/system/config")
      .then(data => {
        this.globalData.feedAdsIndex.starAlbumCategory = data.hotFeedIndex.starAlbumCategory
        this.globalData.feedAdsIndex.secondStarAlbumCategory = data.hotFeedIndex.secondStarAlbumCategory
        this.globalData.feedAdsIndex.hotTags = data.hotFeedIndex.hotTags
      })
  },
  $route(uri, query) {
    let url = uri
    const queryArr = []
    if (query) {
      for (const k in query) {
        queryArr.push(`${k}=${query[k]}`)
      }
      url += '?' + queryArr.join('&')
    }
    const customPage = this.globalData.pages[uri]
    if (customPage && customPage.onNavigate) {
      customPage.onNavigate(query)
      setTimeout(() => {
        wx.navigateTo({
          url,
        })
      }, 100)
    } else {
      wx.navigateTo({
        url,
      })
    }
  },

  MyPage(route, obj) {
    const app = this
    this.globalData.pages[route] = obj
    obj.preload = {}
    obj.$save = function(name, promise) {
      obj.preload[name] = promise
    }
    obj.$load = function(name) {
      const realPage = this
      if (!(obj.preload[name])) {
        return false
      }
      obj.preload[name].then(data => {
        realPage.render(name, data)
        delete obj.preload[name]
      })
      return true
    },
    obj.$eventJump = function(event) {
      const dataset = event.currentTarget.dataset
      app.$route(dataset.uri, dataset.query)
    }
    Page(obj)
  },
  MyComponent(obj) {
    const app = this
    if (!obj.methods) {
      obj.methods = {}
    }
    obj.methods.$eventJump = function (event) {
      const dataset = event.currentTarget.dataset
      app.$route(dataset.uri, dataset.query)
    }
    Component(obj)
  }
})