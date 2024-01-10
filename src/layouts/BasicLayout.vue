<template>
  <a-layout :class="['basicLayout', 'layout', sideFlag ? 'sideAction tablet' : device]">
    <!-- SideMenu -->
    <a-drawer
      v-if="isMobile()"
      placement="left"
      :wrapClassName="`drawer-sider ${navTheme}`"
      :closable="false"
      :visible="collapsed"
      @close="drawerClose"
    >
      <side-menu
        class="side-menu"
        mode="inline"
        :menus="menus"
        :theme="navTheme"
        :collapsed="false"
        :collapsible="true"
        @sideAction="sideAction"
        @menuSelect="menuSelect"
      ></side-menu>
    </a-drawer>

    <side-menu
      v-else-if="isSideMenu()"
      class="side-menu"
      mode="inline"
      :menus="menus"
      :theme="navTheme"
      :collapsed="collapsed"
      :collapsible="true"
      @sideAction="sideAction"
    ></side-menu>

    <a-layout :class="['main-content', layoutMode, `content-width-${contentWidth}`]" :style="{ paddingLeft: contentPaddingLeft, minHeight: '100vh' }">
      <!-- layout header -->
      <global-header
        :mode="layoutMode"
        :menus="menus"
        :theme="navTheme"
        :collapsed="collapsed"
        :device="device"
        @toggle="toggle"
      />

      <!-- layout content -->
      <a-layout-content :style="{ height: '100%', margin: '20px', background: '#FFFFFF', paddingTop: fixedHeader ? '0' : '0' }">
        <multi-tab v-if="multiTab"></multi-tab>
        <transition name="page-transition">
          <route-view />
        </transition>
      </a-layout-content>

      <!-- layout footer -->
      <a-layout-footer>
        <global-footer />
      </a-layout-footer>

      <!-- Setting Drawer (show in development mode) -->
      <setting-drawer v-if="!production"></setting-drawer>
    </a-layout>
  </a-layout>
</template>

<script>
import { triggerWindowResizeEvent } from '@/utils/util'
import { mapState, mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'
import config from '@/config/defaultSettings'

import RouteView from './RouteView'
import SideMenu from '@/components/Menu/SideMenu'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'
import SettingDrawer from '@/components/SettingDrawer'
import { convertRoutes } from '@/utils/routeConvert'

export default {
  name: 'BasicLayout',
  mixins: [mixin, mixinDevice],
  components: {
    RouteView,
    SideMenu,
    GlobalHeader,
    GlobalFooter,
    SettingDrawer
  },
  data () {
    return {
      production: config.production,
      sideFlag: false,
      collapsed: false,
      menus: []
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters
    }),
    contentPaddingLeft () {
      if (!this.fixSidebar || this.isMobile()) {
        return '0'
      }
      if (this.sidebarOpened) {
        return '170px'
      }
      return '64px'
    }
  },
  watch: {
    sidebarOpened (val) {
      this.collapsed = !val
    },
    // 菜单变化
    mainMenu (val) {
      this.setMenus()
    }
  },
  created () {
    this.setMenus()
    /*const routes = convertRoutes(this.mainMenu.find(item => item.path === '/'))
    this.menus = (routes && routes.children) || []*/
    this.collapsed = !this.sidebarOpened
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
  },
  methods: {
    ...mapActions(['setSidebar']),
    // 重新生成
    setMenus () {
      const routes = convertRoutes(this.mainMenu.find(item => item.path === '/'))
      this.menus = (routes && routes.children) || []
    },
    toggle () {
      this.collapsed = !this.collapsed
      this.setSidebar(!this.collapsed)
      triggerWindowResizeEvent()
    },
    sideAction () {
      this.sideFlag = !this.sideFlag
      this.collapsed = this.sideFlag
      this.setSidebar(!this.collapsed)
      triggerWindowResizeEvent()
    },
    paddingCalc () {
      let left = ''
      if (this.sidebarOpened) {
        left = this.isDesktop() ? '170px' : '64px'
      } else {
        left = (this.isMobile() && '0') || ((this.fixSidebar && '64px') || '0')
      }
      return left
    },
    menuSelect () {
    },
    drawerClose () {
      this.collapsed = false
    }
  }
}
</script>

