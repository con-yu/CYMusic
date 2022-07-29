// pages/detail-video/index.js
import { getMvUrl, getMvDetail, getRelatedVideo } from '../../service/api-video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvUrlInfo: {},
    mvDetail: {},
    relatedVideos: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 获取传入的id
    const id = options.id
    // 获取页面数据
    this.getPageData(id)
  },

  getPageData(id){
    // 请求播放地址 
    getMvUrl(id).then(res => {     
      this.setData({ mvUrlInfo: res.data })
    })
    // 请求视频信息
    getMvDetail(id).then(res => {
      this.setData({ mvDetail: res.data })
    })
    // 请求相关视频
    getRelatedVideo(id).then(res => {
      this.setData({ relatedVideos: res.data })
    })
  },

  recommendVideoClick(event){
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/recommend-video/index?id=' + id,
    })
  }
})