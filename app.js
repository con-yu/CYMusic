// app.js
App({
  onLaunch() {
    // 获取屏幕大小
    wx.getSystemInfoAsync({
      success: (res) => {
        this.globalData.screenWidth = res.windowWidth
        this.globalData.screenHeight = res.windowHeight
        this.globalData.statusBarHeight = res.statusBarHeight
      },
    })

  },
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navBarHeight: 44,
  }
})