<style lang="less">
.basicLayout {
  height: 100%;
  .side-menu {
    position: relative;
    margin-top: 42px;
    min-height: calc(100vh - 42px) !important;
    box-shadow: none !important;
    background: #F5F5F5 !important;
    .side-action {
      display: none;
    }
    > .ant-layout-sider-children {
      > .ant-menu {
        color: #1A1A1A;
        padding: 0 0 15px 0 !important;
        background: #F5F5F5 !important;
        > .ant-menu-item {
          > a {
            color: #1A1A1A;
          }
        }
      }
      .ant-menu-item > a {
        color: #666666;
      }
      .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
        background-color: #eff7ff;
        > a {
          color: #1890ff !important;
        }
      }
      .ant-menu-vertical .ant-menu-item,
      .ant-menu-vertical-left .ant-menu-item,
      .ant-menu-vertical-right .ant-menu-item,
      .ant-menu-inline .ant-menu-item,
      .ant-menu-vertical .ant-menu-submenu-title,
      .ant-menu-vertical-left .ant-menu-submenu-title,
      .ant-menu-vertical-right .ant-menu-submenu-title,
      .ant-menu-inline .ant-menu-submenu-title {
        margin-top: 0px !important;
        margin-bottom: 0px !important;
      }
    }
  }
  .main-content {
    height: 100%;
    > .header-animat {
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
    }
  }
  &.desktop {
    .side-menu {
      flex: 0 0 170px !important;
      max-width: 170px !important;
      min-width: 170px !important;
      width: 170px !important;
      .side-action {
        display: block;
        .anticon-left {
          display: block;
        }
        .anticon-right {
          display: none;
        }
      }
    }
    .main-content {
      height: 100%;
      margin-left: -170px !important;
      > .ant-layout-content {
        display: flex;
        flex: 1;
        flex-direction: column;
        margin-left: 170px !important;
        margin-right: 0px !important;
        margin-bottom: 0px !important;
      }
    }
  }
  &.tablet {
    .side-menu {
      flex: 0 0 64px !important;
      max-width: 64px !important;
      min-width: 64px !important;
      width: 64px !important;
      > .ant-layout-sider-children {
        > .ant-menu {
          &.ant-menu-inline-collapsed {
            width: 64px;
          }
        }
        .ant-menu-inline-collapsed > .ant-menu-item,
        .ant-menu-inline-collapsed > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-item,
        .ant-menu-inline-collapsed > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-submenu > .ant-menu-submenu-title,
        .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
          padding: 0 24px !important;
        }
      }
    }
    .main-content {
      margin-left: -64px !important;
      > .header-animat {
        .sysapp-logo {}
      }
      > .ant-layout-content {
        margin-left: 84px !important;
        height: calc(100vh - 82px) !important;
      }
    }
  }
  &.mobile {
    .side-menu {}
    .main-content {
      > .header-animat {
        .sysapp-logo {
          display: none;
        }
      }
    }
  }
  &.sideAction {
    .side-menu {
      .side-action {
        display: block !important;
        .anticon-left {
          display: none !important;
        }
        .anticon-right {
          display: block !important;
        }
      }
    }
  }
}
.ant-menu-submenu-popup {
  > .ant-menu {
    min-width: 120px !important;
    > .ant-menu-item {
      > a {
        color: #666666;
      }
    }
  }
  .ant-menu-vertical .ant-menu-item,
  .ant-menu-vertical-left .ant-menu-item,
  .ant-menu-vertical-right .ant-menu-item,
  .ant-menu-inline .ant-menu-item,
  .ant-menu-vertical .ant-menu-submenu-title,
  .ant-menu-vertical-left .ant-menu-submenu-title,
  .ant-menu-vertical-right .ant-menu-submenu-title,
  .ant-menu-inline .ant-menu-submenu-title {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    padding: 0 15px !important;
    font-size: 14px !important;
  }
}
</style>
<style lang="less">
.page-transition-enter {
  opacity: 0;
}
.page-transition-leave-active {
  opacity: 0;
}
.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
