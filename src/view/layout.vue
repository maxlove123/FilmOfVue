<template>
  <div :class="'layout ' + (layoutPadding?`layoutPadding`:``)"
       style="padding-top: 0"
       data-mu-loading-color="#2196f3"
       data-mu-loading-overlay-color="rgba(255, 255, 255, .8)"
       v-loading="playLoading">
    <mHeader v-show="showHeader" :backgroundColor="backgroundColor" @open="openDrawer"></mHeader>
    <keep-alive :include="cachedViews">
      <router-view v-if="!isRefreshView"/>
    </keep-alive>
    <mFooter v-show="showFooter"></mFooter>
    <mu-drawer :open.sync="open" :docked="docked" :right="position === 'right'">
      <mu-list>
        <mu-list-item button>
          <mu-list-item-title>Menu Item 1</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button>
          <mu-list-item-title>Menu Item 2</mu-list-item-title>
        </mu-list-item>
        <mu-list-item  @click="open = false" button>
          <mu-list-item-title>Close</mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-drawer>
  </div>
</template>

<script>
import mFooter from './footer'
import mHeader from './header'

export default {
  name: 'layout',
  data () {
    return {
      showHeader: true,
      showFooter: true,
      playLoading: false,
      layoutPadding: 0,
      backgroundColor: '',
      docked: false,
      open: false,
      position: 'left'
    }
  },
  components: {
    mHeader,
    mFooter
  },
  provide () {
    return {
      CACHEVIEW: this.addCache,
      HEIGHT: this.pageHeight,
      REFRESH: this.refreshCurrentView,
      JX: this.getJX,
      SETBG: this.setBg
    }
  },
  computed: {
    cachedViews () {
      return this.$store.state.cache.cachedViews
    },
    isRefreshView () {
      return this.$store.state.cache.isRefreshView
    }
  },
  mounted () {
    this.addCache()
  },
  watch: {
    '$route': function (to, from) {
      // console.log(this.$route)
      if (to.name === 'HomeBox') {
        this.showHeader = true
        this.showFooter = true
      } else if (to.name === 'Detail' || to.name === 'List') {
        console.log('to.name' + to.name)
        this.showHeader = false
        this.showFooter = false
      } else {
        this.showHeader = false
        this.showFooter = true
      }
      this.addCache()
      console.log('catch' + JSON.stringify(this.$store.state.cache.cachedViews))
    }
  },
  methods: {
    openDrawer (v) {
      this.open = !this.open
    },
    generateRoute () {
      if (this.$route.name) {
        return this.$route
      }
      return false
    },
    hideLoading () {
      let that = this
      that.playLoading = true
      setTimeout(function () {
        that.playLoading = false
      }, 1200)
    },
    addCache () {
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      this.$store.dispatch('addCacheViews', route)
    },
    refreshCurrentView () {
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      this.$store.dispatch('reFreshCurrentView', route)
    },
    pageHeight () {
      let _Height = `${document.documentElement.clientHeight}`
      return _Height - this.layoutPadding
    },
    getJX () {
      let _JX = localStorage.getItem('jx')
      return JSON.parse(_JX)
    },
    setBg (v) {
      if (v < 1000) this.backgroundColor = 'rgba(0, 0, 0, ' + v * 0.001 + ')'
    }
  }
}
</script>

<style scoped>
.layout{
  height: 100vh;
  overflow: hidden;
}
.layout.layoutPadding{
  padding: 0;
}
</style>
