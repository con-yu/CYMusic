// pages/recommend-video/index.js
import { getVideoUrl, getVideoDetail,getRelatedVideo } from '../../service/api-video'
import formatTimestamp from '../../utils/foramtTimestamp'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoUrl: '',
    videoDetail:{},
    publishTime:'',
    relatedVideos:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id
    getVideoUrl(id).then(res => {
      this.setData({ videoUrl: res.urls[0].url })
    })
    getVideoDetail(id).then(res=>{
      const date= formatTimestamp(res.data.publishTime)
      this.setData({publishTime:date})
      this.setData({videoDetail:res.data})
    })
    getRelatedVideo(id).then(res=>{
      this.setData({relatedVideos:res.data})
    })
  },

  // * 事件处理👇

  // 在推荐视频页面里再次点击推荐视频
  recommendVideoClick(event){
    // 获取点击的新视频的id
    const id = event.currentTarget.dataset.id
    //  重定向到 recommend-video页面 
    wx.redirectTo({
      url: '/pages/recommend-video/index?id=' + id,
    })
  }
})