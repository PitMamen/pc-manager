<template>
  <a-modal
    :title="title"
    :width="730"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
  >
    <div class="display-item" style="margin-left: 5px; margin-top: -21px">
      <span style="margin-top: 0px"> 审核结论 :</span>
      <a-radio-group
        name="radioGroup"
        v-model="rangeValue"
        @change="radioChange"
        v-decorator="['roleId', { rules: [{ required: true, message: '请选择审核结论！' }] }]"
      >
        <a-radio :value=1 style="font-size: 8px; margin-left: 10px; margin-top: 10px"> 通过 </a-radio>
        <a-radio :value=2 style="font-size: 8px; margin-top: 10px"> 不通过 </a-radio>
      </a-radio-group>
    </div>

    <div class="display-item" style="margin-top: -22px;" >
      <span style="margin-top: -57px; width: 90px;margin-left: -3px;"> 不通过原因:</span>
      <a-textarea
        style="height: 80px; min-height: 100px; margin-top: 10px; margin-left: -20px; width: 87%"
        :maxLength="300"
        v-model="queryParams.auditDesc"
        placeholder="请输入原因"
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
      rangeValue: 1,
      selectedRows:[],
      queryParams: {
        ids:[],  //随访集合 id 集合
        auditDesc:'',  //不通过描述原因 (不通过是必传)
        auditStatus:'',  //审核状态  1 通过  2  不通过

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
    process(ids) {
      this.visible = true
      this.queryParams.auditDesc = ''
      this.queryParams.ids = []
      this.queryParams.ids = ids
      console.log("22222:",this.queryParams.ids)
    },

    radioChange(event) {
      if (event.target.value == 1) {
        this.rangeValue = 1
        this.queryParams.auditStatus = 1
      } else {
        this.rangeValue = 2
        this.queryParams.auditStatus =2
      }
    },


    //审核
    auditOut(){
     if(this.queryParams.auditStatus==2){
      if(!this.queryParams.auditDesc){
        this.$message.error("请输入不通过原因!")
         return
      }
     }
      this.confirmLoading = true
      audit(this.queryParams).then((res)=>{
        if(res.code==0){

        }
      }).finally((res)=>{
        this.confirmLoading = false
      })
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
    handleSubmit() {
      this.auditOut()
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

   .ant-radio-group{
    margin-top: 20px !important;
   }

  }
</style>