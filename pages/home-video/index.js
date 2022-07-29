// pages/home-video/index.js
import { getTopMv } from "../../service/api-video"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    topMvs: [],
    hasMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   * aysnc await
   */
  onLoad(options) {
    this.getTopMvData(0)
  },

  // 封装网络请求方法
  async getTopMvData(offset) {
    // 加载提示
    wx.showLoading({
      title: '加载中',
    })
    // 判断是否可以请求
    if (!this.data.hasMore) return

    //  展示加载动画
    wx.showNavigationBarLoading()

    // 请求数据
    const res = await getTopMv(offset)
    let newData = this.data.topMvs
    if (offset === 0) {
      newData = res.data
    } else {
      newData = newData.concat(res.data)
    }

    // 设置数据
    this.setData({ topMvs: newData })
    this.setData({ hasMore: res.hasMore })

    // 停止加载动画
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
    wx.hideLoading()

  },
  // 封装事件处理方法
  handleVideoClick(event) {
    // 获取id
    const id = event.currentTarget.dataset.item.id
    // 页面跳转
    wx.navigateTo({
      url: '/pages/detail-video/index?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.getTopMvData(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.getTopMvData(this.data.topMvs.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() { },
})
