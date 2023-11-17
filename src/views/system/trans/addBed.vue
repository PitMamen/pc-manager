<template>
  <a-modal
    title="床位预约"
    :width="488"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :okText="record.bedFlag === 1 ? '取消预约' : '预约登记'"
    cancelText="关闭"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-part">
        <div class="div-part-left">
          <div class="div-title" style="margin-top: 0">
            <div class="div-line-blue"></div>
            <span class="span-title">账号信息</span>
          </div>
          <div class="div-content">
            <span class="span-item-name">患者姓名:</span>
            <span class="span-item-value">{{ record.patientBaseinfo.name }}</span>

            <span class="span-item-name">性别:</span>
            <span class="span-item-value">{{ record.patientBaseinfo.sex }}</span>
          </div>
          <div class="div-content">
            <span class="span-item-name">出生日期:</span>
            <span class="span-item-value">{{ record.patientBaseinfo.birthday }}</span>

            <span class="span-item-name">本人电话:</span>
            <span class="span-item-value">{{ record.patientBaseinfo.phone }}</span>
          </div>
          <div class="div-content">
            <span class="span-item-name">证件类型:</span>
            <span class="span-item-value">身份证</span>

            <span class="span-item-name">证件号码:</span>
            <span class="span-item-value">{{ record.patientBaseinfo.identificationNo }}</span>
          </div>
          <div class="div-content" style="align-items: flex-start">
            <span class="span-item-name">家庭住址:</span>
            <span class="span-item-value">{{ record.patientBaseinfo.address }}</span>
          </div>

          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">床位信息</span>
          </div>
          <div class="div-content">
            <span class="span-item-name">住院号:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.zyh"
              style="display: inline-block"
              allow-clear
              :readOnly="record.bedFlag === 1"
              :maxLength="50"
              placeholder="请输入患者住院号"
            />

            <span class="span-item-name" style="margin-left: 10px"><span style="color: red">*</span>到院时间:</span>
            <span class="span-item-value">
              <a-date-picker :value="createValue" :disabled="record.bedFlag === 1"  @change="onChange" />
            </span>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>入院科室:</span>
            <!-- <a-select v-model="checkData.professionalTitle" allow-clear placeholder="请选择入院科室">
              <a-select-option v-for="(item, index) in rylxList" :key="index" :value="item.value">{{
                item.value
              }}</a-select-option>
            </a-select> -->
            <a-select
            :disabled="record.bedFlag === 1"
              show-search
              v-model="checkData.inDeptCode"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              allow-clear
              placeholder="请选择入院科室"
              @change="onDepartmentSelectChange2"
              @search="onDepartmentSelectSearch2"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option
                v-for="(item, index) in originData"
                :title="item.department_name"
                :key="index"
                :value="item.department_id"
                >{{ item.department_name }}</a-select-option
              >
            </a-select>

            <span class="span-item-name" style="margin-left: 10px">押金估算:</span>
            <span class="span-item-value">
              <a-input
                class="span-item-value"
                v-model="checkData.yj"
                style="display: inline-block"
                allow-clear
                :readOnly="record.bedFlag === 1"
                type="number"
                :maxLength="10"
                placeholder="请输入金额"
              />
            </span>
          </div>
          <div class="div-content" style="align-items: flex-start">
            <span class="span-item-name">补充事项:</span>
            <span class="span-item-value">
              <a-textarea
                v-model="checkData.memo"
                class="span-item-value"
                showCount
                :maxLength="100"
                :readOnly="record.bedFlag === 1"
                style="height: 46px !important; display: inline-block"
                :auto-size="false"
                placeholder="请输入内容 "
              />
            </span>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import {
  createBed,
  cancelBed,
  getRoleList,
  queryHospitalList,
  getDoctorAccountDetail,
  createDoctorAccount,
  getUnbindAccountDoctorUser,
  updateDoctorAccount,
  getZhuyuanDepartmentList,
} from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { isObjectEmpty, isStringEmpty, isArrayEmpty } from '@/utils/util'
import Vue from 'vue'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      visible: false,
      record: {},
      headers: {},
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      createValue:undefined,
      originData: [],
      checkData: {
        inTime: undefined,//住院时间
        memo: undefined,//补充事项
        sendMessageFlag: 1,//是否发送短信（1发送 其它不发送）
        tradeId: undefined,
        yj: undefined,//押金
        zyh: undefined,//住院号
        inDeptCode:undefined,//入院科室
        inDept:undefined,//入院科室
      },
      fetching: false,

     
    }
  },
  created() {},
  methods: {
    clearData() {
      this.record = {}
      this.checkData =  {
        inTime: undefined,//住院时间
        memo: undefined,//补充事项
        sendMessageFlag: 1,//是否发送短信（1发送 其它不发送）
        tradeId: undefined,
        yj: undefined,//押金
        zyh: undefined,//住院号
        inDeptCode:undefined,//入院科室
        inDept:undefined,//入院科室名称
      }
      this.originData = []
      this.createValue=''
    },

    //修改
    editModel(record) {
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.record = record
      this.checkData.tradeId=record.tradeId
      if(this.record.bedFlag ===1){
        this.checkData.zyh=record.zyh
        this.checkData.yj=record.yj
        this.checkData.inDeptCode=record.inDeptCode
        this.originData=[{department_id:record.inDeptCode,department_name:record.inDept}]
        this.checkData.memo=record.memo
        this.checkData.inTime=record.inTime
        
        this.createValue=moment(record.inTime, this.dateFormat)
      }else {
        this.getZhuyuanDepartmentListOut(undefined)
      }
     
    },

    //获取管理的科室 可首拼
    getZhuyuanDepartmentListOut(departmentName) {
      this.fetching = true
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getZhuyuanDepartmentList(departmentName, undefined).then((res) => {
        this.fetching = false
        if (res.code == 0) {
          this.originData = res.data.records
        }

       
      })
    },

    //科室搜索
    onDepartmentSelectSearch2(value) {
      this.originData = []
      this.getZhuyuanDepartmentListOut(value)
    },
    //科室选择变化
    onDepartmentSelectChange2(value) {
      if (value === undefined) {
        this.originData = []
        this.getZhuyuanDepartmentListOut(undefined)
      }
      console.log('hahah',value)
    var department=  this.originData.find((item)=>{
        return item.department_id===value
      })
     console.log(department)
     this.checkData.inDept=department.department_name
    },
    
      onChange(momentArr, dateArr) {
        console.log(momentArr)
        console.log(dateArr)
        if (dateArr[0] == '') {
          this.checkData.inTime = ''
          return
        }
  
        this.createValue = momentArr
        this.checkData.inTime =dateArr
       
      },
    //不能输入非汉字效验  效验不能输入非空字符串
    validateNoChinese: (value, callback) => {
      let reg = /^[^\u4e00-\u9fa5]+$/g
      let regEmpty = /^\s*$/g
      if (value && !reg.test(value)) {
        callback('书写格式错误')
      } else if (value && regEmpty.test(value)) {
        callback('不能为空')
      } else {
        callback()
      }
    },

    checkAccountName() {
      console.log(this.checkData.loginName)
      var value = this.checkData.loginName
      let reg = /^[^\u4e00-\u9fa5]+$/g
      let regEmpty = /^\s*$/g
      if (value && !reg.test(value)) {
        this.$message.error('账号不能输入中文')
        return false
      } else {
        return true
      }
    },
    handleSubmit() {
      console.log(this.checkData)

      if (isStringEmpty(this.checkData.inTime)) {
        this.$message.error('请选择到院时间')
        return
      }
      

      if (isStringEmpty(this.checkData.inDeptCode)) {
        this.$message.error('请选择入院科室')
        return
      }

      if(this.checkData.yj && this.checkData.yj<0){
        this.$message.error('押金不能为负')
        return
      }

     
      
      this.confirmLoading = true

      if (this.record.bedFlag === 1) {
        
        //取消
        this.goCancelBed()
      } else {
        //预约
        this.goCreateBed()
      }
    },

    goCreateBed() {
      createBed(this.checkData).then((res) => {
        if (res.code == 0) {
          this.$message.success('预约成功！')
          this.visible = false
          this.$emit('ok', '')
        } else {
          this.$message.error(res.message)
        }
        this.confirmLoading = false
      })
    },
    goCancelBed() {
      var postData={
        sendMessageFlag:this.checkData.sendMessageFlag,
        tradeId:this.checkData.tradeId,
      }
      cancelBed(postData).then((res) => {
        if (res.code == 0) {
          this.$message.success('已取消！')
          this.visible = false
          this.$emit('ok', '')
        } else {
          this.$message.error(res.message)
        }
        this.confirmLoading = false
      })
    },

    goBack() {
      window.history.back()
    },

    handleCancel() {
      this.visible = false
    },
  },
}
</script>
<style lang="less" scoped>
/deep/ .ant-checkbox-wrapper {
  font-size: 12px !important;
}
.div-title {
  background-color: #f7f7f7;
  flex-direction: row;

  display: flex;
  align-items: center;
  flex-direction: row;
  height: 26px;
  margin-top: 20px;
  margin-bottom: 15px;

  .div-line-blue {
    width: 5px;
    height: 100%;
    background-color: #409eff;
  }
  .span-title {
    font-size: 12px;
    margin-left: 10px;
    font-weight: bold;
    color: #4d4d4d;
  }
}
.div-part {
  width: 100%;
  height: 380px;

  .div-part-left {
    float: left;
    width: 100%;
    overflow: hidden;
    height: 100%;
  }
  .div-part-right {
    float: right;
    width: 353px;
    overflow: hidden;
    height: 100%;
  }

  .div-content {
    margin-bottom: 15px;

    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;

    /deep/.ant-select-selection--multiple {
      li {
        margin-top: 1px !important;
      }
    }

    .span-item-name {
      display: inline-block;
      color: #4d4d4d;
      font-size: 12px;
      text-align: right;
      margin-right: 10px;
      width: 57px;
    }

    .span-item-value {
      flex: 1;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      display: inline-block;
    }
    .ant-select {
      flex: 1;
      font-size: 12px !important;
    }

    .ant-calendar-picker {
      flex: 1;
    }

    .avator {
      height: 48px;
      width: 48px;
      border-radius: 50%;
      background: #dfdfdf;
      margin-right: 20px;
    }
    .avator-right {
      flex: 1;
      display: flex;
      flex-direction: column;

      .avator-right-top {
        width: 82px;
        height: 28px;
        border: 1px solid #cccccc;
        display: flex;
        flex-direction: row;
      }
    }
    .jueseview {
      width: 100%;
      height: 62px;
      border: 1px solid #cccccc;
      border-radius: 2px;
      overflow-y: auto;
      padding-bottom: 10px;

      .checkbox {
        margin-left: 10px;
        margin-top: 6px;
        margin-right: 0px;

        font-size: 12px !important;
      }
    }
  }
  .checkview {
    align-items: center;
    display: flex;
    flex-direction: row;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  .span-check-title {
    font-size: 12px;
    margin-right: 8px;
    font-weight: bold;
    color: #4d4d4d;
  }

  .ant-switch {
    width: 40px !important;
  }
}
</style>
