<template>
  <div class="mainBox" ref="mainBox">
    <mu-appbar class="headerBar"
               color="#ffffff">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="arrow_back_ios" size="26" color="#999"></mu-icon>
      </mu-button>
      <wv-input class="searchBox"
                :placeholder="mPlaceholder"
                autofocus
                ref="searchBox"
                @input="onChangeInput"
                @keyup.enter.native="searchIt"
                v-model="searchValue">
      </wv-input>
      <mu-button icon slot="right" @click="searchIt">
        <mu-icon value="search" size="30" color="#666666"></mu-icon>
      </mu-button>
    </mu-appbar>
    <div class="mainBox-load-more"
           ref="mainBoxLoadMore"
           :style="{height:loadingHeight + `px`}">
      <mu-load-more @refresh="renderData(2)"
                    v-if="listData.length !== 0"
                    :refreshing="refreshing"
                    :loading="loading"
                    :loading-text="loadingText"
                    :loaded-all="loadedAll"
                    @load="load(1)">
        <mu-list>
          <mu-list-item button
                        @click="showDetail(item.id)"
                        class="listBox"
                        v-for="item in listData"
                        :key="item.id"
                        :ripple="false">
            <mu-list-item-action>
                <img v-lazy="item.pic">
            </mu-list-item-action>
            <mu-list-item-content>
              <h3>{{item.name}}</h3>
              <mu-list-item-sub-title>主演: {{item.actor}}</mu-list-item-sub-title>
              <mu-list-item-sub-title>{{item.class}}</mu-list-item-sub-title>
              <mu-list-item-sub-title>{{item.year}}·{{item.area}}</mu-list-item-sub-title>
              <mu-button small
                         class="playBtn qk-primary"
                         color="primary"><mu-icon color="#fff" value="play_arrow"></mu-icon>播放</mu-button>
            </mu-list-item-content>
          </mu-list-item>
        </mu-list>
      </mu-load-more>
      <mu-card v-else class="qk-card">
        <mu-card-title title="搜索历史"></mu-card-title>
        <mu-card-actions>
          <mu-button
            span="4"
            class="historyBtn"
            v-for="(item, index) in historyList"
            :key="index" @click="searchItHistory(item)">{{item}}</mu-button>
        </mu-card-actions>
        <mu-flex class="flex-wrapper" justify-content="center">
          <mu-fade-transition>
            <mu-button flat
                       color="#2196f3"
                       @click="clearHistory"
                       v-show="Array.isArray(historyList) && historyList.length !== 0 ? true : false">
              <mu-icon value="delete_forever"></mu-icon>清空历史
            </mu-button>
          </mu-fade-transition>
        </mu-flex>
      </mu-card>
    </div>
  </div>
</template>

