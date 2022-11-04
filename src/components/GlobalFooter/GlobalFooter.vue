<template>
  <div class="footer" v-if="false">
    <div class="links">
    </div>
    <div class="copyright">
      Copyright  2019-2021. <a target="_blank" href="" v-if ="false">stylefeng</a> All Rights Reserved.|ICP证：湘ICP备16002828号-4
      <!-- fixedPart Copyright © 2020 <a target="_blank" href="https://www.stylefeng.cn/">stylefeng</a> All rights reserved. Guns-Seperation v1.1.1 -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlobalFooter',
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.footer {
  padding: 0 16px;
  margin: 48px 0 24px;
  text-align: center;

  .links {
    margin-bottom: 8px;

    a {
      color: rgba(0, 0, 0, 0.45);

      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
