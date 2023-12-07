<template>
  <div class="wrap-headLayout">
    <div class="wrap-head">
      <global-header
        :menus="[]"
      />
    </div>
    <div class="wrap-content">
      <route-view />
    </div>
  </div>
</template>

<script>
import RouteView from './RouteView'
import GlobalHeader from '@/components/GlobalHeader'

export default {
  name: 'HeadLayout',
  components: {
    RouteView,
    GlobalHeader
  },
  data () {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less">
  .wrap-headLayout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    .wrap-head {
      .header-animat {
        .sysapp-logo {
          position: relative;
          float: left;
          margin: 0 30px 0 24px;
          padding: 10px 0;
          z-index: 1;
          .icon {
            float: left;
            width: auto;
            height: 22px;
            margin-right: 20px;
          }
          .titles {
            position: relative;
            float: left;
            font-size: 20px;
            font-weight: 400;
            line-height: 22px;
            color: #FFFFFF;
            top: -2px;
          }
        }
        .header {
          .user-wrapper {
            height: 100%;
            float: right;
          }
        }
      }
    }
    .wrap-content {
      flex: 1;
    }
  }
</style>
