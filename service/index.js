// const BASE_URL = "http://123.207.32.32:9001"
const BASE_URL = "https://netease-cloud-music-api-sepia-nine.vercel.app"
class CYRequest {
  request(url, method, params) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL + url,
        method: method,
        data: params,
        success(res) {
          resolve(res.data)
        },
        fail: reject,
      })
    })
  }
  get(url, params) {
    return this.request(url, "get", params)
  }
  post(url, data) {
    return this.request(url, "post", data)
  }
}

const cyRequest = new CYRequest()
export default cyRequest
