<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" v-if="hasPerm('sysPos:page')">
      <!-- <p class="title">医生列表</p> -->
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="问卷管理">
              <a :href="quesUrl" target="_blank">跳转问卷管理</a>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- <add-form ref="addForm" @ok="handleOk" v-if="false" /> -->
  </a-card>
</template>

<script>
import { STable } from '@/components'

export default {
  components: {},

  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      quesUrl: '',

      // 查询参数
      queryParam: { yljgdm: '444885559' },

      // 加载数据方法 必须为 Promise 对象
      selectedRowKeys: [],
      selectedRows: [],
      production: process.env.NODE_ENV === 'production',
    }
  },

  created() {

    if (this.production) {
      //生产环境
      this.quesUrl = 'http://hmg.mclouds.org.cn/login'
    } else {
      //测试环境
      this.quesUrl = 'http://192.168.1.122/login'
    }
  },

  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced
    },

    handleOk() {
      this.$refs.table.refresh()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
  },
}
</script>

<style lang="less">
.table-operator {
  margin-bottom: 18px;
}
button {
  margin-right: 8px;
}

.title {
  background: #fff;
  font-size: 18px;
  font-weight: bold;
  color: #000;
}
</style>
