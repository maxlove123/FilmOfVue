import fetch from '@/utils/fetch'
let _CONFIG = {
  // API: '/api' // /api http://www.xxxxxx.com dev环境下放开
  API: 'http://www.16kanba.com' // /api http://www.xxxxxx.com  生产环境下放开
}
// fetch.get('/static/API_CF.json').then(res => {
//   localStorage.setItem('jx', JSON.stringify(res))
// })
export default {
  API: _CONFIG.API,
  jxApi: {
    a: 'https://www.wocao.xyz/?url=',
    b: 'https://z1.m1907.cn/?jx=',
    c: 'http://api.23ii.cn/play/?rand=yes&wap=2&url=',
    d: 'https://api.vipjx.site/?url=',
    e: 'https://www.kpezp.cn/jlexi.php?url=',
    f: 'https://jx.ab33.top/33/?url=',
    g: 'https://api.927.la/kk/?url='
  }
}
