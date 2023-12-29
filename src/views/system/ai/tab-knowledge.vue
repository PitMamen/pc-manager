<template>
  <div class="tab">
    <div class="top">
      <img src="@/assets/ai/robot.png" />
      <div class="welcome">
        <div class="value">
          作为一个医疗人工智能模型，我已经学习了海量医疗知识，您可以在右侧选择药品、指南、病历进行智能化的查询
        </div>
      </div>
    </div>
    <info-compass ref="infoCompass" />
  </div>
</template>

<script>
import infoCompass from './info-compass'

export default {
  data() {
    return {}
  },
  props: {
    conversationId: {
      type: String,
      default: '',
    },
  },
  components: {
    infoCompass,
  },
  created() {
    window.addEventListener('message', this.infoCompassHandler)
  },
  methods: {
    infoCompassHandler(evt) {
      if (evt.data) {
        if (evt.data.type === 'parent-compass-info-know') {
          this.$refs.infoCompass.open(evt.data.item, evt.data.list)
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.tab {
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 200px;
  left: 50%;
  transform: translateX(-50%);
  .top {
    display: flex;
    align-items: center;
    flex-direction: column;
    img {
      position: relative;
      left: -2px;
      margin-bottom: 10px;
      width: 58px;
      height: 58px;
    }
    .welcome {
      position: relative;
      margin-bottom: 20px;
      padding: 20px 20px;
      width: 720px;
      background: #ffffff;
      border-radius: 4px;
      &::before {
        position: absolute;
        top: -2px;
        left: 50%;
        content: '';
        width: 15px;
        height: 15px;
        transform: rotate(45deg) translateX(-50%);
        background: #ffffff;
      }
      .value {
        font-size: 12px;
        font-weight: 400;
        line-height: 22px;
        color: #1a1a1a;
      }
    }
  }
}
</style>
