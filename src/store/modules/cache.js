const Cache = {
  state: {
    cachedViews: [],
    isRefreshView: false,
    RouterFrom: '',
    detailNewId: '',
    searchVal: '',
    tabActive: 0
  },
  getters: {
    getRouterFrom: state => state.RouterFrom
  },
  mutations: {
    REFRESH_VISITED_VIEWS: (state, view) => {
      state.isRefreshView = true
      for (const i of state.cachedViews) {
        if (i === view.name) {
          let index = state.cachedViews.indexOf(i)
          state.cachedViews.splice(index, 1)
          break
        }
      }
      setTimeout(function () {
        state.isRefreshView = false
        if (!view.meta.noCache) state.cachedViews.push(view.name)
      }, 20)
    },
    ADD_CACHE_VIEWS: (state, view) => {
      if (!view.meta.noCache) {
        console.log('view.name' + view.name)
        if (state.cachedViews.indexOf(view.name) > -1) return
        state.cachedViews.push(view.name)
      }
    },
    SET_FROM: (state, view) => {
      state.RouterFrom = view.name
    },
    SET_DETAIL_NEW_ID: (state, id) => {
      state.detailNewId = id
    },
    SET_SEARCH_VAL: (state, val) => {
      state.searchVal = val
    },
    SET_TAB_ACTIVE: (state, val) => {
      state.tabActive = val
    }},
  actions: {
    addCacheViews ({ commit }, view) {
      commit('ADD_CACHE_VIEWS', view)
    },
    setSearchVal ({ commit }, val) {
      commit('SET_SEARCH_VAL', val)
    },
    setFrom ({ commit }, view) {
      commit('SET_FROM', view)
    },
    setDetailNewId ({ commit }, view) {
      commit('SET_DETAIL_NEW_ID', view)
    },
    setTabActive ({ commit }, val) {
      commit('SET_TAB_ACTIVE', val)
    },
    reFreshCurrentView ({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('REFRESH_VISITED_VIEWS', view)
      })
    }
  }
}
export default Cache
