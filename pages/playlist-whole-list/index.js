// pages/playlist-whole-list/index.js
import {playerStore} from '../../store/index'
import {getPlaylistAllSongs,getPlaylistsDetail} from '../../service/api-music'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playlistDetail:{},
    songs:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '歌单加载中',
    })
    const id = options.playlistId
    // 获取歌单详细信息
    getPlaylistsDetail(id).then(res=>{
      this.setData({playlistDetail:res.playlist})
    })   
    // 获取歌单所有歌曲
    getPlaylistAllSongs(id).then(res=>{
      this.setData({songs:res.songs})
      wx.hideLoading()
    })   
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