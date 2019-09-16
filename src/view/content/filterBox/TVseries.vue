<template>
  <div class="mainBox" ref="mainBox">
    <mFilters
      :typeFilter="typeFilter"
      :year="ajaxData.year"
      :area="ajaxData.area"
      :tid="ajaxData.tid"
      :addressFilter="addressFilter"
      :yearFilter="yearFilter"
      @on-filter="setFilters"></mFilters>
    <div class="mainBox-load-more"
         ref="mainBoxLoadMore"
         :style="{height:loadingHeight + `px`}">
      <mu-load-more @refresh="renderData(2)"
                    :refreshing="refreshing"
                    :loading="loading"
                    :loading-text="loadingText"
                    :loaded-all="loadedAll"
                    @load="load(1)">
        <div class="movie-box movie-box-list">
          <div class="movie-box-item movie-box-list-item"
               v-for="item in listData"
               :key="item.vod_id"
               @click="showDetail(item.vod_id)">
            <div class="movie-box-box">
              <div class="movie-img">
                <img v-lazy="item.vod_pic" class="lazyload-image">
                <span class="tips">{{item.vod_remarks | filterRemark}}</span>
                <span class="mask"></span>
                <span class="score">{{item.vod_score}}</span>
              </div>
              <div class="movie-name">
                <p>{{item.vod_name}}</p>
              </div>
            </div>
          </div>
        </div>
      </mu-load-more>
    </div>
  </div>
</template>

<script>import { HomeSrv } from '@/service'
import Tool from '@/utils/tools'
import mFilters from '@/components/filters'
export default {
  name: 'TVseries',
  components: {
    mFilters
  },
  inject: ['CACHEVIEW', 'HEIGHT'],
  data () {
    return {
      refreshing: false,
      loading: false,
      loadingText: '轻松加载中...',
      loadedAll: false,
      // loadingHeight: '',
      filters: 0,
      zDepth: 0,
      isLoading: false,
      searchValue: '',
      ajaxData: {
        mid: 1,
        page: 1,
        limit: 15,
        tid: 2,
        year: '全部',
        area: '全部'
      },
      filterResult: [
        'Apple',
        'Banana'
      ],
      addressFilter: [],
      yearFilter: Tool.setFiltersCondition.TV.YEAR,
      typeFilter: Tool.setFiltersCondition.TV.TYPE,
      listData: []
    }
  },
  computed: {
    loadingHeight: function () {
      return this.setLoadingHeight()
    }
  },
  filters: {
    filterRemark: function (v) {
      return Tool.setTidFilters['TV'](v)
    }
  },
  mounted () {
    // this.CACHEVIEW()
    this.renderData(2)
    // this.setLoadingHeight()
  },
  methods: {
    load () {
      this.ajaxData.page = this.ajaxData.page + 1
      this.renderData(1)
    },
    setFilters (v, type) {
      if (type === 1) {
        this.ajaxData.tid = v
      } else if (type === 2) {
        this.ajaxData.area = v
      } else if (type === 3) {
        this.ajaxData.year = v
      }
      this.$refs.mainBoxLoadMore.scrollTop = 0
      this.ajaxData.page = 1
      this.filters = 0
      this.renderData(2)
    },
    showDetail (id) {
      this.$router.push({
        path: '/Detail/' + id
      })
    },
    renderData (t) {
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
      console.log(this.ajaxData.page)
      HomeSrv.getListDataApi(data).then((res) => {
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
          }
        } else {
          that.listData = res.list
          setTimeout(function () {
            that.refreshing = false
            that.loadingText = '轻松加载中...'
          }, 800)
        }
      })
    },
    setLoadingHeight () {
      console.log('this.HEIGHT' + this.HEIGHT())
      return this.HEIGHT() - 156
    }
  }
}
</script>

<style scoped type="text/css">
  .movie-box-list-item:nth-child(3n) .movie-box-box{
    padding-right: 0;
  }
  .button-wrapper {
    /*display: flex;*/
    /*flex-wrap: nowrap;*/
    /*overflow-x: auto;*/
    /*text-align: center;*/
    padding: 0;
  }
  .list-expansion-panel .button-wrapper .mu-button{
    min-width: 3rem;
  }
  .mainBox {
    height: 100%;
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .mainBox-load-more{
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .mainBox-filters{
    position: relative;
  }
  .mainBox-filters .list-expansion-panel{
    background: #fafafa;
    position: fixed;
    z-index: 11111;
    width: 100%;
  }
</style>
