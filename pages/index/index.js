//index.js
//获取应用实例
const app = getApp()
const api = require("../../utils/api.js")
const util = require("../../utils/util.js")

Page({
  data: {
    moods: [],
    starAlbumCategory: [],
    feeds: [],
    feedsState: {
      lastScore: null,
      hasMore: true
    }
  },
  onLoad: function() {
    this.updateMoods()
    this.updateFeedsFirstPage()
  },
  onPullDownRefresh() {
    this.updateFeedsFirstPage().then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    this.updateFeeds(this.data.feedsState.lastScore)
  },
  updateFeedsFirstPage() {
    return Promise.all([this.fetchFeeds(), this.fetchHotTags(), this.fetchRandomStarAlbums()])
      .then(([feeds, hotTags, starAlbums]) => {
        const feedAdsIndex = app.globalData.feedAdsIndex
        const hotTagsFeed = {
          id: "feedAdsHotTagId",
          tags: hotTags.slice(0, 6),
          type: 2
        }
        const starAlbumFeed = {
          id: "feedAdsStarAlbumId",
          albums: starAlbums,
          type: 3
        }
        feeds.splice(feedAdsIndex.hotTags, 0, hotTagsFeed)
        feeds.splice(feedAdsIndex.starAlbumCategory, 0, starAlbumFeed)
        this.setData({
          feeds
        })
      })
  },
  updateMoods() {
    api.get("/mood/listAll/V2").then(data => {
      const moods = []
      moods[0] = data[1]
      moods[1] = data[2].listAll[0]
      moods[2] = data[2].listAll[1]
      moods[3] = data[2].listAll[2]
      moods[4] = data[2].listAll[3]
      moods[5] = data[0]
      this.setData({
        moods
      })
      app.globalData.moods = moods
    })
  },
  fetchFeeds(lastScore) {
    return new Promise((resolve, reject) => {
      const param = {}
      if (lastScore) {
        param.lastScore = lastScore
      }
      api.get("/feed/listHot", param).then(feeds => {
        if (feeds.length === 0) {
          this.data.feedsState.hasMore = false
          return
        }
        for (const feed of feeds) {
          feed.type = 1
        }
        this.data.feedsState.lastScore = feeds[feeds.length - 1].score
        resolve(feeds)
      })
    })
  },
  updateFeeds(lastScore) {
    return this.fetchFeeds(lastScore).then(feeds => {
      if (lastScore) {
        this.setData(util.getUpdateArrayData("feeds", feeds, this.data.feeds.length))
      } else {
        this.setData({
          feeds
        })
      }
    })
  },
  fetchHotTags() {
    return new Promise((resolve, reject) => {
      api.get("/tag/listHot").then(tags => {
        resolve(tags)
      })
    })
  },
  fetchRandomStarAlbums() {
    return new Promise((resolve, reject) => {
      api.get("/album/starRandom").then(albums => {
        resolve(albums)
      })
    })
  },
  onRandomStarAlbum() {
    this.fetchRandomStarAlbums().then(starAlbums => {
      const index = app.globalData.feedAdsIndex.starAlbumCategory
      this.setData({
        [`feeds[${index}].albums`]: starAlbums
      })
    }) 
  }
})