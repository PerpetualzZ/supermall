import { ADD_COUNTER, ADD_TO_CART } from './mutations-types'

export default {
    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    [ADD_COUNTER](state, payload) {
      payload.count++
    },
    [ADD_TO_CART](state, payload) {
      payload.checked = true // 给商品添加一个checked属性 加入购物车是否选中还是不选中状态
      state.cartList.push(payload)
    }
}
