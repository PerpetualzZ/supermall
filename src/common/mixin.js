import { debounce } from './utils';
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMixin = {
  data() {
    return {
      imgItemListener: null, //控制首页商品图片以及详情页商品推荐列表加载显示的listener
      refresh: null
    }
  },
  mounted() {
    this.refresh = debounce(this.$refs.scroll.refresh, 500)
    this.imgItemListener = () => {
      this.refresh();
    }
    this.$bus.$on('itemImgLoad', this.imgItemListener);
  },
}

export const backTop = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false, // 是否显示返回顶部按钮
    }
  },
  methods: {
    // 点击回到顶部
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 300)
    },
  }
}
