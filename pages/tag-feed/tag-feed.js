// pages/tag-feed/tag-feed.js
const app = getApp()
const api = require("../../utils/api.js")
const util = require("../../utils/util.js")

app.MyPage("/pages/tag-feed/tag-feed", {

  /**
   * 页面的初始数据
   */
  data: {
    tag: {},
    feeds: [],
    feedsState: {
      lastScore: null,
      hasMore: true
    }
  },

  onNavigate(query) {
    const tid = query.tid
    this.$save('feeds', this.prefetchFeeds(tid))
    this.$save('tag', this.fetchTag(tid))
  },
  render(name, data) {
    this.setData({
      [name]: data
    })
  },
  updateFeeds(tid, lastScore) {
    return new Promise((resolve, reject) => {
      const param = {
        tid
      }
      if (lastScore) {
        param.lastScore = lastScore
      }
      api.get("/feed/listByTag", param).then(feeds => {
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
  prefetchFeeds(tid) {
    return new Promise((resolve, reject) => {
      const param = {
        tid
      }
      api.get("/feed/listByTag", param).then(feeds => {
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
  updateTag(tid) {
    return this.fetchTag(tid).then(tag => {
      this.render('tag', tag)
    })
  },
  fetchTag(tid) {
    return new Promise((resolve, reject) => {
      const param = {
        id: tid
      }
      api.get("/tag/detail", param).then(tag => {
        resolve(tag)
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    const tid = query.tid
    this.$load("feeds") || this.updateFeeds(tid)
    this.$load("tag") || this.updateTag(tid)
    this.$load("feedsState.hasMore")
    this.$load("feedsState.lastScore")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const tagName = this.data.tag.name
    if (tagName) {
      wx.setNavigationBarTitle({
        title: '#' + tagName,
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
    this.updateFeeds(this.data.tag.id).then(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.updateFeeds(this.data.tag.id, this.data.feedsState.lastScore)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})