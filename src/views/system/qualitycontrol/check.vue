<template>
  <a-modal
    :title="title"
    :width="730"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
    </template>
    <div class="display-item" style="margin-left: 5px; margin-top: -21px">
      <span style="margin-top: 0px"> 审核结论 :</span>
      <a-radio-group
        name="radioGroup"
        v-model="rangeValue"
        v-decorator="['roleId', { rules: [{ required: true, message: '请选择审核结论！' }] }]"
      >
        <a-radio :disabled="rangeValue!=1" :value="1" style="font-size: 8px; margin-left: 10px; margin-top: 10px"> 通过 </a-radio>
        <a-radio :disabled="rangeValue==1" :value="2" style="font-size: 8px; margin-top: 10px"> 不通过 </a-radio>
      </a-radio-group>
    </div>

    <div class="display-item" style="margin-top: -22px">
      <span style="margin-top: -57px; width: 90px; margin-left: -3px"> 不通过原因:</span>
      <a-textarea
        :disabled="true"
        style="height: 80px; min-height: 100px; margin-top: 10px; margin-left: -20px; width: 87%"
        :maxLength="300"
        v-model="auditDesc"
        v-decorator="['doctorBrief', { rules: [{ required: false, message: '请输入原因！' }] }]"
      />
    </div>
  </a-modal>
</template>
  
          
  <script>
import moment from 'moment'
import { audit } from '@/api/modular/system/posManage'
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
      auditDesc: '',
      rangeValue: 1,

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
      title: '审核结果',
    }
  },

  watch: {
    timeStr() {},
  },
  methods: {
    moment,
    //初始化方法
    checkDetail(record) {
      this.visible = true
      this.rangeValue = record.auditResultStatus.value
      this.auditDesc = record.auditDesc
    },

    //   radioChange(event) {
    //     if (event.target.value == 1) {
    //       this.rangeValue = 1
    //       this.queryParams.auditStatus = 1
    //     } else {
    //       this.rangeValue = 2
    //       this.queryParams.auditStatus =2
    //     }
    //   },

    /**
     * 取消
     */
    handleCancel() {
      this.visible = false
    },

    /**
     * 提交
     */
    handleSubmit() {
      // this.auditOut()
    },
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

  .ant-radio-group {
    margin-top: 20px !important;
  }
}
</style>