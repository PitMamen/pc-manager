<template>
  <a-modal :width="900" :footer="null" :closable="false" :visible="visible" wrapClassName="compass-info">
    <div class="wrap-info">
      <div class="head">
        <div class="title" :title="title">{{ title }}</div>
        <a-icon type="close-circle" @click="close()" />
      </div>
      <div class="content">
        <div class="value">{{ content }}</div>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      content: '',
      visible: false,
    }
  },
  methods: {
    open(item, list) {
      this.visible = true
      this.content = item.contents.join('，')
      const title_ = list.find((item) => {
        return item.name === '篇名'
      })
      if (title_) {
        this.title = title_.contents.join('，')
      }
    },
    close() {
      this.visible = false
      this.content = ''
      this.title = ''
    },
  },
}
</script>

<style lang="less">
.compass-info {
  .ant-modal-body {
    padding: 0px !important;
  }
}
</style>
<style lang="less" scoped>
.wrap-info {
  background: #ffffff;
  .head {
    position: relative;
    padding: 10px 40px;
    border-bottom: 1px solid #e6e6e6;
    .title {
      font-size: 14px;
      font-weight: 600;
      line-height: 24px;
      text-align: center;
      color: #1a1a1a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .anticon {
      position: absolute;
      top: 5px;
      right: 5px;
      padding: 10px;
      font-size: 16px;
      color: #666666;
      cursor: pointer;
    }
  }
  .content {
    padding: 20px 20px;
    height: 400px;
    overflow-y: auto;
    .value {
      font-size: 12px;
      font-weight: 400;
      line-height: 22px;
      color: #1a1a1a;
      word-break: break-all;
    }
  }
}
</style>
