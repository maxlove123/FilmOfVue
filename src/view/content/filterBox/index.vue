<template>
  <div class="mainBox filterBox" ref="mainBox">
    <mu-flex class="flex-wrapper" justify-content="center" style="padding: 8px 0">
      <mu-button :to="{name: 'Movie'}" :flat="onActive !== 0" :color="onActive === 0?'secondary':''" @click="showIt('Movie')">电影</mu-button>
      <mu-button :to="{name: 'TVseries'}" :flat="onActive !== 1" :color="onActive === 1?'secondary':''" @click="showIt('TVseries')">电视剧</mu-button>
      <mu-button :to="{name: 'Variety'}" :flat="onActive !== 2" :color="onActive === 2?'secondary':''" @click="showIt('Variety')">综艺</mu-button>
      <mu-button :to="{name: 'Anime'}" :flat="onActive !== 3" :color="onActive === 3?'secondary':''" @click="showIt('Anime')">动漫</mu-button>
    </mu-flex>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'FilterBox',
  data () {
    return {
      onActive: 0,
      isShow: {
        Movie: true,
        TVseries: false,
        Variety: false,
        Anime: false
      }
    }
  },
  inject: ['CACHEVIEW', 'HEIGHT'],
  computed: {
    cachedViews () {
      return this.$store.state.cache.cachedViews
    },
    isRefreshView () {
      return this.$store.state.cache.isRefreshView
    }
  },
  mounted () {
    this.CACHEVIEW()
    this.$store.dispatch('addCacheViews', this.$route.matched[1])
    console.log('catch' + JSON.stringify(this.$store.state.cache.cachedViews))
  },
  methods: {
    showIt (v) {
      switch (v) {
        case 'Movie':
          this.onActive = 0
          break
        case 'TVseries':
          this.onActive = 1
          break
        case 'Variety':
          this.onActive = 2
          break
        case 'Anime':
          this.onActive = 3
          break
        default: break
      }
    },
    setLoadingHeight () {
      console.log('this.HEIGHT' + this.HEIGHT())
      return this.HEIGHT() - 110
    }
  }
}
</script>

<style scoped>

</style>
