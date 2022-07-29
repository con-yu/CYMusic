// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getLyric } from '../service/api-player'
import { parseLyric } from '../utils/parse-lyric'

const playerStore = new HYEventStore({
  state: {
    id: 0,
    currentSong: {},
    duration: 0,
    lyricInfos: [],

    isPlaying: false,

    playModeIndex: 0, // 0.顺序播放 1.单曲循环 2.随机播放 
    playListSongs: [],
    playListIndex: 0

  },
  actions: {
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      // 当再次点击播放中歌曲
      if (ctx.id === id && !isRefresh) {
        // 重置为播放状态
        this.dispatch("changePlayingStatusAction", true)
        return
      }
      ctx.id = id
      // 0.修改播放的状态,并初始化播放界面
      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.duration = 0
      ctx.lyricInfos = []
      // 1.根据id获取歌曲信息
      // 获取当前歌曲信息
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.duration = res.songs[0].dt
        audioContext.title = res.songs[0].name
      })

      // 获取当前歌曲歌词
      getLyric(id).then(res => {
        const LyricStr = res.lrc.lyric
        const lyricInfos = parseLyric(LyricStr)
        ctx.lyricInfos = lyricInfos
      })

      // 播放歌曲
      // 停止前一首音乐(如果有)
      audioContext.stop()
      // 播放新的歌曲
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title = id
      audioContext.autoplay = true
    },
    changePlayingStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying
      if (ctx.isPlaying) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = ctx.currentSong.name
      }
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },
    changeNewMusicAction(ctx, isNext = true) {
      // 获取当前播放索引
      let index = ctx.playListIndex

      // 根据当前播放模式获取下一首歌的索引
      switch (ctx.playModeIndex) {
        case 0:// 顺序播放
          isNext ? index++ : index--
          // 列表末尾<=>列表开始
          if (isNext) {
            if (index === ctx.playListSongs.length) index = 0
          } else {
            if (index === -1) index = ctx.playListSongs.length - 1
          }
          break
        case 1:// 单曲循环
          break
        case 2://随机播放
          index = Math.floor(Math.random() * ctx.playListSongs.length)
          break;
      }

      // 获取下一首歌
      let currentSong = ctx.playListSongs[index]
      if (!currentSong) {
        currentSong = ctx.currentSong
      } else {
        // 更新当前索引
        ctx.playListIndex = index
      }

      // 播放新的歌曲
      this.dispatch('playMusicWithSongIdAction', { id: currentSong.id, isRefresh: true })
    }
  }
})
export {
  audioContext,
  playerStore
}

