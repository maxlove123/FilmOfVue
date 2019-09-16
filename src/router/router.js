export default [
  {
    path: '/',
    component: resolve => require(['@/view/Layout'], resolve), // () => import('@/view/Layout'),
    leaf: false,
    redirect: 'HomeBox', // 默认就跳转此页面
    children: [
      {
        path: 'HomeBox',
        iconCls: 'ios-home',
        component: resolve => require(['@/view/content/Home'], resolve), // () => import('@/view/content/Home'),
        name: 'HomeBox',
        meta: { title: '首页', icon: 'HomeBox', noCache: false }
      },
      {
        path: 'FilterBox',
        iconCls: 'ios-home',
        component: resolve => require(['@/view/content/filterBox'], resolve), // () => import('@/view/content/filterBox'),
        name: 'FilterBox',
        redirect: 'Movie', // 默认就跳转此页面
        meta: { title: '片库', name: '片库', icon: 'dashboard', noCache: false },
        children: [
          {
            path: '/Movie',
            iconCls: 'ios-home',
            component: resolve => require(['@/view/content/filterBox/Movie'], resolve), // () => import('@/view/content/filterBox/Movie'),
            name: 'Movie',
            meta: { title: '电影', name: '电影', icon: 'dashboard', noCache: false }
          },
          {
            path: '/TVseries',
            iconCls: 'ios-home',
            component: resolve => require(['@/view/content/filterBox/TVseries'], resolve), // () => import('@/view/content/filterBox/TVseries'),
            name: 'TVseries',
            meta: { title: '电视剧', name: '电视剧', icon: 'dashboard', noCache: false }
          },
          {
            path: '/Variety',
            iconCls: 'ios-home',
            component: resolve => require(['@/view/content/filterBox/Variety'], resolve), // () => import('@/view/content/filterBox/Variety'),
            name: 'Variety',
            meta: { title: '综艺', name: '综艺', icon: 'dashboard', noCache: false }
          },
          {
            path: '/Anime',
            iconCls: 'ios-home',
            component: resolve => require(['@/view/content/filterBox/Anime'], resolve), // () => import('@/view/content/filterBox/Anime'),
            name: 'Anime',
            meta: { title: '动漫', name: '动漫', icon: 'dashboard', noCache: false }
          }
        ]
      },
      {
        path: 'Detail/:id',
        iconCls: 'ios-home',
        component: resolve => require(['@/view/content/Detailweb'], resolve), // () => import('@/view/content/Detail'),
        name: 'Detail',
        meta: { noCache: true }
      },
      {
        path: 'List',
        iconCls: 'ios-home',
        component: resolve => require(['@/view/content/list'], resolve), // () => import('@/view/content/list'),
        name: 'List',
        meta: { title: '搜索', icon: 'List', noCache: false }
      },
      {
        path: 'ListRecord',
        iconCls: 'ios-home',
        component: resolve => require(['@/view/content/listRecord'], resolve), // () => import('@/view/content/listRecord'),
        name: 'ListRecord',
        meta: { title: '记录', icon: 'List', noCache: false }
      },
      {
        path: 'GBook',
        iconCls: 'ios-home',
        component: resolve => require(['@/view/content/gbook'], resolve), // () => import('@/view/content/gbook'),
        name: 'GBook',
        meta: { title: '求片', icon: 'GBook', noCache: false }
      },
      {
        path: 'My',
        iconCls: 'ios-home',
        component: resolve => require(['@/view/content/My'], resolve), // () => import('@/view/content/My'),
        name: 'My',
        meta: { title: '我的', icon: 'My', noCache: false }
      }]
  },
  {
    path: '/Share',
    iconCls: 'ios-home',
    component: resolve => require(['@/view/content/share'], resolve), // () => import('@/view/content/share'),
    name: 'Share',
    meta: { noCache: true }
  }
]
