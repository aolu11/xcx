// components/tab-grid-swiper.js
const app = getApp()
const api = require("../../utils/api.js")
const util = require("../../utils/util.js")

app.MyComponent({
  /**
   * 组件的属性列表
   */
  properties: {
    moods: Array,
    col: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    moodsView: [],
    underscorePosClass: "",
    swiperCurrent: 0,
    tabLiClass:["active"],
    swiperHeight: "280rpx"
  },

  observers: {
    "moods, col": function(moods, col) {
      this.setData({
        moodsView: util.moods2View(moods, col)
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSwiperChange(event) {
      const current = event.detail.current
      const tabLiClass = new Array(6);
      tabLiClass[current] = "active"
      let moodRowNum = 2
      if (current > 0) {
        moodRowNum = this.data.moodsView[current].list.length
        if (!(moodRowNum > 0)) {
          moodRowNum = 1
        }
      }
      this.setData({
        underscorePosClass: "p" + current,
        tabLiClass,
        swiperHeight: (140 * (moodRowNum > 0 ? moodRowNum : 1)) + "rpx"
      })
    },
    onTabTap(event) {
      if (undefined !== event.target.dataset.pos) {
        this.setData({
          swiperCurrent: Number.parseInt(event.target.dataset.pos)
        })
      }
    }
  }
})