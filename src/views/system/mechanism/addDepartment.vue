<template>
  <a-modal
    :title="title"
    :width="700"
    :height="650"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
  >
    <div class="div-service-user">
      <span class="span-item-name" style="margin-top: 5px; margin-left: 20px"
        ><span style="color: red">*</span> 上级机构:</span
      >
      <a-select
        style="min-width: 190px"
        v-model="queryParams.parentDisarmamentId"
        @select="onSelect()"
        allow-clear
        placeholder="请选择上级机构"
      >
        <a-select-option v-for="(item, index) in ParentList" :key="index" :value="item.hospitalId">{{
          item.hospitalName
        }}</a-select-option>
      </a-select>

      <span class="span-item-name" style="margin-top: 5px; margin-left: 20px"
        ><span style="color: red">*</span> 科室名称:</span
      >
      <a-input
        class="span-item-value"
        v-model="queryParams.departmentName"
        :maxLength="30"
        style="display: inline-block; width: 30%"
        allow-clear
        placeholder="请输入科室名称 "
      />
    </div>

    <div class="div-service-user" style="margin-top: 20px">
      <span class="span-item-name" style="margin-top: 5px; margin-left: 20px"
        ><span style="color: red">*</span> 科室类型:</span
      >
      <a-select style="min-width: 190px" v-model="queryParams.departmentType" allow-clear placeholder="请选择科室类型">
        <a-select-option v-for="(item, index) in departmentTypeList" :key="index" :value="item.code">{{
          item.name
        }}</a-select-option>
      </a-select>

      <span class="span-item-name" style="margin-top: 5px; margin-left: 20px"
        ><span style="color: red">*</span> 科室位置:</span
      >
      <a-input
        class="span-item-value"
        v-model="queryParams.departmentAddr"
        :maxLength="30"
        style="display: inline-block; width: 30%"
        allow-clear
        placeholder="请输入方案名称 "
      />
    </div>

    <div class="div-service-user" style="margin-top: 20px">
      <span class="span-item-name" style="margin-top: 5px; margin-left: 20px"
        ><span style="color: red">*</span> HIS编码:</span
      >
      <a-input
        type="number"
        class="span-item-value"
        v-model="queryParams.hisId"
        :maxLength="30"
        style="display: inline-block; width: 30%"
        allow-clear
        placeholder="请输入方案名称 "
      />

      <span class="span-item-name" style="margin-top: 5px; margin-left: 17px"
        ><span style="color: red">*</span> 显示序号:</span
      >
      <a-button style="margin-left: 5px" icon="plus" size="small" @click="addNum()" />
      <!-- <a-icon type="plus" /> -->
      <a-input
        v-model="queryParams.departmentOrder"
        :disabled="true"
        :defaultValue=1
        allow-clear
        style="width: 135px; margin-left: 5px; text-align: center"
      />
      <a-button style="margin-left: 5px" size="small" icon="minus" @click="duleNum()" />
    </div>

    <div class="display-item" style="margin-left: 23px; margin-top: 10px">
      <span style="margin-top: 10px"> 科室类型:</span>

      <a-radio-group
        name="radioGroup"
        @change="radioChange"
        defaultValue="2"
        v-decorator="['roleId', { rules: [{ required: true, message: '请选择科室类型！' }] }]"
      >
        <a-radio :value="1" style="font-size: 8px; margin-left: 10px; margin-top: 10px"> 互联网医院科室 </a-radio>
        <a-radio :value="2" style="font-size: 8px; margin-top: 10px"> 全病程科室 </a-radio>
      </a-radio-group>
    </div>

    <a-form-item style="margin-left: -68px" label="科室简介" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
      <a-textarea
        v-model="queryParams.departmentIntroduce"
        placeholder="请输入科室简介"
        v-decorator="['doctorBrief', { rules: [{ required: false, message: '请输入个人简介！' }] }]"
      />
    </a-form-item>

    <!-- <a-input
          v-model="queryParams.hospitalCode"
          :maxLength="30"
          style="display: inline-block; width: 70%;height:180px;text-align: top;"
          allow-clear
          placeholder="请输入简介 "
        />  -->
  </a-modal>
</template>
        
        
        
        <script>
