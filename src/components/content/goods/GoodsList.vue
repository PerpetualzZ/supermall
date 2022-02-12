<template>
  <div class="goods">
    <goods-list-item v-for="(item) in goods" :key="item.id" :goods-item="item"></goods-list-item>
  </div>
</template>

<script>
  import GoodsListItem from './GoodsListItem'

  export default {
    name: 'GoodsList',
    components: {
      GoodsListItem
    },
    props: {
      goods: {
        type: Array,
        default () {
          return []
        }
      }
    }
  }

</script>

<style scoped>
  .goods {
    display: flex;
    /* flex必要的时候拆行 */
    flex-wrap: wrap;
    /* 均等分 */
    justify-content: space-around;
    padding: 2px;
  }

</style>
