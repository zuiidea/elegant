import config from './config'
import request from './request'

// 日期格式化
Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
    }
  }
  return format
}

const formatTime = (timestamp, relativeTimestamp = true) => {
  const currentDate = new Date()
  const current = currentDate.getTime()
  const diff = current - timestamp
  if (relativeTimestamp) {
    if (diff <= (60 * 1000)) {
      return '刚刚'
    } else if (diff <= (60 * 60 * 1000)) {
      return `${Math.floor(diff / (60 * 1000))} 分钟前`
    } else if (diff <= (24 * 60 * 60 * 1000)) {
      return `${Math.floor(diff / (60 * 60 * 1000))} 小时前`
    } else if (diff <= (7 * 24 * 60 * 60 * 1000)) {
      return `${Math.floor(diff / (24 * 60 * 60 * 1000))} 天前`
    }
  }

  const date = new Date(timestamp)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  if (!relativeTimestamp &&
    currentDate.getDate() === day &&
    (currentDate.getMonth() + 1) === month &&
    currentDate.getFullYear() === year) {
    const h = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
    const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
    return `${h}:${m}`
  }

  if (year === currentDate.getFullYear()) {
    return `${month}月${day}日`
  }

  return `${year}年${month}月${day}日`
}


function debounce(fn, delay) {
  let timer
  return function () {
    const context = this
    /*eslint-disable*/

    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}

export {
  config,
  request,
  formatTime,
  debounce,
}
