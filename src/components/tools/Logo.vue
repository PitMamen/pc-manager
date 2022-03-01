<template>
  <div class="logo">
    <!-- fixedPart 改名字，换图片 <router-link :to="{name:'Console'}"> -->
    <router-link :to="{name:'Console'}">
      <LogoSvg alt="logo"  v-if="false"/>
      <img src="~@/assets/logo.png"/>
      <!-- <img src="~@/assets/logo.png" class="logo" alt="logo">-->
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  props: {
    title: {
      type: String,
      // default: '后台管理系统',
      default: '患者服务管理系统',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
