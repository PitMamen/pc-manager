// export const currentEnv = "test"    //测试环境
// export const currentEnv = "show"    //演示环境
export const currentEnv = "online"  //线上环境

// export const appId = "wx99df16e6be344865"//测试公众号 上面三个湘雅医院的公众号
// export const appId = "wx0bc29297eabbca39"//演示环境公众号
export const appId = "wx2f945858177df980" //线上公众号（更换的） # 健康管家公众号的appid

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 LOL', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader(callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () { }
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE() {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

export function formatDate(date) {
  date = new Date(date)
  let myyear = date.getFullYear()
  let mymonth = date.getMonth() + 1
  let myweekday = date.getDate()
  mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
  myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
  return `${myyear}-${mymonth}-${myweekday}`
}

export function formatDateFull(date) {
  date = new Date(date)
  let myyear = date.getFullYear()
  let mymonth = date.getMonth() + 1
  let myweekday = date.getDate()
  let oHour = date.getHours()
  let oMin = date.getMinutes()
  let oSen = date.getSeconds()
  mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
  myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
  oHour < 10 ? (oHour = '0' + oHour) : oHour
  oMin < 10 ? (oMin = '0' + oMin) : oMin
  oSen < 10 ? (oSen = '0' + oSen) : oSen
  return `${myyear}-${mymonth}-${myweekday} ${oHour}:${oMin}:${oSen}`
}

/**获取当前月份 */
export function getMonthNow() {
  var myDate = new Date();
  var year = myDate.getFullYear();
  var month = myDate.getMonth() + 1  //获取当前月份(0-11,0代表1月，所以要加1);
  var day = myDate.getDate();//获取当前日（1-31）
  if (month < 10) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  var firstDay = year + "-" + month;
  return firstDay;
}

/**获取本月第一天 */
export function getDateNow() {
  var myDate = new Date();
  var year = myDate.getFullYear();
  var month = myDate.getMonth() + 1  //获取当前月份(0-11,0代表1月，所以要加1);
  var day = myDate.getDate();//获取当前日（1-31）
  if (month < 10) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  var firstDay = year + "-" + month + "-01";
  return firstDay;
}


/**
 * 获取上个月的今天
 */
export function getlastMonthToday() {

  var now = new Date();
  var year = now.getFullYear();//getYear()+1900=getFullYear()
  var month = now.getMonth() + 1;//0-11表示1-12月
  var day = now.getDate();
  if (parseInt(month) < 10) {
    month = "0" + month;
  }
  if (parseInt(day) < 10) {
    day = "0" + day;
  }

  now = year + '-' + month + '-' + day;

  if (parseInt(month) == 1) {//如果是1月份，则取上一年的12月份
    return (parseInt(year) - 1) + '-12-' + day;
  }

  var preSize = new Date(year, parseInt(month) - 1, 0).getDate();//上月总天数
  if (preSize < parseInt(day)) {//上月总天数<本月日期，比如3月的30日，在2月中没有30
    return year + '-' + month + '-01';
  }

  if (parseInt(month) <= 10) {
    return year + '-0' + (parseInt(month) - 1) + '-' + day;
  } else {
    return year + '-' + (parseInt(month) - 1) + '-' + day;
  }

}

/**是否可以打电话 */
export function canCall() {
  return tccc && tccc.Agent.getStatus() == 'free';
}





/**获取本月最后一天 */
export function getCurrentMonthLast() {
  var date = new Date();
  var currentMonth = date.getMonth();
  var nextMonth = ++currentMonth;
  var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
  var oneDay = 1000 * 60 * 60 * 24;
  return formatDate(new Date(nextMonthFirstDay - oneDay));
}

/**
 * 根据某一天日期 获取 当前月的第一天和最后一天的日期
 * @param date {Date}
 * @return {{endDate: Date, startDate: Date}}
 */
export function getStartAndEndDateOfMonth(date) {
  let year = date.getFullYear() // 2021
  const month = date.getMonth() + 1 // 0 1 2 3 4 5 6 7 8 9 10 11
  const startDate = new Date(year + '/' + month + '/' + 1)
  let nextMonth = month + 1
  if (nextMonth === 13) {
    year += 1
    nextMonth = 1
  }
  const dateLong = (new Date(year + '/' + nextMonth + '/' + 1)).getTime() - 24 * 60 * 60 * 1000
  const endDate = new Date(dateLong)

  return { startDate, endDate }
}

/**
 * 判断对象是空
 * @param {} obj 
 * @returns 
 */
export function isObjectEmpty(obj) {

  return obj == undefined || obj == null || JSON.stringify(obj) == "{}"
}

/**
 * 判断字符串是空
 * @param {} str 
 * @returns 
 */
export function isStringEmpty(str) {
  return str == undefined || str == null || str.length <= 0
}

/**
 * 判断数组是空
 * @param {} arr 
 * @returns 
 */
export function isArrayEmpty(arr) {
  return arr == undefined || arr == null || arr.length <= 0
}