<template>
  <a-modal
    :title="title"
    :width="700"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
  >
    <div style="margin-top: 20px; width: 550px" class="div-total1">
      <a-radio-group
        name="radioGroup"
        style="margin-left: 158px"
        v-decorator="['xm', { rules: [{ required: true, message: '请选择姓名！' }] }]"
      >
        <a-radio v-for="(item, index) in userInfos" :key="index" :value="item.userId" @click="checkName(item.userId)">
          {{ item.userName }}
        </a-radio>
      </a-radio-group>
    </div>
  </a-modal>
</template>
  
          
  <script>
import { transfer, getUsersByDeptIdsAndRoles } from '@/api/modular/system/posManage'
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
      userInfos: [],
      queryParams: {
        doctorUserId: -1,
        ids: [],
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

  methods: {
    //初始化方法
    transfer(flowids, requestData) {
      this.visible = true
      console.log('MMMM:', flowids, requestData)
      this.queryParams.ids = flowids
      this.getUsersByDeptIdsAndRolesOutB(requestData) //获取需 转移人的 集合
    },

    /**
     * 随访医生列表
     */
    getUsersByDeptIdsAndRolesOutB(requestData) {
      this.confirmLoading = true
      getUsersByDeptIdsAndRoles(requestData)
        .then((res) => {
          if (res.code == 0 && res.data.userInfos.length > 0) {
            this.userInfos = res.data.userInfos
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },


    /***
     * 提交 转移
     */
     transferOut(){
      this.confirmLoading = true
      transfer(this.queryParams).then((res)=>{
        if(res.code==0){
          var resultData={
          succCount:res.data.succCount,
          failCount:res.data.failCount,
          totalCount:this.queryParams.ids.length,
         }
         this.$emit('ok', resultData)
        }

      }).finally((res) => {
        this.visible = false
          this.confirmLoading = false
        })
    },


    /**
     * 选中
     */
    checkName(docId) {
      console.log('hahahah:', docId)
      this.queryParams.doctorUserId = docId
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
     this.transferOut()
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
}

.ant-radio-wrapper {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  -webkit-font-feature-settings: 'tnum';
  font-feature-settings: 'tnum';
  position: relative;
  display: inline-block;
  margin-right: 28px;
  white-space: nowrap;
  cursor: pointer;
  margin-bottom: 33px;
}
</style>