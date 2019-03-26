// pages/mood-feed/mood-feed.js
const app = getApp()
const api = require("../../utils/api.js")
const util = require("../../utils/util.js")

app.MyPage("/pages/mood-feed/mood-feed", {

  /**
   * 页面的初始数据
   */
  data: {
    mood: {},
    feeds: [],
    topTags: [],
    feedsState: {
      lastScore: null,
      hasMore: true
    }
  },

  onNavigate(query) {
    const mid = query.mid
    this.$save('feeds', this.prefetchFeeds(mid))
    this.$save('mood', this.fetchMood(mid))
    this.$save('topTags', this.fetchTopTags(mid))
  },
  render(name, data) {
    this.setData({
      [name]: data
    })
  },
  updateFeeds(mid, lastScore) {
    return new Promise((resolve, reject) => {
      const param = {
        mid
      }
      if (lastScore) {
        param.lastScore = lastScore
      }
      api.get("/feed/list", param).then(feeds => {
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
  prefetchFeeds(mid) {
    return new Promise((resolve, reject) => {
      const param = {
        mid
      }
      api.get("/feed/list", param).then(feeds => {
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
  updateMood(mid) {
    return this.fetchMood(mid).then(mood => {
      this.render('mood', mood)
    })
  },
  fetchMood(mid) {
    return new Promise((resolve, reject) => {
      const param = {
        id: mid
      }
      api.get("/mood/detail", param).then(mood => {
        resolve(mood)
      })
    })
  },
  updateTopTags(mid) {
      return this.fetchTopTags(mid).then(topTags => {
        this.render('topTags', topTags)
      })
  },
  fetchTopTags(mid) {
    return new Promise((resolve, reject) => {
      const param = {
        mid
      }
      api.get("/tag/listTop", param).then(topTags => {
        resolve(topTags)
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(query) {
    const mid = query.mid
    this.$load("feeds") || this.updateFeeds(mid)
    this.$load("mood") || this.updateMood(mid)
    this.$load("topTags") || this.updateTopTags(mid)
    this.$load("feedsState.hasMore")
    this.$load("feedsState.lastScore")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    const moodName = this.data.mood.name
    if (moodName) {
      wx.setNavigationBarTitle({
        title: moodName + "之海",
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.updateFeeds(this.data.mood.id).then(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.updateFeeds(this.data.mood.id, this.data.feedsState.lastScore)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})