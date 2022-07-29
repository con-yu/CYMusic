// pages/detail-search/index.js
import {playerStore} from '../../store/index'
import { getSearchHot, getSearchSuggest, getSearchSongs } from '../../service/api-search'
import debounce from '../../utils/debounce'

const debounceGetSearchSuggest = debounce(getSearchSuggest)
Page({

  /**
  * 页面的初始数据
  */
  data: {
    searchHot: [],
    keywords: '',
    suggestResult: [],
    resultSongs: []
  },

  onLoad(options) {
    this.getPageData()
  },

  // 获取热搜数据
  getPageData() {
    getSearchHot().then(res => {
      this.setData({ searchHot: res.result.hots })
    })
  },

  // 获取搜索建议
  handelGetSearchSuggest(event) {
    // 获取关键字
    const keywords = event.detail
    this.setData({ keywords: keywords })

    // 有且关键字首字符不为空格才发送请求
    const firstStr = keywords.slice(0, 1)
    if (!keywords || firstStr === ' ') {
      // 关键字为空时重置建议/结果列表
      this.setData({ suggestResult: [], resultSongs: [] })
      return
    }

    // 根据关键字获取结果（防抖处理）
    debounceGetSearchSuggest(keywords).then(res => {
      // console.log(res);
      this.setData({ suggestResult: res.result.allMatch })
    })
  },

  // 获取搜索结果
  handelSearchAction() {
    const keywords = this.data.keywords
    getSearchSongs(keywords).then(res => {
      // console.log(res);
      this.setData({ resultSongs: res.result.songs })
    })
  },

  // 点击某个搜索建议时
  handleSuggestItemClick(event) {
    // 获取点击的搜索结果
    const clickItem = event.currentTarget.dataset.item.keyword
    // 将搜索结果回显输入框
    this.setData({ keywords: clickItem })
    // 发送网络请求
    this.handelSearchAction()
  },

  // 点击热门搜索中的某一项 
  handleHotItemClick(event) {
    const keyword = event.currentTarget.dataset.keyword
    this.setData({ keywords: keyword })
    this.handelSearchAction()
  },
  handleSongItemClick(event){
    const index = event.currentTarget.dataset.index
    // console.log(index,this.data.resultSongs);
    playerStore.setState('playListSongs',this.data.resultSongs)
    playerStore.setState('playListIndex',index)
  },

})