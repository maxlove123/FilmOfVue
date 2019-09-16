export default {
  setHistoryList: (val) => {
    val = val.trim()
    let hs = localStorage.getItem('HistoryList')
    let HistoryList = (hs === '' || hs === null) ? [] : JSON.parse(hs)
    if (HistoryList.length > 0) { // 有数据的话 判断
      if (HistoryList.indexOf(val) !== -1) { // 有相同的，先删除 再添加
        HistoryList.splice(HistoryList.indexOf(val), 1)
        HistoryList.unshift(val)
      } else { // 没有相同的 添加
        HistoryList.unshift(val)
      }
    } else { // 没有数据 添加
      HistoryList.unshift(val)
    }
    if (HistoryList.length > 6) { // 保留六个值
      HistoryList.pop()
    }
    localStorage.setItem('HistoryList', JSON.stringify(HistoryList))
  },
  setRecordList: (val) => {
    val = val.trim()
    let hs = localStorage.getItem('RecordList')
    let RecordList = (hs === '' || hs === null) ? [] : JSON.parse(hs)
    if (RecordList.length > 0) { // 有数据的话 判断
      if (RecordList.some((i) => { return i.split('|')[2] === val.split('|')[2] })) { // 有相同的，先删除 再添加
        RecordList.map((value, index) => {
          if (value.split('|')[2] === val.split('|')[2]) {
            RecordList.splice(index, 1)
          }
        })
        RecordList.unshift(val)
      } else { // 没有相同的 添加
        RecordList.unshift(val)
      }
    } else { // 没有数据 添加
      RecordList.unshift(val)
    }
    if (RecordList.length > 6) { // 保留六个值
      // RecordList.pop()
    }
    localStorage.setItem('RecordList', JSON.stringify(RecordList))
  },
  FormatDateTime: (timeStamp) => {
    var date = new Date()
    date.setTime(timeStamp * 1000)
    var y = date.getFullYear()
    var m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    var d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    var h = date.getHours()
    h = h < 10 ? ('0' + h) : h
    var minute = date.getMinutes()
    var second = date.getSeconds()
    minute = minute < 10 ? ('0' + minute) : minute
    second = second < 10 ? ('0' + second) : second
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
  },
  FormatDate: (timeStamp) => {
    if (JSON.stringify(timeStamp).indexOf('-') > 0) {
      return timeStamp.substring(0, 10)
    } else {
      var date = new Date()
      date.setTime(timeStamp * 1000)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    }
  },
  getUrlParam: (name) => {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  },
  setTidFilters: {
    TV: function (v) {
      if (JSON.stringify(v).indexOf('第') > -1) {
        return '更新至' + v.replace('第', '')
      } else if (/^[0-9]+$/.test(v)) {
        return '更新至' + v + '集'
      } else {
        return v
      }
    },
    Va: function (v) {
      if (JSON.stringify(v).indexOf('连载至') > -1) {
        // let L = v.substr(0, 3)
        let Y = v.substr(3, 4)
        let M = v.substr(7, 2)
        let D = v.substr(9, 2)
        let S = '-'
        return Y + S + M + S + D + '期'
      } else if (v === '' || JSON.stringify(v).indexOf('更新') > -1 || JSON.stringify(v).indexOf('-') > -1) {
        return v
      } else if (/^[0-9]+$/.test(v) && v.length === 8) {
        let Y = v.substr(0, 4)
        let M = v.substr(4, 2)
        let D = v.substr(6, 2)
        let S = '-'
        return Y + S + M + S + D + '期'
      } else if (/^[0-9]+$/.test(v) && v.length < 8) {
        return '更新至' + v + '期'
      } else {
        return v
      }
    },
    An: function (v) {
      if (JSON.stringify(v).indexOf('第') > -1 && JSON.stringify(v).indexOf('集') > -1) {
        return '更新至' + v.replace('第', '')
      } else if (/^[0-9]+$/.test(v) && v.length === 8) {
        let Y = v.substr(0, 4)
        let M = v.substr(4, 2)
        let D = v.substr(6, 2)
        let S = '-'
        return Y + S + M + S + D + '集'
      } else if (/^[0-9]+$/.test(v) && v.length < 8) {
        return '更新至' + v + '集'
      } else {
        return v
      }
    }
  },
  setFiltersCondition: {
    Mv: {
      AREA: ['全部', '大陆', '香港', '台湾', '美国', '法国', '英国', '日本', '韩国', '德国', '泰国', '印度', '意大利', '西班牙', '加拿大', '其他'],
      YEAR: ['全部', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '更早'],
      TYPE: [
        {
          tid: 1,
          name: '全部'
        },
        {
          tid: 6,
          name: '动作片'
        },
        {
          tid: 7,
          name: '喜剧片'
        },
        {
          tid: 8,
          name: '爱情片'
        },
        {
          tid: 9,
          name: '科幻片'
        },
        {
          tid: 10,
          name: '恐怖片'
        },
        {
          tid: 11,
          name: '剧情片'
        },
        {
          tid: 12,
          name: '战争片'
        },
        {
          tid: 21,
          name: '纪录片'
        }
      ]
    },
    TV: {
      AREA: ['全部', '大陆', '香港', '台湾', '美国', '法国', '英国', '日本', '韩国', '德国', '泰国', '印度', '意大利', '西班牙', '加拿大', '其他'],
      YEAR: ['全部', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '更早'],
      TYPE: [
        {
          tid: 2,
          name: '全部'
        },
        {
          tid: 13,
          name: '国产剧'
        },
        {
          tid: 14,
          name: '港台剧'
        },
        {
          tid: 15,
          name: '日韩剧'
        },
        {
          tid: 16,
          name: '欧美剧'
        },
        {
          tid: 20,
          name: '海外剧'
        }
      ]
    },
    VA: {
      AREA: ['全部', '大陆', '香港', '台湾', '日本', '韩国', '欧美', '其它'],
      YEAR: ['全部', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '更早'],
    }
  }
}