import moment from 'moment'
import { addDepartmentForReq, queryHospitalLevel, queryHospitalType, parent } from '@/api/modular/system/posManage'
import { STable } from '@/components'
import { formatDate, formatDateFull } from '@/utils/util'
import E from 'wangeditor'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { appId } from '@/utils/util'
// import { nextTick } from 'vue/types/umd'
export default {
  components: {
    STable,
  },
  data() {
    return {
      bb: '1',
      userId: '',
      timeStr: '',
      originData: [],
      rangeValue: '2',
      previewVisible: false,
      HospitalLevelList: [],
      HospitalTypeList: [],
      ParentList: [],
      record: {},
      queryParams: {
        departmentName: '',
        parentDisarmamentId: '',
        parentDisarmamentName: '',
        hisId: '',
        departmentAddr: '',
        departmentOrder: 0,
        isInternetHospital: '',
        isFullDisease: '',
        departmentIntroduce: '',
      },

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      headers: {
        Authorization: '',
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      title: '新增科室',

      departmentTypeList: [
        { code: 1, name: '门诊科室' },
        { code: 2, name: '急诊科室' },
        { code: 3, name: '住院科室' },
        { code: 4, name: '医技科室' },
        { code: 5, name: '药剂科室' },
        { code: 6, name: '后勤物资' },
        { code: 7, name: '机关科室' },
      ],
    }
  },

  methods: {
    moment,
    //初始化方法
    addDepartment(record) {
      this.visible = true
      this.reset()
      // this.getHospitalLevel()
      // this.getHospitalType()
      this.getParentList()
    },

    onSelect() {
      //选择类别
      let chooseDeptItem = JSON.parse(JSON.stringify(this.ParentList.find((item) => item.hospitalId == this.queryParams.parentDisarmamentId)))
      this.queryParams.parentDisarmamentName = chooseDeptItem.hospitalName
      console.log("sssss:",this.queryParams.parentDisarmamentName)
    },




    /**
     * 增加序号
     */
    addNum() {
      this.queryParams.departmentOrder++
    },

    /**
     * 减序号
     */
    duleNum() {
      this.queryParams.departmentOrder--
      if (this.queryParams.departmentOrder <= 0) {
        this.queryParams.departmentOrder = 0
      }
    },

    /**
     * 上级机构
     */
    getParentList() {
      parent().then((res) => {
        if (res.code == 0) {
          this.ParentList = res.data
        }
      })
    },

    /***
     * 机构等级接口
     */
    getHospitalLevel() {
      queryHospitalLevel()
        .then((res) => {
          if (res.code == 0) {
            this.HospitalLevelList = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 机构类型
     */
    getHospitalType() {
      queryHospitalType()
        .then((res) => {
          if (res.code == 0) {
            this.HospitalTypeList = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /***
     * 新增租户接口调用
     */
    addDepartmentForReqOut() {
      this.confirmLoading = true
      addDepartmentForReq(this.queryParams)
        .then((res) => {
          if (res.code == 0 && res.success) {
            this.visible = false
            this.$message.success('新增成功')
            this.$emit('ok')
          } else {
            this.$message.error('新增失败:' + res.message)
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     *   机构选择
     */
    radioChange(event) {
      //立即发送
      if (event.target.value == 1) {
        this.rangeValue = '1'
        this.queryParams.isInternetHospital = 1
        this.queryParams.isFullDisease = 2
        //延时发送
      } else if (event.target.value == 2) {
        this.rangeValue = '2'
        this.queryParams.isFullDisease = 1
        this.queryParams.isInternetHospital = 2
      }
    },

    /**
     * 重置
     */
    reset() {
      this.queryParams.parentDisarmamentId = ''
      this.queryParams.departmentName = ''
      this.queryParams.parentDisarmamentName = ''
      this.queryParams.departmentAddr = ''
      this.queryParams.departmentOrder = ''
      this.queryParams.isInternetHospital = ''
      this.queryParams.isFullDisease = ''
      this.queryParams.departmentIntroduce = ''
      this.queryParams.hisId = ''
    },

    /**
     * 取消
     */
    handleCancel() {
      this.visible = false
      this.previewVisible = false
    },

    /**
     * 提交
     */
    handleSubmit() {
      if (!this.queryParams.parentDisarmamentId) {
        this.$message.error('请选择上级机构')
        return
      }

      if (!this.queryParams.departmentName) {
        this.$message.error('请输入科室名称')
        return
      }
      if (!this.queryParams.departmentAddr) {
        this.$message.error('请输入科室地址')
        return
      }
      if (!this.queryParams.departmentOrder) {
        this.$message.error('请选择科室排序')
        return
      }
      if (!this.queryParams.hisId) {
        this.$message.error('请输入His编码')
        return
      }

      if (!this.queryParams.departmentIntroduce) {
        this.$message.error('请编辑科室简介')
        return
      }

      this.addDepartmentForReqOut()
    },
  },
}
</script>
        
        <style lang="less">
.dddd-r {
  display: flex;
  flex-direction: row;

  .domw-r {
    display: flex;
    flex-direction: column;
  }
}

.div-title {
  margin-top: 10px;
  display: flex;
  background-color: #ebebeb;
  flex-direction: row;
  width: 98% !important;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 26px;

  .div-line-blue {
    width: 5px;
    height: 100%;
    background-color: #1890ff;
  }
  .span-title {
    font-size: 12px;
    margin-left: 10px;
    font-weight: bold;
    color: #333;
  }
}
.table-page-wrapper {
  .ant-form-inline {
    .ant-form-item {
      display: flex;
      margin-bottom: 24px;
      margin-right: 0;

      .ant-form-item-control-wrapper {
        flex: 1 1;
        display: inline-block;
        vertical-align: middle;
      }

      > .ant-form-item-label {
        line-height: 32px;
        padding-right: 8px;
        width: auto;
      }
      .ant-form-item-control {
        height: 32px;
        line-height: 32px;
      }
    }
  }

  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }
}
</style>
      <style lang="less">
.div-service-user {
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow: hidden;
  height: 100%;
}
</style>