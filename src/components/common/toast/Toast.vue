<template>
  <div class="toast" v-show="show">
    <div>{{message}}</div>
  </div>
</template>

<script>
  export default {
    name: "toast",
    props: {
      // message: {
      //   type: String,
      //   default() {
      //     return ''
      //   }
      // },
      // show: {
      //   type: Boolean,
      //   default() {
      //     return false
      //   }
      // }
    },
    data() {
      return {
        message: '',
        show: false
      }
    },
    methods: {
      isShow(message, duration = 2000) {
        this.show = true;
        this.message = message

        setTimeout(() => {
          this.show = false
          this.message = ''
        }, duration)
      }
    }
  }

</script>

<style scoped>
  .toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 12px 30px;
    border-radius: 8px;

    z-index: 999;

    color: #fff;
    font-size: 18px;
    background-color: rgba(0, 0, 0, .6);
  }

</style>
