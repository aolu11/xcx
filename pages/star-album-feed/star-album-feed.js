// pages/star-album-feed/star-album-feed.js
const app = getApp()
const api = require("../../utils/api.js")
const util = require("../../utils/util.js")

app.MyPage("/pages/star-album-feed/star-album-feed", {

  /**
   * 页面的初始数据
   */
  data: {
    starAlbum: {},
    feeds: [],
    feedsState: {
      lastScore: null,
      hasMore: true
    }
  },

  onNavigate(query) {
    const starAlbumId = query.id
    this.$save('feeds', this.prefetchFeeds(starAlbumId))
  },
  render(name, data) {
    this.setData({
      [name]: data
    })
  },
  updateFeeds(starAlbumId, lastScore) {
    return new Promise((resolve, reject) => {
      const param = {
        starAlbumCategoryId: starAlbumId
      }
      if (lastScore) {
        param.lastScore = lastScore
      }
      api.get("/feed/listByStarAlbumCategory", param).then(feeds => {
        if (feeds.length === 0) {
          this.data.feedsState.hasMore = false
          return
        }
        for (const feed of feeds) {
          feed.type = 1
        }
        this.data.feedsState.lastScore = feeds[feeds.length - 1].score
        if (lastScore) {
          this.setData(util.getUpdateArrayData("feeds", feeds, this.data.feeds.length))
        } else {
          this.render('feeds', feeds)
        }
        resolve(feeds)
      })
    })
  },
  prefetchFeeds(starAlbumId) {
    return new Promise((resolve, reject) => {
      const param = {
        starAlbumCategoryId: starAlbumId
      }
      api.get("/feed/listByStarAlbumCategory", param).then(feeds => {
        if (feeds.length === 0) {
          this.$save('feedsState.hasMore', Promise.resolve(false))
          return
        }
        for (const feed of feeds) {
          feed.type = 1
        }
        this.$save('feedsState.lastScore', Promise.resolve(feeds[feeds.length - 1].score))
        resolve(feeds)
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    const starAlbumId = query.id
    const starAlbumName = query.name
    this.render("starAlbum.id", starAlbumId)
    this.render("starAlbum.name", starAlbumName)
    this.$load("feeds") || this.updateFeeds(starAlbumId)
    this.$load("feedsState.hasMore")
    this.$load("feedsState.lastScore")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const starAlbumName = this.data.starAlbum.name
    if (starAlbumName) {
      wx.setNavigationBarTitle({
        title: starAlbumName,
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.updateFeeds(this.data.starAlbum.id).then(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.updateFeeds(this.data.starAlbum.id, this.data.feedsState.lastScore)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})