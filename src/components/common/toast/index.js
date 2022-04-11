import Toast from './Toast'

const obj = {}

obj.install = function(Vue) {
  // document.body.appendChild(Toast.$el)

  // 1.创建组件构造器
  const toastContrustor = Vue.extend(Toast)

  // 2.new的方式 根据组件构造器 可以创建出来一个组件对象
  const toast = new toastContrustor()

  // 3.将组件对象 手动挂载某一个元素上
  toast.$mount(document.createElement('div'))

  // 4.toast.$el对应的就是div
  document.body.appendChild(toast.$el)  // 将上面创建的div元素加入到BODY的尾部

  // 5.添加事件总线
  Vue.prototype.$toast = toast;
}

export default obj
