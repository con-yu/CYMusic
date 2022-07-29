import cyRequest from './index'
// 获取轮播图
export function getBanners(){
  return cyRequest.get('/banner',{
    type:2
  })
}
// 获取巅峰榜单
export  function getToplist(){
  return cyRequest.get('/toplist')
}
// 获取热门歌单
export function getHotPlaylist(){
  return cyRequest.get('/top/playlist/highquality',{
  })
}
export function getPlaylistsDetail(id){
  return cyRequest.get('/playlist/detail',{
    id
  })
}
export function getPlaylistAllSongs(id){
  return cyRequest.get('/playlist/track/all',{
    id
  })
}
export function getRankingListAllSongs(rankingListIndex){
  return new Promise((resolve,reject)=>{
    getToplist().then(res=>{
      // 获取传入榜单的id
      const listId = res.list[rankingListIndex].id
      // 根据id获取该榜单所有歌曲
      getPlaylistAllSongs(listId).then(res=>{
        resolve(res)
      })
    })
  }) 
}










