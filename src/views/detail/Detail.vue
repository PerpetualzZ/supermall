<template>
  <div id="detail">
    <detail-nav-bar @titleClick="titleClick" ref="nav"/>
    <scroll class="content"
            ref="scroll"
            :probe-type = "3"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @loadImg="loadImg" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <detail-bottom-bar @addCart="addToCart" />
    <back-top
            @click.native="backClick"
            v-show="isShowBackTop"/>
    <!-- 点击弹窗 -->
    <!-- <toast :message="message" :show="show"></toast> -->
  </div>
</template>

<script>
  import DetailNavBar from 'views/detail/childComps/DetailNavBar'
  import DetailSwiper from 'views/detail/childComps/DetailSwiper'
  import DetailBaseInfo from 'views/detail/childComps/DetailBaseInfo'
  import DetailShopInfo from 'views/detail/childComps/DetailShopInfo'
  import DetailGoodsInfo from 'views/detail/childComps/DetailGoodsInfo'
  import DetailParamInfo from 'views/detail/childComps/DetailParamInfo'
  import DetailCommentInfo from 'views/detail/childComps/DetailCommentInfo'
  import DetailBottomBar from 'views/detail/childComps/DetailBottomBar'

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'
  // import Toast from 'components/common/toast/Toast'; // 点击弹窗

  import { getDetail, Goods, Shop, GoodsParam, getRecommend } from 'network/detail'
  import { itemListenerMixin, backTop } from 'common/mixin'

  import { mapActions } from 'vuex'

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,

      Scroll,
      GoodsList,
      // Toast // 点击弹窗
    },
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        currentIndex: 0,
        // message: '', // 点击弹窗
        // show: false, // 点击弹窗
      }
    },

    mixins: [itemListenerMixin, backTop],

    methods: {
      ...mapActions([  // mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性：
        'addCart'
      ]),

      // 监听图片加载完后 刷新一次
      loadImg() {
        this.$refs.scroll.refresh()
        // 点击滚动对应内容方法
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        // this.themeTopYs.push(Number.MAX.VALUE) // 获取最大值
        console.log(this.themeTopYs);
      },
      // 点击滚动某一个位置(x轴, y轴, 时间)
      titleClick(index) {
        // console.log(index);
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500)
      },
      // 监听滚动的事件 对应标题
      contentScroll(position) {
        // console.log(position);
        // 获取y值
        const positionY = -position.y

        // 2.positionY和主题中值进行对比
        // 标题的四个值 [0, 16455, 17727, 17944, Number.MAX.VALUE]
        // 如果 positionY 在 0 和16455 之间 index = 0
        // 如果 positionY 在 =16455 和 17727 之间 index = 1
        // 如果 positionY 在 17727 和 17944 之间 index = 2

        // 如果 positionY >= 17944 时 index = 3
        let length = this.themeTopYs.length
        for(let i = 0; i < length; i++) {
          if (this.currentIndex !== i  // 1.条件1 防止赋值的过程过于频繁
            // 条件二：判断区间：在0和某个数字之间 i < length - 1
            && (i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])
            // 条件二：判断大于：i === length - 1
            || (i === length - 1 && positionY >= this.themeTopYs[i])) {
              // 对于上面一长串的范围判断使用this.themeTopYs.push(Number.MAX.VALUE);
              // 这样可以省去 || 之后的判断代码
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex;
          }
        }

        // 3.是否显示回到顶部
        this.isShowBackTop = (-position.y) > 1000
      },

      // 4.点击回到顶部
      backClick() {
        this.$refs.scroll.scrollTo(0, 0)
      },

      // 点击加入购物车
      addToCart() {
        // 1.获取购物车需要展示的信息
        const product = {}
        product.iid = this.iid; // 商品的唯一标识
        product.image = this.topImages[0],
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.newPrice
        product.realPrice = this.goods.realPrice;

        // 2.将商品添加到购物车
        // this.$store.commit('addCart', product)  // mutations里不建议这么做

        // 2.将商品添加到购物车 // 方法1
        // this.$store.dispatch('addCart', product).then(res => { // dispatch可以返回一个promise
        //   console.log(res);
        // })

        // 2.将商品添加到购物车 // 方法2 利用mapGetters辅助函数映射到局部计算属性
        this.addCart(product).then(res => {
        //   this.show = true
        //   this.message = res;
        //   setTimeout(() => {
        //     this.show = false
        //     this.message = ''
        //   }, 2000)

        // 2.将商品添加到购物车 // 方法3 封装Toast
          this.$toast.isShow(res, 2000)
        })


      }
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid
      console.log(this.iid);

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // console.log(res);

        // 1.获取数据
        const data = res.result

        // 2.获取顶部的图片轮播数据
        this.topImages = data.itemInfo.topImages

        // 3.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        // console.log(this.goods);

        // 4.创建店铺信息
        this.shop = new Shop(data.shopInfo)
        // console.log(this.shop);

        // 5.保存商品的详情信息
        this.detailInfo = data.detailInfo;
        // console.log(this.detailInfo);

        // 6.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        // console.log(this.paramInfo);

        // 7.取出评论信息(有些商品是没有评伦信息的 所以最好做一个判断)
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
      }),

      // 3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
        // console.log(res);
      })
    },

    mounted() {

    },

    // updated	data更新时触发
    // updated() {
    //   // 点击滚动对应内容方法一
    //   this.themeTopYs = [] // 给getthemeTopY赋值(进行防抖）
    //   // 组件不是DOM元素要加$el
    //   this.themeTopYs.push(0);
    //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
    //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
    //   console.log(this.themeTopYs);
    // },

    // 离开页面的时 销毁监听事件。
    destroyed() {
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    }
  }

</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    /* 固定滚动高度 */
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 0;
    left: 0;
    right: 0;

    background-color: #fff;
    height: calc(100% - 44px - 49px);
  }

</style>
