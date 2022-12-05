<template>
  <a-modal
    :title="title"
    :width="730"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
  >
    <div class="display-item" style="margin-left: 5px; margin-top: 10px">
      <span style="margin-top: 10px"> 审核结论 :</span>

      <a-radio-group
        name="radioGroup"
        v-model="rangeValue"
        @change="radioChange"
        defaultValue="1"
        v-decorator="['roleId', { rules: [{ required: true, message: '请选择审核结论！' }] }]"
      >
        <a-radio :value="1" style="font-size: 8px; margin-left: 10px; margin-top: 10px"> 通过 </a-radio>
        <a-radio :value="2" style="font-size: 8px; margin-top: 10px"> 不通过 </a-radio>
      </a-radio-group>
    </div>

    <div class="display-item" >
      <span style="margin-top: -57px; width: 90px;margin-left: -3px;"> 不通过原因:</span>
      <a-textarea
        style="height: 80px; min-height: 80px; margin-top: 10px; margin-left: -20px; width: 87%"
        :maxLength="300"
        v-model="queryParams.departmentIntroduce"
        placeholder="请输入原因"
        v-decorator="['doctorBrief', { rules: [{ required: false, message: '请输入原因！' }] }]"
      />
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
      title: '随访任务审核',
    }
  },

  watch: {
    timeStr() {},
  },
  methods: {
    moment,
    //初始化方法
    process(record) {
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