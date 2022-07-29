import cyRequest from './index'

export function getSongDetail(ids){
  return cyRequest.get('/song/detail',{
    ids
  })
}
export function getLyric(id){
  return cyRequest.get('/lyric',{
    id
  })
}