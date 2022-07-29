const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
export function parseLyric(lyricStr) {
  const lyricStrings = lyricStr.split('\n')

  const lyricInfos = []
  for (const lineStr of lyricStrings) {
    const result = timeRegExp.exec(lineStr)
    if (!result) continue
    // 获取时间轴
    const minute = result[1] * 60 * 1000
    const second = result[2] * 1000
    const millTime = result[3]
    const millSecond = millTime.length === 2 ? millTime * 10 : millTime * 1
    const time = minute + second + millSecond

    // 获取歌词文本
    const lyricText = lineStr.replace(timeRegExp,"")
    // console.log(`time:${time},text:${lyricText}`);
    const lyricInfo = {time,lyricText}
    lyricInfos.push(lyricInfo)
  }
  return lyricInfos
}