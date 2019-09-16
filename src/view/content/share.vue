<template>
  <div class="Detail">
    <div class="playBox" v-if="!noResource">
      <div class="playNow"
           style="position: relative;"
           data-mu-loading-color="secondary"
           data-mu-loading-overlay-color="rgba(0, 0, 0, .7)"
           v-loading="playLoading">
        <iframe :src="newPlayUrl"
                allowfullscreen="allowfullscreen"
                mozallowfullscreen="mozallowfullscreen"
                msallowfullscreen="msallowfullscreen"
                oallowfullscreen="oallowfullscreen"
                webkitallowfullscreen="webkitallowfullscreen"
                border="0"
                width="100%"
                height="100%"
                frameborder="0"
                scrolling="no"></iframe>
      </div>
    </div>
    <div class="detailInfo">
      <mu-slide-right-transition>
        <mu-alert style="background: #ffffff;opacity: .9"
                  class="card-text-detail warningInfo"
                  v-show="warningInfo"
                  @delete="warningInfo = !warningInfo">
            <mu-row style="text-align: center">
              <mu-col span="3">
                <mu-flex justify-content="center" align-items="center">
                  <img :src="logoImg" class="mLogo" width="40">
                  <b>&nbsp;趣看</b>
                </mu-flex>
              </mu-col>
              <mu-col span="9">
                <mu-flex justify-content="center" align-items="center">
                  <p>“高清电影电视剧动漫在线<b>免费观看</b>”</p>
                  <mu-button flat color="primary" @click="downLoadApk(1)">
                    下载APP
                    <mu-icon right value="arrow_forward"></mu-icon>
                  </mu-button>
                </mu-flex>
              </mu-col>
            </mu-row>
        </mu-alert>
      </mu-slide-right-transition>
      <mu-card class="detail-card">
        <mu-list>
          <mu-list-item avatar button :ripple="false">
            <mu-list-item-content>
              <mu-list-item-title>
                <h3 style="margin: 0">{{vod_name + ` ` + playName}}</h3>
              </mu-list-item-title>
              <mu-list-item-sub-title>{{vod_hits + `次播放   更新于` + vod_time}}</mu-list-item-sub-title>
            </mu-list-item-content>
          </mu-list-item>
        </mu-list>
        <mu-card-actions>
          <mu-button full-width color="primary" @click="downLoadApk(1)">
            <mu-icon left value="play_circle_outline"></mu-icon>
            打开趣看视频APP，提升3倍流畅度奥~
          </mu-button>
        </mu-card-actions>
        <div class="playList">
          <mu-flex class="flex-wrapper" align-items="center" v-if="noResource">
            暂无片源
          </mu-flex>
          <div class="playListBox" v-if="!noResource">
            <mu-tabs :value.sync="activeIndex" inverse color="#2BA2F1" indicator-color="#2BA2F1" text-color="rgba(0, 0, 0, .54)">
              <mu-tab v-for="item in playList" :key="item.player_info.sort + item.sid">
                {{item.player_info.show}}
              </mu-tab>
            </mu-tabs>
            <div v-for="(item, index) in playList"
                 :key="item.sid"
                 class="button-wrapper-box"
                 v-if="activeIndex === index">
              <div :class="`button-wrapper ` + (is_hide_more ? 'hide_more': '')">
                <mu-button v-for="v in item.playurl"
                           :key="v.sid"
                           :color="onActive === v.nid ? 'primary':''"
                           @click="setPlayUrl(v.url, v.name, 1, v.nid, v.from)">
                  {{v.name}}
                </mu-button>
              </div>
            </div>
            <mu-sub-header class="hide_more_btn" v-if="is_hide_more" @click="is_hide_more = false">展开</mu-sub-header>
          </div>
        </div>
        <div class="contentBox">
          <mu-sub-header>
            <h2>简介</h2>
          </mu-sub-header>
          <mu-card-text class="card-text-detail">
            <p>主演：{{detailData.vod_actor}}</p>
            <p>导演：{{detailData.vod_director}}</p>
            <p>类型：{{type_name}}</p>
            <p>地区：{{detailData.vod_actor}}  &nbsp;&nbsp;{{detailData.vod_area}} &nbsp;&nbsp;{{detailData.vod_year}}</p>
          </mu-card-text>
          <mu-card-text  class="card-text-detail" style="color:#909090" v-if="detailData.vod_blurb !== ''">
            <p v-if="isShowContent">{{detailData.vod_blurb}}</p>
            <p v-if="!isShowContent">{{detailData.vod_content | filterContent}}</p>
          </mu-card-text>
          <mu-sub-header
            v-if="detailData.vod_blurb !== ''"
            class="hide_more_btn"
            @click="isShowContent = !isShowContent">
            {{isShowContent? '展开' : '收起'}}
          </mu-sub-header>
        </div>
        <div class="recommendBox">
          <mu-sub-header>
            <h2>推荐视频</h2>
          </mu-sub-header>
          <mu-grid-list class="recommend-inline" :cols="2">
            <mu-grid-tile v-for="(item, index) in recommendList"
                          class="recommend-inline-item"
                          :key="index">
              <img v-lazy="item.vod_pic" >
              <span slot="title">{{item.vod_name}}</span>
              <span slot="subTitle"><b>{{item.vod_remarks}}</b></span>
            </mu-grid-tile>
          </mu-grid-list>
        </div>
      </mu-card>
    </div>
    <div class="download-tip" v-show="showDownload" @click="showDownload = false">
      <img :src="downloadImg">
    </div>
  </div>
