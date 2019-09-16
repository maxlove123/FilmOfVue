<template>
  <div class="mainBox-filters">
    <mu-expansion-panel
      class="list-expansion-panel"
      :expand="filters === 1"
      :zDepth="zDepth"
      @change="filters = 1">
      <div slot="header">
        <b>筛选</b>
        <span class="f-c" v-if="fName">{{fName}}</span>
        <span class="f-c" v-if="fArea">{{fArea}}</span>
        <span class="f-c" v-if="fYear">{{fYear}}</span>
      </div>
      <mu-row v-if="Array.isArray(typeFilter) && typeFilter.length !== 0">
        <mu-col span="2">
          类型
        </mu-col>
        <mu-col span="10">
          <div class="button-wrapper qk-button-wrapper">
            <mu-button small
                       v-for="item in typeFilter"
                       :key="item.tid"
                       :flat="tid === item.tid"
                       :color="tid === item.tid ? 'primary':''"
                       @click="setFilters(item.tid, 1)">{{item.name}}</mu-button>
          </div>
        </mu-col>
      </mu-row>
      <mu-row v-if="Array.isArray(addressFilter) && addressFilter.length !== 0">
        <mu-col span="2">
          地区
        </mu-col>
        <mu-col span="10">
          <div class="button-wrapper qk-button-wrapper">
            <mu-button small
                       v-for="item in addressFilter"
                       :key="item"
                       :flat="area === item"
                       :color="area === item ? 'primary':''"
                       @click="setFilters(item, 2)">{{item}}</mu-button>
          </div>
        </mu-col>
      </mu-row>
      <mu-row style="padding-bottom: 1rem;"  v-if="Array.isArray(yearFilter) && yearFilter.length !== 0">
        <mu-col span="2">
          年代
        </mu-col>
        <mu-col span="10">
          <div class="button-wrapper qk-button-wrapper">
            <mu-button small
                       v-for="item in yearFilter"
                       :key="item"
                       :flat="year === item"
                       :color="year === item ? 'primary':''"
                       @click="setFilters(item, 3)">{{item}}</mu-button>
          </div>
        </mu-col>
      </mu-row>
    </mu-expansion-panel>
  </div>
</template>

<script>export default {
  name: 'mFilters',
  data () {
    return {
      filters: 0,
      zDepth: 0,
      fName: '',
      fArea: '',
      fYear: ''
    }
  },
  props: {
    tid: {
      default: 1,
      type: [String, Number]
    },
    area: {
      default: '全部',
      type: String
    },
    year: {
      default: '全部',
      type: [String, Number]
    },
    typeFilter: {
      type: Array,
      default () {
        return []
      }
    },
    addressFilter: {
      type: Array,
      default () {
        return []
      }
    },
    yearFilter: {
      type: Array,
      default () {
        return []
      }
    }
  },
  mounted () {},
  methods: {
    setFilters (v, type) {
      this.getFiltersName(v, type)
      this.filters = 0
      this.$emit('on-filter', v, type)
    },
    getFiltersName (v, type) {
      if (type === 1) {
        let _name = this.typeFilter.find((t) => {
          return t.tid === v
        })
        this.fName = _name.name === '全部' ? '' : '-' + _name.name
      }
      if (type === 2) this.fArea = v === '全部' ? '' : '-' + v
      if (type === 3) this.fYear = v === '全部' ? '' : '-' + v
    }
  }
}
</script>

<style scoped>
.f-c{
  color: #2196f3;
}
.mainBox-filters{
  position: relative;
  min-height: 48px;
}
.mainBox-filters .list-expansion-panel{
  background: #fafafa;
  position: relative;
  z-index: 11111;
  width: 100%;
}
.list-expansion-panel .button-wrapper .mu-button{
  min-width: 3rem;
}
.qk-button-wrapper {
  white-space: nowrap;
  overflow-x: auto;
  padding-top: 0;
}
</style>
