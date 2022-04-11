import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

// 1.安装插件
Vue.use(Vuex)

// 2.创建store对象
const state = {
  cartList: []
}

const store = new Vuex.Store({
  state,

  // mutations唯一的目的就是修改state中状态
  // mutations中的每个方法尽可能完成的比较单一
  mutations,

  // Action 类似于 mutation，不同在于：
  // Action 提交的是 mutation，而不是直接变更状态
  // Action 可以包含任意异步操作
  actions,

  // 有时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数：
  // 如果有多个组件需要用到此属性，我们要么复制这个函数，
  // 或者抽取到一个共享函数然后在多处导入它——无论哪种方式都不是很理想。
  getters,
})

// 3.挂载到Vue实例上
export default store
