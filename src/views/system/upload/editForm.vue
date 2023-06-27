<template>
  <a-modal
    title="上传记录"
    :width="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    :footer="null"
    @cancel="handleCancel"
  >
    <div class="record-wrap">
      <a-timeline style="margin-top: 10px">
        <a-timeline-item v-for="(itemChild, indexChild) in recordData" :key="indexChild" :value="itemChild.id"
          >{{ itemChild.createTime }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
            itemChild.uploadStatus == 1 ? '上传成功' : '上传失败'
          }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ itemChild.uploadReturn.msg }}</a-timeline-item
        >
        <!-- <a-timeline-item v-for="(itemChild, indexChild) in recordData" :key="indexChild" :value="itemChild.id"
          >{{ itemChild.time }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
            itemChild.result == 1 ? '上传成功' : '上传失败'
          }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ itemChild.des }}</a-timeline-item
        > -->
      </a-timeline>
    </div>
  </a-modal>
</template>

<script>
import { getPreUploadLogList } from '@/api/modular/system/posManage'
import { formatDateFull, formatDate } from '@/utils/util'

import moment from 'moment'
export default {
  data() {
    return {
      visible: false,
      item: {},
      recordData: [],

      title: '',
      // isEdit: false,
      confirmLoading: false,
    }
  },
  mounted() {},
  methods: {
    // 初始化方法
    edit(item) {
      this.visible = true
      this.item = item
      this.getPreUploadLogListOut()
    },

    getPreUploadLogListOut() {
      getPreUploadLogList({ orderId: this.item.orderId, type: item.type, preNo: this.item.preNo }).then((res) => {
        if (res.code == 0) {
          this.recordData = res.data

          // this.recordData.push({
          //   time: '2023-01-23',
          //   result: '上传失败',
          //   des: '网络错误',
          // })
          // this.recordData.push({
          //   time: '2023-01-23',
          //   result: '上传失败',
          //   des: '无网络',
          // })
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },
    handleSubmit() {},

    handleCancel() {
      this.visible = false
    },
    clearDatas() {
      this.form.resetFields()
    },
  },
}
</script>

<style lang="less" scoped>
.record-wrap {
  color: #4d4d4d;
  font-size: 12px;

  /deep/ .ant-timeline-item-last > .ant-timeline-item-content {
    min-height: 0 !important;
  }

  .ant-timeline-item {
    padding-bottom: 10px !important;
  }
}
</style>
