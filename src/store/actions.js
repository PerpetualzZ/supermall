import { ADD_COUNTER, ADD_TO_CART } from './mutations-types'

export default {
  addCart(context, payload) {
    // plyload新添加的商品 查找之前数组中是否有该商品
    // let oldProduct = null
    // for(let item of state.cartList){
    //   if(item.iid === payload.iid) { // 循环判断item.ii是否等于paylod.iid
    //     oldProduct = item
    //   }
    // }

    // 1.查找之前数组中是否有该商品
    // find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
    // context => {state.commit}
    return new Promise((resolve, reject) => {
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      // 2.判断 oldProduct 是否有值 如果有值代表没有这件商品 把商品加到购物车 如果没有值代表有重复的商品 我们只需把数量加1
      if (oldProduct) {
        // oldProduct.count += 1
        context.commit(ADD_COUNTER, oldProduct)  // 数量加1
        resolve('当前商品数量+1')
      } else { // 添加新的商品
        payload.count = 1
        // context.state.cartList.push(payload)
        context.commit(ADD_TO_CART, payload)
        resolve('添加新的商品')
      }
    })

  }
}
