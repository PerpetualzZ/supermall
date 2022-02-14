<template>
  <div id="detail">
    <detail-nav-bar />
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @loadImg="loadImg" />
      <detail-param-info :param-info="paramInfo" />
      <detail-comment-info :comment-info="commentInfo" />
      <goods-list :goods="recommends" />
    </scroll>
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

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'

  import {
    debounce
  } from 'common/utils.js'

  import {
    getDetail,
    Goods,
    Shop,
    GoodsParam,
    getRecommend
  } from 'network/detail'

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

      Scroll,
      GoodsList
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
        itemImgListener: null
      }
    },
    methods: {
      // 监听图片加载完后 刷新一次
      loadImg() {
        this.$refs.scroll.refresh()
      },
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid

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
      })

      // 3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
        console.log(res);
      })
    },

    mounted() {
      // 1.图片加载完成的事件监听 防抖
      const newRefesh = debounce(this.$refs.scroll.refresh, 200)
      this.itemImgListener = () => {
        newRefesh()
      }
      this.$bus.$on('itemImgLoad', this.itemImgListener)
    },

    // 离开页面的时 销毁监听事件。
    destroyed() {
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    }
  }

</script>

<style scoped>
  .content {
    /* 固定滚动高度 */
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 0;
    left: 0;
    right: 0;
  }

</style>