</template>

<script>import { HomeSrv } from '@/service'
import Tool from '@/utils/tools'
import _CONF from '@/config'
export default {
  name: 'Share',
  data () {
    return {
      activeIndex: 0,
      openMenu: false,
      warningInfo: true,
      noResource: false,
      contentShow: false,
      hide_more: 'hide_more',
      is_hide_more: true,
      isShowContent: true,
      contentHeight: 40,
      detailData: {
        vod_play_list: {},
        vod_actor: '未知',
        vod_year: '未知',
        vod_director: '未知',
        vod_area: '未知',
        vod_blurb: '未知',
        vod_content: '未知'
      },
      windowUrl: '',
      playLoading: true,
      showDownload: false,
      downloadImg: require('@/assets/img/downloadTip.png'),
      logoImg: require('@/assets/img/108108.png'),
      playBg: '-', // require('@/assets/img/loading.gif'),
      playName: '-',
      type_name: '-',
      onActive: 1,
      vod_name: '-',
      vod_score: 0,
      vod_time: '-',
      vod_hits: 0,
      vod_pic: '',
      playUrl: '',
      playList: [],
      recommendList: []
    }
  },
  computed: {
    newPlayUrl: function () {
      return this.playUrl
    }
  },
  filters: {
    filterContent: function (v) {
      return v.replace('<p>', '').replace('</p>', '')
    }
  },
  mounted () {
    this.getDetailData(this.getId().id, 0)
    this.setHits()
    this.hideWarning()
    // this.downLoadApk()
  },
  methods: {
    goBack () {
      let that = this
      console.log('RouterFrom' + this.$store.state.cache.RouterFrom)
      this.$router.push({
        name: that.$store.state.cache.RouterFrom
      })
    },
    getTime (t) {
      return Tool.FormatDate(t)
    },
    getId () {
      let _id = Tool.getUrlParam('id')
      let _tid = Tool.getUrlParam('tid')
      return {
        id: _id,
        tid: _tid
      }
    },
    getDetailData ($id, $type) {
      let that = this
      HomeSrv.getDetailDataApi({
        mid: 1,
        id: $id
      }).then((res) => {
        that.detailData = res.info
        that.type_name = that.detailData.type.type_name
        that.vod_time = that.getTime(that.detailData.vod_time)
        that.vod_name = that.detailData.vod_name
        that.vod_score = that.detailData.vod_score
        that.vod_hits = that.detailData.vod_hits
        this.playBg = that.detailData.vod_pic
        if (that.detailData.vod_play_list === []) that.noResource = true
        that.getPlayList(that.detailData.vod_play_list || {})
        that.getRecommendData({
          tid: that.detailData.type_id
        })
        that.setRecordList()
        that.setTitle()
      })
    },
    downLoadApk (result) {
      let ua = window.navigator.userAgent.toLowerCase()
      // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
      alert('请点击右上角按钮, 使用内置浏览器打开下载')
      if (ua.match(/MicroMessenger/i) === 'micromessenger' || (ua.match(/QQ/i) === 'qq')) {
        this.showDownload = true
      } else {
        window.open('http://test.badyw.com/qukan.apk')
      }
    },
    setTitle () {
      // TODO 设置当前页面title
      document.title = this.vod_name + '-' + this.playName + '-' + this.type_name + '-趣看视频'
    },
    setUrl () {
      this.windowUrl = window.location.href
    },
    setScrollTop () {
      // TODO 回到顶部
      // document.body.scrollTop = 0
    },
    setRecordList () {
      // TODO 存放播放记录
      let V = (Date.parse(new Date()) / 1000) +
        '|' + this.getId().id +
        '|' + this.vod_name +
        '|' + this.playName +
        '|' + this.playBg
      Tool.setRecordList(V)
    },
    // TODO 获取推荐视频的数据
    getRecommendData (opt) {
      let that = this
      HomeSrv.getListDataApi(Object.assign({}, {
        mid: 1,
        page: 1,
        limit: 15,
        tid: 1,
        year: '全部',
        area: '全部'
      }, opt)).then((res) => {
        that.recommendList = res.list
      })
    },
    // TODO 设置播放播放区域的按钮和tab页
    getPlayList (arr) {
      for (let i in arr) {
        let _A = []
        let _OBJ = arr[i].urls
        for (let j in _OBJ) {
          if (i === '1' && j === '1') {
            this.setPlayUrl(_OBJ[j].url, _OBJ[j].name, 0, 1, _OBJ[j].from)
          }
          // arr[1].urls[1].on = 'primary'
          _A.push(_OBJ[j])
        }
        arr[i].playurl = _A
        this.playList.push(arr[i])
      }
    },
    // TODO 设置iframe的视频播放链接
    setPlayUrl (v, name, t, nid, from) {
      this.playUrl = ''
      if (t === 1) this.playLoading = true
      if (from === 'kkyun' || from === 'gqyun' || from === 'zkyun' || from === 'dbyun' || from === '135zy') {
        this.playUrl = v
      } else if (from === 'm3u8') {
        this.playUrl = ((this.getJX().jxApi.d).replace(/_/g, '.') || _CONF.jxApi.d) + v
      } else if (from === '27pan') {
        this.playUrl = ((this.getJX().jxApi.d).replace(/_/g, '.') || _CONF.jxApi.d) + v
      } else {
        this.playUrl = ((this.getJX().jxApi.d).replace(/_/g, '.') || _CONF.jxApi.d) + v
      }
      this.playName = name
      setTimeout(() => {
        this.playLoading = false
      }, 2000)
      this.onActive = nid
    },
    // TODO 评论区域的展开显示
    showContent () {
      this.contentShow = !this.contentShow
    },
    // TODO 每次点击进来 点击数+1
    setHits () {
      HomeSrv.getHitsDataApi({
        mid: 1,
        id: this.getId().id,
        type: 'update'
      }).then((res) => {
      })
    },
    // TODO 播放提示悬浮窗，8秒后自动关闭
    hideWarning () {
      // setTimeout(() => {
      //   this.warningInfo = false
      // }, 8000)
    },
    getJX () {
      let _JX = localStorage.getItem('jx')
      return JSON.parse(_JX)
    }
  }
}
</script>

<style scoped type="less">
  .Detail {
    height: 100%;
    flex: 1;
    -webkit-overflow-scrolling: touch;
  }
  .DetailBar{
    width: 3.5rem;
    position: fixed;
    z-index: 999999999999999999;
    box-shadow: none;
  }
  .playBox{
    width: 100%;
    height: 13.184rem;
    background: #303030;
    z-index: 111;
    position: relative;
  }
  .weui-panel:before{
    border: none;
  }
  .contentBox{
  }
  .detailContent{
    padding: 1rem;
    font-size: 1rem;
    text-indent: 1rem;
  }
  .detailContent p{
    margin-top: 1rem;
    color: #ececec
  }
  .playListBox{
    background: #eeeeee;
  }
  .playList h2{
    margin: 0;
    color: #333;
  }
  .button-wrapper-box {
    max-height: 10rem;
    overflow: auto;
  }
  .mu-tabs-inverse{
    background: transparent;
    overflow-x: auto;
    white-space: nowrap;
  }
  .download-tip {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 999999999;
  }
  .download-tip img{
    width: 100%;
    height: 100%;
  }
</style>
