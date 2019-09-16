<template>
  <div class="Detail" :style="{height:loadingHeight + `px`}">
    <div class="playBox" v-if="!noResource">
      <div class="playNow"
           id="playNow"
           data-mu-loading-text="影片载入中..."
           data-mu-loading-size="32"
           data-mu-loading-color="secondary"
           data-mu-loading-overlay-color="rgba(0, 0, 0, .7)"
           v-loading="playLoading">
        <!--<iframe :src="newPlayUrl"-->
                <!--allowfullscreen="allowfullscreen"-->
                <!--mozallowfullscreen="mozallowfullscreen"-->
                <!--msallowfullscreen="msallowfullscreen"-->
                <!--oallowfullscreen="oallowfullscreen"-->
                <!--webkitallowfullscreen="webkitallowfullscreen"-->
                <!--border="0"-->
                <!--width="100%"-->
                <!--height="100%"-->
                <!--frameborder="0"-->
                <!--scrolling="no"></iframe>-->
      </div>
    </div>
    <div class="detailInfo">
      <mu-slide-right-transition>
        <mu-alert color="warning"
                  delete
                  class="card-text-detail warningInfo"
                  v-show="warningInfo"
                  @delete="warningInfo = !warningInfo">
          <mu-icon left value="warning"></mu-icon>资源加载需要时间，请耐心等待5秒，如果出现播放失败请尝试切换播放源
        </mu-alert>
      </mu-slide-right-transition>
      <mu-card class="detail-card">
        <mu-list>
          <mu-list-item avatar button :ripple="false">
            <mu-list-item-action>
              <mu-icon value="arrow_back"
                       left
                       @click="goBack"
                       size="32"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-content>
              <mu-list-item-title>
                <h3 style="margin: 0">{{vod_name + ` ` + playName}}</h3>
              </mu-list-item-title>
              <mu-list-item-sub-title>{{vod_hits + `次播放   更新于` + vod_time}}</mu-list-item-sub-title>
            </mu-list-item-content>
            <!--<mu-button icon @click="goShare">-->
            <!--<mu-icon value="share"></mu-icon>-->
            <!--</mu-button>-->
            <mu-menu cover placement="bottom-end" :open.sync="openMenu">
              <mu-button icon>
                <mu-icon value="share"></mu-icon>
              </mu-button>
              <mu-list slot="content">
                <mu-list-item button @click="goShare('session')">
                  <mu-list-item-title>微信好友</mu-list-item-title>
                </mu-list-item>
                <mu-list-item button @click="goShare('timeline')">
                  <mu-list-item-title>朋友圈</mu-list-item-title>
                </mu-list-item>
              </mu-list>
            </mu-menu>
          </mu-list-item>
        </mu-list>
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
                          @click="getDetailData(item.vod_id, 1)"
                          :key="index">
              <img v-lazy="item.vod_pic" >
              <span slot="title">{{item.vod_name}}</span>
              <span slot="subTitle"><b>{{item.vod_remarks}}</b></span>
            </mu-grid-tile>
          </mu-grid-list>
        </div>
      </mu-card>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import { HomeSrv } from '@/service'
