import { getLocale } from './localStorage'

// 字体字号 对象数组
export const FONT_SIZE_LIST = [
  { fontSize: 12 },
  { fontSize: 14 },
  { fontSize: 16 },
  { fontSize: 18 },
  { fontSize: 20 },
  { fontSize: 22 },
  { fontSize: 24 }
]

// 字体样式 对象数组
export const FONT_FAMILY = [
    { font: 'Default' },
    { font: 'Cabin' },
    { font: 'Days One' },
    { font: 'Montserrat' },
    { font: 'Tangerine' }
  ]

// 获取主题样式 对象数组 
export function themeList(vue) {
  return [
    {
      alias: vue.$t('book.themeDefault'),
      name: 'Default',
      style: {
        body: {
          'color': '#4c5059',
          'background': '#cecece'
        }
      }
    },
    {
      alias: vue.$t('book.themeGold'),
      name: 'Gold',
      style: {
        body: {
          'color': '#5c5b56',
          'background': '#c6c2b6'
        }
      }
    },
    {
      alias: vue.$t('book.themeEye'),
      name: 'Eye',
      style: {
        body: {
          'color': '#404c42',
          'background': '#a9c1a9'
        }
      }
    },
    {
      alias: vue.$t('book.themeNight'),
      name: 'Night',
      style: {
        body: {
          'color': '#cecece',
          'background': '#000000'
        }
      }
    }
  ]
}

// 样式表的 添加、删除和清空 
export function addCss(href) {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', href)
  document.getElementsByTagName('head')[0].appendChild(link)
}
export function removeCss(href) {
  const links = document.getElementsByTagName('link')
  for (let i = links.length; i >= 0; i--) {
    const link = links[i]
    if (link && link.getAttribute('href') && link.getAttribute('href') === href) {
      link.parentNode.removeChild(link)
    }
  }
}
export function removeAllCss() {
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
}

// 将秒数转换为分钟数
export function getReadTimeByMinute(readTime) {
  if (!readTime) {
      return '0 分钟'
    } else {
      let StatusMinute = Math.ceil(readTime / 60)
      return timeStamp(StatusMinute)
      }
}

// 将分钟数转换为xx天xx时xx分的格式
export function timeStamp(StatusMinute) {
  const lang = getLocale()
  var day = parseInt(StatusMinute / 60 / 24)
  var hour = parseInt(StatusMinute / 60 % 24)
  var min = parseInt(StatusMinute % 60)
  StatusMinute = ''
  if (lang === 'cn') {
    if (day > 0) {
      StatusMinute = day + '天'
  }
    if (hour > 0) {
      StatusMinute += hour + '小时'
  }
    if (min >= 0) {
      StatusMinute += parseFloat(min) + '分钟'
  }
    return StatusMinute
  } else if (lang === 'en') {
    if (day > 0) {
      StatusMinute = day + 'day-'
    }
    if (hour > 0) {
        StatusMinute += hour + 'h-'
    }
    if (min >= 0) {
        StatusMinute += parseFloat(min) + 'mins'
    }
    return StatusMinute
  }
}

// 将树状的数组转换为一维数组
export function flatten(array) {
  return [].concat(...array.map(item => [].concat(item, ...flatten(item.subitems))))
}
