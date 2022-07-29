// components/song-item-v1/index.js
import { playerStore } from '../../store/index'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSongItemClick: function () {
      const id = this.properties.item.id
      // 1.页面跳转
      wx.navigateTo({
        url: '/pages/music-player/index?id=' + id,
      })
      // 2.歌曲数据请求和其他操作
      playerStore.dispatch("playMusicWithSongIdAction", { id })
      // 3.获取播放列表/当前播放索引

    }
  }
})
