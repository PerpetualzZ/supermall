<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from '@better-scroll/core'
  import Pullup from '@better-scroll/pull-up'

  // 注册滚动插件
  BScroll.use(Pullup)

  export default {
    name: 'Scroll',
    props: {
      probeType: {
        type: Number, // 为了性能 不把probeType写死
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null,
      }
    },
    mounted() {
      // 1.创建BScroll对象
      // 通过this.$refs拿wrapper确保唯一性跟其它组件里标签名不冲突
      this.scroll = new BScroll(this.$refs.wrapper, {
        // 1. probeType 为 0，在任何时候都不派发 scroll 事件，
        // 2. probeType 为 1，仅仅当手指按在滚动区域上，每隔 momentumLimitTime 毫秒派发一次 scroll 事件，
        // 3. probeType 为 2，仅仅当手指按在滚动区域上，一直派发 scroll 事件，
        // 4. probeType 为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画
        probeType: this.probeType, // 为了性能不把probeType写死
        pullUpLoad: this.pullUpLoad,
        click: true,
        // observeImage: true  // 监听调用refresh
        mouseWheel: true,// 开启鼠标滚轮
        disableMouse: false,// 启用鼠标拖动
        disableTouch: false, // 启用手指触摸
      })

      // 2.监听滚动的位置
      if (this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', (positioin) => {
          this.$emit('scroll', positioin) // 传出自定义事件
        })
      }

      // 3.监听上拉事件
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        })
      }
    },

    // 封装scrollTo
    methods: {
      scrollTo(x, y, time = 500) {
        this.scroll && this.scroll.scrollTo(x, y, time)
      },

      refresh() {
        this.scroll && this.scroll.refresh()
      },

      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },

      getScrollY() {
        return this.scroll ? this.scroll.y : 0
      }
    }
  }

</script>

<style scoped>

</style>
