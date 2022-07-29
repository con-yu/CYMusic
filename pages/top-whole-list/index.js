// pages/top-whole-list/index.js
import {playerStore} from '../../store/index'
import { getRankingListAllSongs, getPlaylistAllSongs } from '../../service/api-music'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 加载提示
    wx.showLoading({
      title: '完整榜单加载中'
    })
    if (options.idx) {
      const idx = options.idx
      getRankingListAllSongs(idx).then(res => {
        this.setData({ songs: res.songs })
        // 请求完成后隐藏加载提示
        wx.hideLoading()
      })
    } else if (options.id) {
      const id = options.id
      getPlaylistAllSongs(id).then(res => {
        this.setData({ songs: res.songs })
        // 请求完成后隐藏加载提示
        wx.hideLoading()
      })
    }

  },

  handleSongItemClick(event){
    const index = event.currentTarget.dataset.index
    // console.log(index,this.data.songs);
    playerStore.setState('playListSongs',this.data.songs)
    playerStore.setState('playListIndex',index)
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})