import Tool from '@/utils/tools'
import _CONF from '@/config'
let webBrowser2018 = api.require('webBrowser2018')
let wx = api.require('wx')
export default {
  name: 'Detail',
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
  inject: ['REFRESH', 'JX', 'HEIGHT'],
  computed: {
    loadingHeight: function () {
      return this.setLoadingHeight()
    },
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
    this.getDetailData(this.getId(), 0)
    this.setHits()
    this.hideWarning()
    webBrowser2018.close() // 先关闭之前的frame
  },
  methods: {
    goBack () {
      let that = this
      console.log('RouterFrom' + this.$store.state.cache.RouterFrom)
      this.$router.push({
        name: that.$store.state.cache.RouterFrom
      })
      webBrowser2018.close()
    },
    setLoadingHeight () {
      return this.HEIGHT()
    },
    getTime (t) {
      return Tool.FormatDate(t)
    },
    getId () {
      return this.$route.params.id
    },
    getDetailData ($id, $type) {
      let that = this
      if ($type === 1) {
        this.$router.replace({
          path: '/Detail/' + $id
        })
        this.REFRESH()
      }
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
        that.getRecommendData({
          tid: that.detailData.type_id
        })
        that.setRecordList()
        that.setTitle()
        that.getPlayList(that.detailData.vod_play_list || {})
      })
    },
    setShare (result) {
      if (result === '1') {
        alert('分享成功')
      } else {
        alert('分享失败')
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
        '|' + this.getId() +
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
      let that = this
      let _UOBJ = {
        url: '',
        name: '',
        t: 0,
        s: 1,
        from: ''
      }
      for (let i in arr) {
        let _A = []
        let _OBJ = arr[i].urls
        for (let j in _OBJ) {
          if (i === '1' && j === '1') {
            _UOBJ['url'] = _OBJ[j].url
            _UOBJ['name'] = _OBJ[j].name
            _UOBJ['from'] = _OBJ[j].from
          }
          // arr[1].urls[1].on = 'primary'
          _A.push(_OBJ[j])
        }
        arr[i].playurl = _A
        that.playList.push(arr[i])
      }
      that.setPlayUrl(_UOBJ.url, _UOBJ.name, _UOBJ.t, _UOBJ.s, _UOBJ.from)
    },
    // TODO 设置iframe的视频播放链接
    setPlayUrl (v, name, t, nid, from) {
      let that = this
      let _H = document.getElementById('playNow').offsetHeight
      let _W = document.getElementById('playNow').offsetWidth
      if (from === 'kkyun' || from === 'gqyun' || from === 'zkyun' || from === 'dbyun' || from === '135zy') {
        this.playUrl = v
      } else if (from === 'm3u8') {
        this.playUrl = ((this.JX().jxApi.b).replace(/_/g, '.') || _CONF.jxApi.b) + v
      } else if (from === '27pan') {
        this.playUrl = ((this.JX().jxApi.b).replace(/_/g, '.') || _CONF.jxApi.b) + v
      } else {
        this.playUrl = ((this.JX().jxApi.b).replace(/_/g, '.') || _CONF.jxApi.b) + v
      }
      this.playName = name
      this.playLoading = true
      if (t === 0) { // 首次进来打开frame
        webBrowser2018.openFrame({
          'rect': {
            x: 0,
            y: 0,
            w: _W,
            h: _H
          },
          'url': that.playUrl,
          showAlert: true,
          fixed: true
        }, function (ret) {
          webBrowser2018.hide()
          webBrowser2018.loadUrl({
            'url': that.playUrl
          })
        })
      } else { // 切换播放地址调用改变loadURL就可以
        webBrowser2018.clearCache() // 清除缓存
        webBrowser2018.hide()
        webBrowser2018.loadUrl({
          'url': that.playUrl
        }, function (ret) {
          if (ret.code > -1) {}
        })
      }
      webBrowser2018.setEventListener(function (ret) {
        if (ret.code === 1) {
          setTimeout(() => {
            that.playLoading = false
            webBrowser2018.show()
            webBrowser2018.removeEventListener()
          }, 800)
        }
      })
      this.onActive = nid
    },
    goShare ($type) {
      // TODO 调用微信分享功能
      let that = this
      that.openMenu = false
      wx.isInstalled(function (ret, err) {
        if (ret.installed) {
          // that.$toast.success('当前设备已安装微信客户端')
          wx.shareWebpage({
            apiKey: 'wx3756ea4dc642fc86',
            scene: $type,
            title: that.vod_name + '-' + that.playName,
            description: that.detailData.vod_blurb,
            thumb: 'widget://image/play.png',
            contentUrl: 'http://test.badyw.com/Share?id=' + that.getId()
          }, function (ret, err) {
            if (ret.status) {
              that.$toast.success('分享成功')
            } else {
              that.$toast.error('分享失败')
            }
          })
        } else {
          that.$toast.success('当前设备未安装微信客户端')
        }
      })
    },
    // TODO 评论区域的展开显示
    showContent () {
      this.contentShow = !this.contentShow
    },
    // TODO 每次点击进来 点击数+1
    setHits () {
      HomeSrv.getHitsDataApi({
        mid: 1,
        id: this.getId(),
        type: 'update'
      }).then((res) => {
      })
    },
    // TODO 播放提示悬浮窗，8秒后自动关闭
    hideWarning () {
      // setTimeout(() => {
      //   this.warningInfo = false
      // }, 8000)
    }
  }
}
</script>

<style scoped type="less">
  .Detail {
    height: 100%;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
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
</style>
