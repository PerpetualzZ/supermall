<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button" :is-checked="isSelectAll" @click.native="checkClick" />
      <span>全选</span>
    </div>

    <div class="price">
      合计: {{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去计算: {{checkLength}}
    </div>
  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton'

  export default {
    name: "CartBottomBar",
    components: {
      CheckButton
    },
    computed: {
      // filter() 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。
      totalPrice() {
        return '¥' + this.$store.getters.cartList.filter(item => { // 过滤item.checked是否为true 如果是返回给item
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.realPrice * item.count
        }, 0).toFixed(2) // 取后小数点后两位的值
      },

      checkLength() {
        return this.$store.getters.cartList.filter(item => item.checked).length
      },


      isSelectAll() {
        // 方法2的性能比方法1高

        // 方法1
        // const num = 10  console(!num)  // false
        // const num = 0  console(!num)  // ture
        // 先从数组中找有没有不被选中的个数 !item.checked 取返就是找不被选中
        // 如果列表有不被选中的 那么按钮就是false
        // 如果列表没有不被选中的/就是全选中的 那么按钮就是true
        // if(this.$store.getters.cartList.length === 0) return false // 如果它的长度等等于0 那么返回false
        // return !this.$store.getters.cartList.filter(item => !item.checked).length

        // 方法2 find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
        // 如果列表有一个不被选中的 那么按钮就是false
        // 如果列表没有不被选中的/就是全选中的 那么按钮就是true
        if (this.$store.getters.cartList.length === 0) return false // 如果它的长度等等于0 那么返回false
        // return !this.$store.getters.cartList.find(item => !item.checked)

        // 方法3 遍历方法
        for (let item of this.$store.getters.cartList) {
          if (!item.checked) {
            return false // 查找有不被选中的
          }
        }
        return true // 没有不被选中的/就是全选中的
      }
    },

    methods: {
      // forEach方法中的function回调支持3个参数：value：遍历的数组内容；index：对应的数组索引，array：数组本身。

      // 如果原来都是选中 点击一次 全部不选中
      // 如果原来都是不选中(或许某些不选中) 全部选中

      // 方法1
      checkClick() {
        if (this.isSelectAll) { // 全部选中
          this.$store.getters.cartList.forEach(item => item.checked = false)
        } else {
          this.$store.getters.cartList.forEach(item => item.checked = true) // 全部不选中
        }
      },

      calcClick() {
        if (!this.isSelectAll)
          this.$toast.isShow('选择购买的商品', 2000)
      }
    }
  }

</script>

<style scoped>
  .bottom-bar {
    height: 40px;
    line-height: 40px;
    background-color: #eee;
    position: relative;
    display: flex;
  }

  .check-content {
    display: flex;
    align-items: center;
  }

  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin: 0px 10px;
  }

  .price {
    margin-left: 30px;
  }

  .calculate {
    width: 100px;
    color: #fff;
    text-align: center;
    background-color: var(--color-tint);
    position: absolute;
    right: 0px;
  }

</style>
