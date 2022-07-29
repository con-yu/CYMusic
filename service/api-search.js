import cyRequest from './index'

export function getSearchHot(){
  return cyRequest.get('/search/hot')
}
export function getSearchSuggest(keywords){
  return cyRequest.get('/search/suggest',{
    keywords,
    type:"mobile"
  })
}
export function getSearchSongs(keywords){
  return cyRequest.get('/search',{
    keywords
  })
}
