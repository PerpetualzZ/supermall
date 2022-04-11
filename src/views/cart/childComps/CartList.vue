<template>
  <div class="cat-list">
    <scroll class="content">
      <cart-list-item
          v-for="(item, index) in cartList"
          :key="index"
          :item-info="item"/>
    </scroll>
  </div>
</template>

<script>
  import CartListItem from './CartListItem'
  import Scroll from 'components/common/scroll/Scroll'

  import { mapGetters } from 'vuex'

  export default {
    name: 'CartList',
    components: {
      CartListItem,
      Scroll
    },
    computed: {
      ...mapGetters([
        'cartList',
      ])
    }
  }

</script>

<style scoped>
  .cat-list {
    height: calc(100% - 44px - 49px - 40px);
  }

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>
