import cyRequest from './index'

export  function getSingerDesc(id){
  return cyRequest.get('/artist/desc',{
    id
  })
}
export function getTopListArtist(){
  return cyRequest.get('/toplist/artist')
}