<script>import { HomeSrv } from '@/service'
import Tool from '@/utils/tools'
// import mLoading from '@/components/loading'
export default {
  name: 'List',
  // components: {
  //   mLoading
  // },
  inject: ['CACHEVIEW', 'HEIGHT'],
  data () {
    return {
      mPlaceholder: '',
      refreshing: false,
      loading: false,
      nopicImg: require('@/assets/img/nopic.png'),
      loadingText: '轻松加载中...',
      loadedAll: false,
      filters: 0,
      zDepth: 0,
      isLoading: false,
      searchValue: '',
      ajaxData: {
        mid: 1,
        page: 1,
        limit: 15,
        wd: ''
      },
      listData: [],
      historyList: []
    }
  },
  mounted () {
    // this.CACHEVIEW()
    this.$refs.searchBox.focus()
    this.setPlaceholder() // 设置默认搜索level为8的一条数据
    this.setHistory()
    console.log('init List')
    // this.renderData(2)
    // this.OnChange()
    // this.setLoadingHeight()
  },
  computed: {
    loadingHeight: function () {
      return this.setLoadingHeight()
    }
  },
  filters: {
    filterRemark: function (v) {
      if (JSON.stringify(v).indexOf('第') > -1) {
        return '更新至' + v.replace('第', '')
      } else if (JSON.stringify(v).indexOf('全') > -1) {
        return v
      } else {
        return '更新至' + v + '集'
      }
    }
  },
  methods: {
    goBack () {
      this.$router.push({
        path: '/HomeBox'
      })
    },
    setHistory () {
      let hs = localStorage.getItem('HistoryList')
      this.historyList = hs === '' ? [] : JSON.parse(hs)
    },
    clearHistory () {
      this.historyList = []
      localStorage.setItem('HistoryList', [])
    },
    setPlaceholder () {
      let that = this
      HomeSrv.getListDataApi(Object.assign({}, {
        mid: 1,
        page: 1,
        tid: 0,
        limit: 1,
        level: 8
      })).then((res) => {
        that.mPlaceholder = res.list[0].vod_name === undefined ? '' : res.list[0].vod_name
      })
    },
    closeIt () {
      this.$emit('on-close', false)
    },
    onChangeInput (v) {
      if (v === '') this.listData = []
      console.log('v' + v)
    },
    searchItHistory (v) {
      this.searchValue = v
      this.ajaxData.wd = v
      this.ajaxData.page = 1
      this.renderData()
      Tool.setHistoryList(this.searchValue)
    },
    searchIt () {
      if (this.searchValue === '') {
        if (this.mPlaceholder !== '') {
          this.searchValue = this.mPlaceholder
        } else {
          this.$refs.searchBox.focus()
          return
        }
      }
      Tool.setHistoryList(this.searchValue)
      this.ajaxData.wd = this.searchValue
      this.ajaxData.page = 1
      this.renderData()
    },
    load () {
      this.ajaxData.page = this.ajaxData.page + 1
      this.renderData(1)
    },
    showDetail (id) {
      this.closeIt()
      this.$router.push({
        path: '/Detail/' + id
      })
    },
    renderData (t) {
      console.log(this.loading)
      if (this.ajaxData.wd === '') return
      if (t === 2) this.ajaxData.page = 1
      this.getListData(Object.assign({}, this.ajaxData), t)
    },
    getListData (data, type) {
      let that = this
      if (type === 1) {
        that.loading = true
      } else if (type === 2) {
        that.refreshing = true
        that.loadedAll = false
      }
      HomeSrv.getSearchDataApi(data).then((res) => {
        this.setHistory()
        if (type === 1) {
          that.loading = false
          if (res.list && res.list.length > 0) {
            res.list.map((i) => {
              that.listData.push(i)
            })
            that.loadingText = '轻松加载中...'
          } else {
            that.ajaxData.page = this.ajaxData.page
            that.loadedAll = true
            that.loadingText = '主子，数据已全部加载.'
            this.$toast.info('主子，数据已全部加载', {
              position: 'bottom'
            })
          }
        } else {
          this.listData = []
          this.listData = res.list
          this.ajaxData.page = 1
          this.refreshing = false
          this.loadingText = '轻松加载中...'
          that.loading = false
          console.log('1212')
          if (res.list.length === 0) {
            this.$toast.info('暂无数据', {
              position: 'bottom'
            })
          }
        }
      })
    },
    setLoadingHeight () {
      return this.HEIGHT() - 56
    }
  }
}
</script>

<style scoped type="text/css">
  .movie-box-list-item:nth-child(3n) .movie-box-box{
    padding-right: 0;
  }
  .list-expansion-panel .button-wrapper .mu-button{
    min-width: 3rem;
  }
  .mainBox {
    height: 100%;
    flex: 1;
    -webkit-overflow-scrolling: touch;
  }
  .mainBox-load-more{
    flex: 1;
    overflow: auto;
    touch-action: none;
    -webkit-overflow-scrolling: touch;
  }
  .mainBox-filters{
    position: relative;
    min-height: 3rem;
  }
  .mainBox-filters .list-expansion-panel{
    background: #fafafa;
    position: fixed;
    z-index: 11111;
    width: 100%;
  }
  .historyBtn {
    margin: 0 .5rem .7rem 0;
    background-color: #f8f8f8;
    min-width: 3rem;
    box-shadow: none;
  }
</style>
