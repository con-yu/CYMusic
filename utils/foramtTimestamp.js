const dayjs = require('dayjs')

// 格式化日期(YY-MM-DD)
export default function formatTimestamp(timestamp){
  return dayjs(timestamp).format('YYYY-MM-DD')
}