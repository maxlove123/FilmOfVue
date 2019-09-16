<template>
  <div class="mainBox" ref="container" :style="{height:loadingHeight + `px`}">
    <mu-load-more @refresh="init(1, 1)"
                  ref="loadMore"
                  :refreshing="MainRefreshing">
      <mu-carousel class="mCarousel"
                   @touchstart.native="$event.stopPropagation()"
                   hide-controls>
        <mu-carousel-item
          v-for="item in carouselListData"
          :key="item.vod_id">
          <img v-lazy="item.vod_pic_slide"
               @click="showDetail(item.vod_id)"/>
          <span>{{item.vod_name}}</span>
        </mu-carousel-item>
      </mu-carousel>
      <div class="movie-box" v-if="listData1? true:false">
        <div class="box-tilte">
          <h2>热门电影<mu-icon class="sign" value="slideshow" color="#2BA2F1"></mu-icon></h2>
          <!--<mu-icon-->
          <!--value="chevron_right"-->
          <!--class="title-more"-->
          <!--size="24"-->
          <!--color="#C6C6C6"></mu-icon>-->
        </div>
        <ul>
          <li class="movie-box-item"
              v-for="item in listData1"
              :key="item.vod_id"
              @click="showDetail(item.vod_id)">
            <div class="movie-box-box">
              <div class="movie-img">
                <img v-lazy="item.vod_pic" class="lazyload-image">
                <span class="tips">{{item.type.type_name}}</span>
                <span class="mask"></span>
                <span class="score">{{item.vod_score}}</span>
              </div>
              <div class="movie-name">
                <p>{{item.vod_name}}</p>
                <span>{{item.vod_blurb}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="movie-box">
        <div class="box-tilte">
          <h2>热门追剧<mu-icon class="sign" value="slideshow" color="#2BA2F1"></mu-icon></h2>
          <!--<mu-icon-->
          <!--value="chevron_right"-->
          <!--class="title-more"-->
          <!--size="24"-->
          <!--color="#C6C6C6"></mu-icon>-->
        </div>
        <ul>
          <li class="movie-box-item"
              v-for="item in listData2"
              :key="item.vod_id"
              @click="showDetail(item.vod_id)">
            <div class="movie-box-box">
              <div class="movie-img">
                <img v-lazy="item.vod_pic" class="lazyload-image">
                <span class="tips"> {{item.vod_remarks | filterRemark}}</span>
                <span class="mask"></span>
                <span class="score">{{item.vod_score}}</span>
              </div>
              <div class="movie-name">
                <p>{{item.vod_name}}</p>
                <span>{{item.vod_blurb}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="movie-box">
        <div class="box-tilte">
          <h2>娱乐在线<mu-icon class="sign" value="slideshow" color="#2BA2F1"></mu-icon></h2>
          <!--<mu-icon-->
          <!--value="chevron_right"-->
          <!--class="title-more"-->
          <!--size="24"-->
          <!--color="#C6C6C6"></mu-icon>-->
        </div>
        <ul>
          <li class="movie-box-item"
              v-for="item in listData3"
              :key="item.vod_id"
              @click="showDetail(item.vod_id)">
            <div class="movie-box-box">
              <div class="movie-img">
                <img v-lazy="item.vod_pic" class="lazyload-image">
                <span class="tips">{{item.vod_remarks | filterRemarkVa}}</span>
                <span class="mask"></span>
                <span class="score">{{item.vod_score}}</span>
              </div>
              <div class="movie-name">
                <p>{{item.vod_name}}</p>
                <span>{{item.vod_blurb}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="movie-box">
        <div class="box-tilte">
          <h2>动漫天地 <mu-icon class="sign" value="slideshow" color="#2BA2F1"></mu-icon></h2>
          <!--<mu-icon-->
          <!--value="chevron_right"-->
          <!--class="title-more"-->
          <!--size="24"-->
          <!--color="#C6C6C6"></mu-icon>-->
        </div>
        <ul>
          <li class="movie-box-item"
              v-for="item in listData4"
              :key="item.vod_id"
              @click="showDetail(item.vod_id)">
            <div class="movie-box-box">
              <div class="movie-img">
                <img v-lazy="item.vod_pic" class="lazyload-image">
                <span class="tips">{{item.vod_remarks | filterRemarkAn}}</span>
                <span class="mask"></span>
                <span class="score">{{item.vod_score}}</span>
              </div>
              <div class="movie-name">
                <p>{{item.vod_name}}</p>
                <span>{{item.vod_blurb}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </mu-load-more>
  </div>
</template>

<script>import { HomeSrv } from '@/service'
import Tool from '@/utils/tools'
import mLoading from '@/components/loading'
export default {
  name: 'HomeBox',
  components: {
    mLoading
  },
  data () {
    return {
      MainRefreshing: false,
      MainLoading: false,
      isLoading: false,
      searchValue: '',
      // defaultImg: require('@/assets/img/loading-bars.svg'),
      ajaxData: {
        mid: 1,
        page: 1,
        limit: 6,
        tid: 0
      },
      filterResult: [
        'Apple',
        'Banana'
      ],
      carouselListData: [],
      loadMORE: {
        a: true,
        b: true,
        c: true,
        d: true
      },
      listData1: [],
      listData2: [],
      listData3: [],
      listData4: []
    }
  },
  computed: {
    loadingHeight: function () {
      return this.setLoadingHeight()
    }
  },
  inject: ['CACHEVIEW', 'HEIGHT', 'SETBG'],
  mounted () {
    this.init(1, 0)
    this.init(1, 1)
    this.init(1, 2)
    this.init(1, 3)
    this.init(1, 4)
    this.$refs['container'].addEventListener('scroll', this.handleScroll)
  },
  filters: {
    filterRemark: function (v) {
      return Tool.setTidFilters['TV'](v)
    },
    filterRemarkVa: function (v) {
      return Tool.setTidFilters['Va'](v)
    },
    filterRemarkAn: function (v) {
      return Tool.setTidFilters['An'](v)
    }
  },
  methods: {
    init (t, s) {
      switch (s) {
        case 0:
          this.getListData(Object.assign({}, this.ajaxData, {
            tid: 0,
            level: 9,
            type: 0
          }), t)
          break
        case 1:
          this.getListData(Object.assign({}, this.ajaxData, {
            tid: 1,
            type: 1
          }), t)
          this.loadMORE.a = false
          break
        case 2:
          this.getListData(Object.assign({}, this.ajaxData, {
            tid: 2,
            type: 2
          }), t)
          this.loadMORE.b = false
          break
        case 3:
          this.getListData(Object.assign({}, this.ajaxData, {
            tid: 3,
            type: 3
          }), t)
          this.loadMORE.c = false
          break
        case 4:
        // Object.assign(a,b) 将b对象复制到a
          this.getListData(Object.assign({}, this.ajaxData, {
            tid: 4,
            type: 4
          }), t)
          this.loadMORE.d = false
          break
        default:
          break
      }
    },
    showDetail (id) {
      console.log('id' + id)
      this.$router.push({
        path: '/Detail/' + id
      })
    },
    getDate (v) {
      return Tool.FormatDate(v)
    },
    gotoAll (v) {
      this.$router.push({
        path: v
      })
    },
    getListData (data, type) {
      let that = this
      if (type === 1) {
        this.MainRefreshing = true
      }
      // data作为参数请求http://www.16kanba.com/ajax/data
      HomeSrv.getListDataApi(data).then((res) => {
        console.log("data",data)
        // res返回的数据
        console.log("res",res)
        // 根据不同的data值，返回的res.list不一样
        switch (data.type) {
          case 0:
            that.carouselListData = res.list
            break
          case 1:
            that.listData1 = res.list
            break
          case 2:
            that.listData2 = res.list
            break
          case 3:
            that.listData3 = res.list
            break
          case 4:
            that.listData4 = res.list
            break
          default:
            break
        }
        setTimeout(function () {
          that.MainRefreshing = false
        }, 1200)
      })
    },
    setLoadingHeight () {
      return this.HEIGHT() - 56
    },
    handleScroll () {
      let _TOP = this.$refs['container'].scrollTop
      // let _LOADHEIGHT = this.$refs['loadMore'].$el.clientHeight
      this.SETBG(_TOP)
      // console.log(_TOP + '---' + _LOADHEIGHT + '---' + this.HEIGHT())
      // if ((_LOADHEIGHT - (this.HEIGHT() + _TOP)) < 50) {
      //   if (this.loadMORE.b === true) {
      //     this.init(1, 2)
      //   } else if (this.loadMORE.c === true) {
      //     this.init(1, 3)
      //   } else if (this.loadMORE.d === true) {
      //     this.init(1, 4)
      //   }
      // }
    }
  }
  // destroyed () {
  //   this.$refs['container'].removeEventListener('scroll', this.handleScroll)
  // }
}
</script>

<style scoped type="text/css">
  .movie-box-item:nth-child(2n) .movie-box-box {
    padding-right: 0;
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
    touch-action: none;
    -webkit-overflow-scrolling: touch;
  }
</style>
