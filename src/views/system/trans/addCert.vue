<template>
  <a-modal
    title="住院证办理"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :okText="record.bzFlag === 1?'确定':'保存'"
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
            <span class="span-item-name">年龄:</span>
            <span class="span-item-value">{{ record.patientBaseinfo.userAge }}</span>

            <span class="span-item-name">联系方式:</span>
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
          <div class="div-content">
            <span class="span-item-name">职业分类:</span>
            <span class="span-item-value">{{ record.patientBaseinfo.job }}</span>

            <span class="span-item-name">病情分级:</span>
            <span class="span-item-value">{{ record.diseaseLevel }}</span>
          </div>
          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">床位信息</span>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>入院科室:</span>
           
            <a-select
              :disabled="record.bzFlag === 1"
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

            <span class="span-item-name" style="margin-left: 10px"><span style="color: red">*</span>接送方式:</span>
             <a-select v-model="checkData.referralWay" :disabled="record.bzFlag === 1" allow-clear placeholder="请选择">
              <a-select-option v-for="(item, index) in jsfsList" :key="index" :value="item">{{
                item
              }}</a-select-option>
            </a-select>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>入院时间:</span>
            <a-date-picker :value="createValue" :disabled="record.bzFlag === 1" @change="onChange" />

            <span class="span-item-name" style="margin-left: 10px">押金估算:</span>
            <span class="span-item-value">
              <a-input
                class="span-item-value"
                v-model="checkData.yj"
                style="display: inline-block"
                allow-clear
                :disabled="record.bzFlag === 1"
                type="number"
                :maxLength="10"
                placeholder="请输入金额"
              />
            </span>
          </div>
          <div class="div-content" >
            <span class="span-item-name">入院诊断:</span>
            <div class="span-item-value" >
              <a-select
                style="min-width: 100%;max-width: 100%; "
                :maxTagCount="3"
                :collapse-tags="true"
                :disabled="record.bzFlag === 1"
                show-search
                v-model="diagnoseCode"
                mode="multiple"
                :filter-option="false"
                :not-found-content="fetching ? undefined : null"
                allow-clear
                placeholder="请搜索选择"
                @change="onDiagnoseSelectChange"
                @search="onDiagnoseSelectSearch"
              >
                <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                <a-select-option
                  v-for="(item, index) in diagnoseDatas"
                  :key="index"
                  :value="item.icdCode"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
            </div>
          </div>
          <div class="div-content" style="align-items: flex-start">
            <span class="span-item-name">处理意见:</span>
            <span class="span-item-value">
              <a-textarea
                v-model="checkData.memo"
                class="span-item-value"
                showCount
                :maxLength="200"
                :disabled="record.bzFlag === 1"
                style="height: 65px !important; display: inline-block"
                :auto-size="false"
                placeholder="请输入内容 "
              />
            </span>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>申请医生:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.reqDocName"
              style="display: inline-block"
              allow-clear
              :disabled="record.bzFlag === 1"
              :maxLength="20"
              placeholder="请输入医生姓名"
            />

            <span class="span-item-name" style="margin-left: 10px">申请时间:</span>
            <span class="span-item-value">
              <a-date-picker show-time :value="createValue2" :disabled="record.bzFlag === 1"  @change="onChange2" />
            </span>
          </div>
          <div v-if="record.bzFlag !== 1" class="div-content" style="position: absolute; bottom: -60px;left: 0;">
            <a-checkbox v-model="smsChecked" style="margin-left: auto">办理完成后自动短信通知</a-checkbox>
          </div>
          
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import { createBed, cancelBed, getZhuyuanDepartmentList,searchDiagnosis } from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { isObjectEmpty, isStringEmpty, formatDateFull } from '@/utils/util'
import Vue from 'vue'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      dateFormat2: 'YYYY-MM-DD HH:mm:ss',
      visible: false,
      record: {},
      headers: {},
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      createValue: undefined,
      createValue2: undefined,
      originData: [],
      smsChecked: true,
      jsfsList:['自行','台架'],
      diagnoseCode:undefined,
      diagnoseDatas:[],
      diagnoseNames:[],
      checkDiagnoseDatas:[],
      checkData: {
        inTime: undefined, //住院时间
        memo: undefined, //补充事项
        sendMessageFlag: 1, //是否发送短信（1发送 其它不发送）
        tradeId: undefined,
        yj: undefined, //押金
        zyh: undefined, //住院号
        inDeptCode: undefined, //入院科室
        inDept: undefined, //入院科室
        referralWay:undefined,//接送方式
        diagnos:undefined,//主要诊断
        diagnoseCode:undefined,//主要诊断
        reqDocName:undefined,//申请医生
        regTime:undefined,//申请时间
      },
      fetching: false,
      fetching2: false,
    }
  },
  created() {},
  methods: {
    clearData() {
      this.record = {}
      this.checkData = {
        inTime: undefined, //住院时间
        memo: undefined, //补充事项
        sendMessageFlag: 1, //是否发送短信（1发送 其它不发送）
        tradeId: undefined,
        yj: undefined, //押金
        zyh: undefined, //住院号
        inDeptCode: undefined, //入院科室
        inDept: undefined, //入院科室名称
        referralWay:undefined,//接送方式
        diagnos:undefined,//主要诊断
        diagnoseCode:undefined,//主要诊断
        reqDocName:undefined,//申请医生
        regTime:undefined,//申请时间
      }
      this.smsChecked = true
      this.originData = []
      this.createValue = undefined
      this.createValue2 = undefined
      this.diagnoseCode=undefined
      this.diagnoseDatas=[]
      this.diagnoseNames=[]
      this.checkDiagnoseDatas=[]
    },

    //修改
    editModel(record) {
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      
      this.record = record
      this.checkData.tradeId = record.tradeId
      if (this.record.bzFlag === 1) {
        this.checkData.zyh = record.zyh || undefined
        this.checkData.yj = record.yj
        this.checkData.inDeptCode = record.inDeptCode
        this.originData = [{ department_id: record.inDeptCode, department_name: record.inDept }]
        this.checkData.memo = record.memo
        this.checkData.inTime = record.inTime
        this.checkData.regTime = record.regTime
        this.checkData.referralWay=record.referralWay || undefined 
        this.checkData.reqDocName=record.reqDocName

        this.createValue = moment(record.inTime, this.dateFormat)
        this.createValue2 = moment(record.regTime, this.dateFormat2)

        if(record.diagnoseCode){
          this.diagnoseCode= record.diagnoseCode.split(',')
         
          this.diagnoseNames= record.diagnos.split(',')
          var diagnoseDatas=[]
          for(var i=0;i<this.diagnoseCode.length;i++){
            diagnoseDatas.push({
              name:this.diagnoseNames[i],
              icdCode:this.diagnoseCode[i]
            })
          }
          
          this.diagnoseDatas=diagnoseDatas
          this.checkDiagnoseDatas=diagnoseDatas
        }
        

      } else {
        var nowTime=formatDateFull(new Date())
        console.log(nowTime)
        this.checkData.regTime = nowTime
        this.createValue2 = moment(nowTime, this.dateFormat2)
        this.checkData.reqDocName=record.docName
        this.getZhuyuanDepartmentListOut(undefined)

      }
      var a=formatDateFull(new Date())
        console.log(a)
    },

      //诊断选择变化
      onDiagnoseSelectChange(value) {
      this.diagnoseNames = [];
      console.log("onDepartmentSelectChange value", value);
      console.log("onDepartmentSelectChange diagnoseCode", this.diagnoseCode);

      //组装诊断名字
      if (this.diagnoseCode && this.diagnoseCode.length > 0) {
        this.diagnoseCode.forEach((element) => {
          let getOne = this.diagnoseDatas.find((item) => item.icdCode == element);
          if(getOne){
            this.checkDiagnoseDatas.push(getOne)
          }
         
        });
        this.diagnoseCode.forEach((element) => {
          let getOne = this.checkDiagnoseDatas.find((item) => item.icdCode == element);
         
          this.diagnoseNames.push(getOne.name);
        });
      }
      console.log("onDiagnoseSelectChange diagnoseNames", this.diagnoseNames);

      if (value === undefined || value.length == 0) {
        this.diagnoseDatas = [];
        this.searchDiagnosisDatas("");
      }
    },
    //诊断搜索
    onDiagnoseSelectSearch(value) {
      this.diagnoseDatas = [];
      this.searchDiagnosisDatas(value);
    },
    searchDiagnosisDatas(value) {
      this.fetching = true;
      searchDiagnosis({ keyWord: value }).then((res) => {
        this.fetching = false;
        if (res.code == 0) {
          this.diagnoseDatas = res.data;
        } else {
          this.$message.error(res.message);
        }
        this.confirmLoading = false;
      });
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
      console.log('hahah', value)
      var department = this.originData.find((item) => {
        return item.department_id === value
      })
      console.log(department)
      this.checkData.inDept = department.department_name
    },

    onChange(momentArr, dateArr) {
      console.log(momentArr)
      console.log(dateArr)
      if (dateArr[0] == '') {
        this.checkData.inTime = ''
        return
      }

      this.createValue = momentArr
      this.checkData.inTime = dateArr
    },
    onChange2(momentArr, dateArr) {
      console.log(momentArr)
      console.log(dateArr)
      if (dateArr[0] == '') {
        this.checkData.regTime = ''
        return
      }

      this.createValue2 = momentArr
      this.checkData.regTime = dateArr
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

    //判断只允许字母和数字
    checkCardNo(value) {
      return /^[\da-z]+$/i.test(value)
    },
    //判断正整数
    isPositiveInteger(value) {
      var reg = /^[1-9]\d*$/
      return reg.test(value)
    },
    handleSubmit() {
      if (this.record.bzFlag === 1) {
        this.handleCancel()
        return
      }
      console.log(this.checkData)

      if (isStringEmpty(this.checkData.inDeptCode)) {
        this.$message.error('请选择入院科室')
        return
      }

      if (isStringEmpty(this.checkData.referralWay)) {
        this.$message.error('请选择入接送方式')
        return
      }

    

      if (isStringEmpty(this.checkData.inTime)) {
        this.$message.error('请选择入院时间')
        return
      }

     

      if (this.checkData.yj ) {
        if (!this.isPositiveInteger(this.checkData.yj)) {
          this.$message.error('预估押金只能是正整数')
          return
        }
       
      }

      if (isStringEmpty(this.checkData.reqDocName)) {
        this.$message.error('请输入申请医生')
        return
      }

       //单独组装主要诊断
       if (this.diagnoseCode && this.diagnoseCode.length > 0) {
     
        this.checkData.diagnoseCode=this.diagnoseCode.join(",")
        this.checkData.diagnos=this.diagnoseNames.join(",")
      }

      this.checkData.sendMessageFlag = this.smsChecked ? 1 : 0
      console.log(this.checkData)

      this.confirmLoading = true

      this.goCreateBZ()
    },

    //办证
    goCreateBZ() {
      
      createBed(this.checkData).then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功！')
          this.visible = false
          this.$emit('ok', '')
        } else {
          this.$message.error(res.message)
        }
        this.confirmLoading = false
      })
    },
    goCancelBed() {
      var postData = {
        sendMessageFlag: this.checkData.sendMessageFlag,
        tradeId: this.checkData.tradeId,
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
  height: 538px;

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
      height: auto;
    }

    .span-item-name {
      display: inline-block;
      color: #4d4d4d;
      font-size: 12px;
      text-align: right;
      margin-right: 10px;
      width: 67px;
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
