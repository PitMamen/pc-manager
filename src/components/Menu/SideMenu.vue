<template>
  <a-layout-sider
    :class="['sider', isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    width="170px"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null">
    <s-menu
      :collapsed="collapsed"
      :menu="menus"
      :theme="theme"
      :mode="mode"
      @select="onSelect"
      style="padding: 16px 0px;"
    ></s-menu>
    <div class="side-action" @click="toggle">
      <a-icon class="icons" type="left" />
      <a-icon class="icons" type="right" />
    </div>
  </a-layout-sider>
</template>

<script>
import Logo from '@/components/tools/Logo'
import SMenu from './index'
import { mixin, mixinDevice } from '@/utils/mixin'

export default {
  name: 'SideMenu',
  components: { Logo, SMenu },
  mixins: [mixin, mixinDevice],
  props: {
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menus: {
      type: Array,
      required: true
    }
  },
  methods: {
    toggle () {
      this.$emit('sideAction')
    },
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>

<style lang="less" scoped>
.side-action {
  position: absolute;
  width: 16px;
  height: 32px;
  top: 338px;
  right: -16px;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0px 4px 4px 0px;
  .icons {
    margin-left: 1px;
    font-size: 12px;
    line-height: 32px;
    color: #FFFFFF;
  }
}
</style>
