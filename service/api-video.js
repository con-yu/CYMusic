import cyRequest from './index'
export function getTopMv(offset, limit = 10) {
  return cyRequest.get('/top/mv', { offset, limit })
}

export function getMvUrl(id) {
  return cyRequest.get('/mv/url', {
    id
  })
}
export function getMvDetail(mvid) {
  return cyRequest.get('/mv/detail', {
    mvid
  })
}
export function getRelatedVideo(id) {
  return cyRequest.get('/related/allvideo', {
    id
  })
}
export function getVideoUrl(id) {
  return cyRequest.get('/video/url', {
    id
  })
}
export function getVideoDetail(id) {
  return cyRequest.get('/video/detail', {
    id
  })
}
