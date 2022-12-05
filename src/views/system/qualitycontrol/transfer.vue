<template>
  <a-modal
    :title="title"
    :width="730"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
  >
    <div style="margin-top: 20px" class="div-total1" v-for="(item, index) in nameList" :key="index">
      <a-radio-group name="radioGroup" :default-value="1">
        <a-radio :value="item.id">
          {{ item.name }}
        </a-radio>
        <a-radio :value="item.id">
          {{ item.name }}
        </a-radio>
        <a-radio :value="item.id">
          {{ item.name }}
        </a-radio>
      </a-radio-group>
    </div>
  </a-modal>
</template>
  
          
  <script>
import moment from 'moment'
import { getApplicationlist, saveaddTenand, queryTenantDetail } from '@/api/modular/system/posManage'
import { STable } from '@/components'
import Vue from 'vue'
import { TRUE_USER } from '@/store/mutation-types'
import { formatDate, formatDateFull } from '@/utils/util'
export default {
  components: {
    STable,
  },
  data() {
    return {
      rangeValue: 1,

      queryParams: {},
      nameList: [
        { id: 1, name: '李三' },
        { id: 2, name: '张氏' },
        { id: 3, name: '里的' },
        { id: 4, name: '散步' },
        { id: 5, name: '物流' },
        { id: 6, name: '七八' },
        { id: 6, name: '酒哦' },
      ],
      queryParamsApp: {
        applicationName: '',
        applicationType: '', //1内部应用,2外部应用
        status: 1, //1开启,2关闭
      },

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      title: '任务转移',
    }
  },

  watch: {
    timeStr() {},
  },
  methods: {
    moment,
    //初始化方法
    transfer(record) {
      this.visible = true
    },

    radioChange(event) {
      if (event.target.value == 1) {
        rangeValue = 1
      } else {
        rangeValue = 2
      }
    },

    /**
     * 取消
     */
    handleCancel() {
      this.visible = false
    },

    /**
     * 提交
     */
    handleSubmit() {},
  },
}
</script>
  
  
  <style lang="less">
.display-item {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  /* // justify-content: center; */
  /* // margin-top: -20px; */
}
</style>