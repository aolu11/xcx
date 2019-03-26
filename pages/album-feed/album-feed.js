// pages/album-feed/album-feed.js
const app = getApp()
const api = require("../../utils/api.js")
const util = require("../../utils/util.js")

app.MyPage("/pages/album-feed/album-feed", {

  /**
   * 页面的初始数据
   */
  data: {
    album: {},
    feeds: [],
    feedsState: {
      lastScore: null,
      hasMore: true
    }
  },

  onNavigate(query) {
    const albumId = query.albumId
    this.$save('feeds', this.prefetchFeeds(albumId))
    this.$save('album', this.fetchTag(albumId))
  },
  render(name, data) {
    this.setData({
      [name]: data
    })
  },
  updateFeeds(albumId, lastScore) {
    return new Promise((resolve, reject) => {
      const param = {
        albumId
      }
      if (lastScore) {
        param.lastScore = lastScore
      }
      api.get("/feed/listByAlbum", param).then(feeds => {
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
  prefetchFeeds(albumId) {
    return new Promise((resolve, reject) => {
      const param = {
        albumId
      }
      api.get("/feed/listByAlbum", param).then(feeds => {
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
  updateTag(albumId) {
    return this.fetchTag(albumId).then(album => {
      this.render('album', album)
    })
  },
  fetchTag(albumId) {
    return new Promise((resolve, reject) => {
      const param = {
        id: albumId
      }
      api.get("/album/detail", param).then(album => {
        resolve(album)
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    const albumId = query.albumId
    this.$load("feeds") || this.updateFeeds(albumId)
    this.$load("album") || this.updateTag(albumId)
    this.$load("feedsState.hasMore")
    this.$load("feedsState.lastScore")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    this.updateFeeds(this.data.album.id).then(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.updateFeeds(this.data.album.id, this.data.feedsState.lastScore)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})