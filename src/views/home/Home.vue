<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
            :titles="['流行', '新款', '精选']"
            @tabClick="tabClick"
            ref="tabControl1"
            class="tab-control"
            v-show="isTabFixed"></tab-control>
    <scroll
            class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp='loadMore'>
      <home-swiper
            :banners="banners"
            @swiperImageLoad="swiperImageLoad" />
      <recommend-view
            :recommends="recommends" />
      <feature-view />
      <tab-control
            :titles="['流行', '新款', '精选']" @tabClick="tabClick" ref="tabControl2" />
      <goods-list
            :goods="showGoods" />
    </scroll>

    <!-- native 在我们需要监听一个组件的原生事件时 必须给对应的事件加上.native修饰符 才能进行监听 -->
    <back-top
            @click.native="backClick"
            v-show="isShowBackTop"/>

  </div>
</template>

<script>
  // 子组件
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  // 公共组件
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList';
  import GoodsListItem from 'components/content/goods/GoodsListItem';
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  // 数据
  import { getHomeMultidata, getHomeGoods } from 'network/home'
  import { debounce } from 'common/utils';

  // import { itemListenerMixin } from 'common/mixin'

  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,

      NavBar,
      TabControl,
      GoodsList,
      GoodsListItem,
      Scroll,
      BackTop,
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: [] },
          'new': {page: 0, list: [] },
          'sell': {page: 0, list: [] },
        },
        currentType: 'pop',
        isShowBackTop: false, // 是否显示返回顶部按钮
        tabOffsetTop: 0, //tabControl距离顶部的距离
        isTabFixed: false, //是否显示吸顶
        saveY: 0, // 记录页面离开scrollY的距离
        imgItemListener: null, //控制首页商品图片加载显示的listener
      }
    },

    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },

    // mixins: [itemListenerMixin],
    mounted() {
      // 1.监听事件总线中商品图片全部加载完成
      // 运用函数防抖动
      const refresh = debounce(this.$refs.scroll.refresh, 500)

      // 对监听的事件进行保存
      this.imgItemListener = () => {
        this.$refs.scroll.refresh()
        refresh()
      }
      // 监听item中图片加载完成
      this.$bus.$on('itemImgLoad', this.imgItemListener);

      // 2. 获取tabControl的offsetTop，做tabControl的吸顶效果
      // 注意：swiper图片加载的过程会对offset造成影响，所以需要监听swiper图片加载完成才能获取offsetTop
      // this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
    },

    destroyed() {
      console.log('home destroyed');
    },

    // 第一次进来时触发 activated 保留页面的滚动位置
    activated() {
      if( this.$refs.scroll){
        this.$refs.scroll.scrollTo(0, this.saveScrollY);
        this.$refs.scroll.refresh();
      }
      // this.$refs.scroll.scrollTo(0, this.saveScrollY, 0);
      // this.$refs.scroll.refresh();
    },

    // 离开时触发 保留页面的滚动位置
    deactivated() {
      // 1.保存Y值  页面失活时获取页面Y轴滚动的位置
      this.saveY = this.$refs.scroll.getScrollY()

      // 2.取消首页事件总线的监听，与详情页的推荐数据列表区分开
      this.$bus.$off('itemImgLoad', this.imgItemListener)
    },

    created() {
      // 1.请求多个数据
      this.getHomeMultidata()

      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },

    // 监听事件处理方法
    methods: {
      // 注意障眼法设置两个tabControl内部的currentIndex一致
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break;
          case 1:
            this.currentType = 'new'
            break;
          case 2:
            this.currentType = 'sell'
            break;
        }

        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },

      backClick() {
        this.$refs.scroll.scrollTo(0, 0)
      },

      contentScroll(position) {
        // 判断BackTop是否显示
        this.isShowBackTop = (-position.y) > 1000

        // 2.决定tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },

      loadMore() {
        this.getHomeGoods(this.currentType)
      },

      // $el获取Vue实例关联的DOM元素；
      // 当轮播图加载成功时获取tabControlOffsetTop
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },

      /**
       * 网络请求相关的方法
       */
      // 1.获取首页轮播图以及推荐数据
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // console.log(res);
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list
        })
      },

      // 2.获取商品数据
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          // 下拉刷新更多
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }

</script>

<style scoped>
  #home {
    padding-top: 44px;
    height: 100vh;

    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /* 在使用浏览器原生滚动时 为了让导航不跟随一起滚动 */
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
  }

  /* content滚动高度方法一 */
  /* .content {
    height: calc(100% - 44px);
    overflow: hidden;
  } */

  /* content滚动高度方法二 */
  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }

</style>
