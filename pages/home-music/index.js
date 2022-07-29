// pages/home-music/index.js
import { playerStore } from '../../store/index'
import { getBanners, getHotPlaylist, getToplist, getRankingListAllSongs } from '../../service/api-music'
// import { getState } from '../../service/api-login'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'

// 生成节流函数
const throttleQueryRect = throttle(queryRect, 1000, { trailing: true })

Page({
  data: {
    swiperHeight: 0,
    banners: [],
    hotPlaylists: [],

    // 巅峰榜单(飙升/新歌/原创)
    rankings: [],

    // 热歌前十
    top10HotSongs: [],

    // 正在播放的歌曲
    currentSong: {},
    isPlaying: false,
    playAnimationState: 'paused'
  },

  onLoad() {
    // 初始化页面数据
    this.getPageData()
    this.setupPlayerStoreListener()
  },

  setupPlayerStoreListener() {
    playerStore.onStates(['currentSong', 'isPlaying'], ({ currentSong, isPlaying }) => {
      if (currentSong) this.setData({ currentSong })
      if (isPlaying !== undefined) {
        this.setData({ isPlaying, playAnimationState: isPlaying ? 'running' : 'paused' })
      }
    })
  },

  // 网络请求
  getPageData() {
    // 加载提示
    wx.showLoading({
      title: '加载中',
    })

    // 获取轮播图
    getBanners().then(res => {
      this.setData({ banners: res.banners })
    })

    // 获取各类巅峰榜单信息
    getToplist().then(res => {
      var rankings = []
      for (let i = 0; i < 4; i++) {
        let rankingI = res.list[i]
        rankings.push(rankingI)
      }
      this.setData({ rankings: rankings })
    })

    // 获取热歌榜top10
    getRankingListAllSongs(3).then(res => {
      this.setData({ top10HotSongs: res.songs.slice(0, 10) })
    })

    // 获取热门歌单(默认50条 此处获取30条)
    getHotPlaylist(30).then(res => {
      this.setData({ hotPlaylists: res.playlists })
      // 请求数据成功后隐藏加载提示
      wx.hideLoading()
    })


  },

  // 事件处理

  // 跳转到搜索详情页
  handleClickSearch() {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },
  handleSwiperImgLoaded() {
    // 获取图片的高度
    throttleQueryRect('.swiper-img').then(res => {
      const rect = res[0]
      if (rect) {
        this.setData({ swiperHeight: rect.height })
      }
    })
  },
  // 从热门歌曲跳转到巅峰榜详情页
  handleClickTopMore(event) {
    const idx = event.currentTarget.dataset.idx
    wx.navigateTo({
      url: '/pages/top-whole-list/index?idx=' + idx,
    })
  },
  // 从巅峰榜模块跳转到巅峰榜详情页
  handleClickToplist(event) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/top-whole-list/index?id=' + id,
    })
  },
  // 跳转到歌单详情页
  handleClickPlaylist(playlistId) {
    wx.navigateTo({
      url: '/pages/playlist-whole-list/index?playlistId=' + playlistId,
    })
  },
  // 点击热门歌曲
  handleSongItemClick(event) {
    const index = event.currentTarget.dataset.index
    // console.log(index,this.data.top10HotSongs);
    playerStore.setState('playListSongs', this.data.top10HotSongs)
    playerStore.setState('playListIndex', index)
  },
  // 点击播放栏 播放按钮
  handlePlayBtnClick() {
    playerStore.dispatch('changePlayingStatusAction', !this.data.isPlaying)
  },
  // 点击播放栏
  handleBarClick() {
    const id = this.data.currentSong.id
    wx.navigateTo({
      url: '/pages/music-player/index?id=' + id,
    })
  }
})