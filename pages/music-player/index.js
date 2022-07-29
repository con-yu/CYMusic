// 由于当前播放器在首页和后台页都要展示  故需数据共享
// pages/music-player/index.js
// import { getSongDetail, getLyric } from '../../service/api-player'
// import { parseLyric } from '../../utils/parse-lyric'
import { audioContext, playerStore } from '../../store/index'

const palyModeNames = ['order', 'repeat', 'random']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    contentHeight: 0,
    currentSong: {},
    isLyricPage: false,

    // ===================
    lyricInfos: [],
    currentLyricIndex: 0,
    currentLyricText: '',
    duration: 0,
    currentTime: 0,
    sliderValue: 0,
    isSliderChanging: false,
    lyricScrollTop: 0,

    // ====================
    playModeIndex: 0,
    playModeName: 'order',
    isPlaying: false,
    playingName: 'pause'
  },

  onLoad(options) {
    // 1.获取传入的id
    const id = options.id
    this.setData({ id })
    // 2.根据id获取页面数据(单页面获取数据已弃用，改为从共享数据store获取)
    // this.getPageData(id)
    this.setupPlayerStoreListener()
    // 3.动态计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    // 内容高度 = 屏幕高度 - 状态栏高度 - 导航栏高度 
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({ contentHeight })

    // 4.设置播放器
    // // 停止前一首音乐(如果有)
    // audioContext.stop()
    // // 播放新的歌曲
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // audioContext.autoplay = true

    // ========开始监听播放器============
    this.setupAudioContextListener()
  },

  // ===========网络请求================  
  // getPageData(id) {
  //   // 获取当前歌曲信息
  //   getSongDetail(id).then(res => {
  //     this.setData({ currentSong: res.songs[0], duration: res.songs[0].dt })
  //   })

  //   // 获取当前歌曲歌词
  //   getLyric(id).then(res => {
  //     const LyricStr = res.lrc.lyric
  //     const lyricInfos = parseLyric(LyricStr)
  //     this.setData({ lyricInfos })
  //   })
  // },

  // ===========事件监听================
  setupAudioContextListener() {
    // 监听歌曲可以播放时
    audioContext.onCanplay(() => {
      audioContext.play()
    })

    // 监听播放过程中
    audioContext.onTimeUpdate(() => {
      // 获取当前时间和进度条的进度
      const currentTime = audioContext.currentTime * 1000
      const sliderValue = currentTime / this.data.duration * 100
      if (!this.data.isSliderChanging) {
        this.setData({ currentTime, sliderValue })
      }
      // 根据当前时间查找对应的歌词
      for (let i = 0; i < this.data.lyricInfos.length; i++) {
        const lyricInfo = this.data.lyricInfos[i]
        if (currentTime < lyricInfo.time) {
          let currentIndex = i - 1
          // 如果当前歌词文本为空(歌词文件不为空时，如纯音乐) 继续沿用上一个文本
          if (!this.data.lyricInfos[currentIndex].lyricText) {
            currentIndex--
          }
          // 如果索引值相同  停止执行 防止频繁刷新
          if (this.data.currentLyricIndex !== currentIndex) {
            const currentLyricInfo = this.data.lyricInfos[currentIndex]
            // console.log(currentLyricInfo.lyricText);
            this.setData({
              currentLyricText: currentLyricInfo.lyricText,
              currentLyricIndex: currentIndex,
              lyricScrollTop: currentIndex * 35
            })
          }
          break
        }
      }
    })

    // 监听播放完成
    audioContext.onEnded(() => {
      this.handleBtnNextClick()
    })
  },


  // ===========事件处理=====================
  hanldeBackClick() {
    wx.navigateBack()
  },
  handleSwiperChange() {
    const newState = !(this.data.isLyricPage)
    this.setData({ isLyricPage: newState })
  },
  handleSliderChange(event) {
    // 获取进度条点击的值
    const value = event.detail.value
    const duration = this.data.duration
    const targetTime = value / 100 * duration
    // 暂停音乐 然后播放目标位置
    // audioContext.pause()
    audioContext.seek(targetTime / 1000)
    // 记录sliderValue
    this.setData({ sliderValue: value, isSliderChanging: false })
  },
  handleSliderChanging(event) {
    const value = event.detail.value
    const currentTime = this.data.duration * value / 100
    this.setData({ isSliderChanging: true, currentTime, sliderValue: value })
    // 进度条归位时将 isSliderChanging 改回 false  (见handleSliderChange最后一行)👆
  },
  handleModeClick() {
    //  计算最新的playModeIndex
    let playModeIndex = this.data.playModeIndex + 1
    if (playModeIndex === 3) playModeIndex = 0

    playerStore.setState('playModeIndex', playModeIndex)
  },
  handlePlayingClick() {
    playerStore.dispatch('changePlayingStatusAction', !this.data.isPlaying)
  },
  handleBtnPrevClick() {
    playerStore.dispatch('changeNewMusicAction', false)
  },
  handleBtnNextClick() {
    playerStore.dispatch('changeNewMusicAction')
  },

  // 从共享数据仓库获取歌曲信息
  setupPlayerStoreListener() {
    // 监听当前歌曲和歌词相关的数据
    playerStore.onStates(['currentSong', 'duration', 'lyricInfos'], ({
      currentSong,
      duration,
      lyricInfos }) => {
      if (currentSong) this.setData({ currentSong })
      if (duration) this.setData({ duration })
      if (lyricInfos) this.setData({ lyricInfos })
    })

    // 监听播放模式相关的数据
    playerStore.onStates(['playModeIndex', 'isPlaying'], ({ playModeIndex, isPlaying }) => {
      if (playModeIndex !== undefined) {
        this.setData({ playModeIndex, playModeName: palyModeNames[playModeIndex], isPlaying })
      }
      if (isPlaying !== undefined) {
        this.setData({
          isPlaying,
          playingName: isPlaying ? 'pause' : 'resume'
        })
      }
    })
  },
  onUnload() {

  },

})