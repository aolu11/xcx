// pages/diary-detail/diary-detail.js
const app = getApp()
const api = require("../../utils/api.js")
const util = require("../../utils/util.js")

app.MyPage("/pages/diary-detail/diary-detail", {

  /**
   * 页面的初始数据
   */
  data: {
    imgLoadQ: [],
    gData: app.globalData,
    diary: {},
    comments: [],
    commentsState: {
      lastScore: null,
      hasMore: true
    }
  },

  onNavigate(query) {
    const id = query.id
    this.$save('comments', this.prefetchComments(id))
    this.$save('diary', this.fetchDiary(id))
  },
  render(name, data) {
    this.setData({
      [name]: data
    })
  },
  updateComments(did, lastScore) {
    return new Promise((resolve, reject) => {
      const param = {
        did
      }
      if (lastScore) {
        param.lastScore = lastScore
      }
      api.get("/comment/list", param).then(comments => {
        if (comments.length === 0) {
          this.data.commentsState.hasMore = false
          return
        }
        this.data.commentsState.lastScore = comments[comments.length - 1].score
        if (lastScore) {
          this.setData(util.getUpdateArrayData("comments", comments, this.data.comments.length))
        } else {
          this.render('comments', comments)
        }
        resolve(comments)
      })
    })
  },
  prefetchComments(did) {
    return new Promise((resolve, reject) => {
      const param = {
        did
      }
      api.get("/comment/list", param).then(comments => {
        if (comments.length === 0) {
          this.$save('commentsState.hasMore', Promise.resolve(false))
          return
        }
        this.$save('commentsState.lastScore', Promise.resolve(comments[comments.length - 1].score))
        resolve(comments)
      })
    })
  },
  updateDiary(id) {
    return this.fetchDiary(id).then(diary => {
      this.render('diary', diary)
    })
  },
  fetchDiary(id) {
    return new Promise((resolve, reject) => {
      const param = {
        id
      }
      api.get("/diary/detail", param).then(diary => {
        resolve(diary)
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    const id = query.id
    this.$load("comments") || this.updateComments(id)
    this.$load("diary") || this.updateDiary(id)
    this.$load("commentsState.hasMore")
    this.$load("commentsState.lastScore")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const moodName = this.data.diary.mood && this.data.diary.mood.name
    if (moodName) {
      wx.setNavigationBarTitle({
        title: moodName,
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
    console.log('onPullDownRefresh')
    /*
    this.updateComments(this.data.tag.id).then(() => {
      wx.stopPullDownRefresh()
    })
    */
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    /*
    this.updateFeeds(this.data.tag.id, this.data.feedsState.lastScore)
    */
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})