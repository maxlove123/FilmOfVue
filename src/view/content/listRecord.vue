<template>
  <div class="mainBox" ref="mainBox">
    <mu-appbar class="headerBar"
               title="观看记录"
               textColor="#333333"
               color="#ffffff">
      <mu-button icon slot="left" @click="closeIt" to="/My">
        <mu-icon value="arrow_back_ios" size="26" color="#999"></mu-icon>
      </mu-button>
    </mu-appbar>
    <div class="mainBox-load-more"
           ref="mainBoxLoadMore">
      <mu-card v-if="listData.length === 0"
               class="qk-card">
        <mu-card-actions :style="{height:loadingHeight - 120 + `px`, overflow: `auto`}">
          <mu-list style="background: #f7f7f7;">
          <mu-list-item button
                        v-for="(item, index) in finallyRecordList"
                        :key="index" @click="showDetail(item.id)"
                        :ripple="false">
            <mu-list-item-title>{{item.name}}</mu-list-item-title>
            <mu-button small
                       class="playBtn qk-primary"
                       color="primary"><mu-icon color="#fff" value="play_arrow"></mu-icon>播放</mu-button>
          </mu-list-item>
          </mu-list>
        </mu-card-actions>
        <mu-flex class="flex-wrapper" justify-content="center">
          <mu-fade-transition>
            <mu-button flat
                       color="#2196f3"
                       @click="clearRecord"
                       v-show="Array.isArray(finallyRecordList) && finallyRecordList.length !== 0 ? true : false">
              <mu-icon value="delete_forever"></mu-icon>清空记录
            </mu-button>
          </mu-fade-transition>
        </mu-flex>
      </mu-card>
    </div>
  </div>
</template>

<script>
import mLoading from '@/components/loading'
import Tool from '@/utils/tools'
export default {
  name: 'mList',
  components: {
    mLoading
  },
  inject: ['CACHEVIEW', 'HEIGHT'],
  data () {
    return {
      filters: 0,
      zDepth: 0,
      isLoading: false,
      searchValue: '',
      ajaxData: {
        // mid: 1,
        // page: 1,
        // limit: 15,
        wd: ''
      },
      listData: [],
      RecordList: []
    }
  },
  mounted () {
    this.setRecord()
  },
  computed: {
    loadingHeight: function () {
      return this.setLoadingHeight()
    },
    finallyRecordList: function () {
      let Arr = []
      this.RecordList && this.RecordList.map((t) => {
        Arr.push({
          time: t.split('|')[0],
          id: t.split('|')[1],
          name: t.split('|')[2],
          play: t.split('|')[3],
          pic: t.split('|')[4]
        })
      })
      return Arr
    }
  },
  filters: {
    filterRemark: function (v) {
      return Tool.FormatDate(v)
    }
  },
  methods: {
    setRecord () {
      let re = localStorage.getItem('RecordList')
      this.RecordList = re === '' ? [] : JSON.parse(re)
    },
    closeIt () {
      this.$emit('on-close', false)
    },
    clearRecord () {
      this.RecordList = []
      localStorage.setItem('RecordList', [])
    },
    editIt () {},
    showDetail (id) {
      this.closeIt()
      this.$router.push({
        path: '/Detail/' + id
      })
    },
    setLoadingHeight () {
      return this.HEIGHT() - 56
    }
  }
}
</script>

<style scoped type="text/css">
  .historyBtn {
    margin: 0 .5rem .7rem 0;
    background-color: #f8f8f8;
    min-width: 3rem;
    box-shadow: none;
  }
</style>
