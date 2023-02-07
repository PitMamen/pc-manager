<template>
  <a-modal
    :title="title"
    :width="500"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
  >
  <div class="div-service-user" style="margin-top: 20px; margin-bottom: 20px">
      <span class="span-item-name" style="margin-top: 5px"><span style="color: red">*</span> 问卷名称 :</span>
      <a-input
        class="span-item-value"
        v-model="queryParams.title"
        style="display: inline-block; width: 248px;margin-left: 5px;"
        allow-clear
        placeholder="请输入问卷名称 "
      />
    </div>

    <div class="div-service-user" style="margin-top: 20px; margin-bottom: 20px;margin-left: -16px;">
    <span class="span-item-name" style="margin-top: 5px; margin-left: 40px"
        ><span style="color: red">*</span> 机构 :</span
      >
      <a-tree-select
        v-model="queryParams.hospitalCode"
        style="min-width: 248px; height: 34px; margin-left: 5px"
        :tree-data="treeData"
        placeholder="请选择机构"
        tree-default-expand-all
        @change="changeSelect"
      >
      </a-tree-select>
    </div>

    <div class="div-service-user" style="margin-top: 20px; margin-bottom: 20px;margin-left: 24px;">
      <span class="span-item-name" style="margin-top: 5px"><span style="color: red">*</span> 科室 :</span>

      <a-select
        style="min-width: 248px; height: 34px; margin-left: 5px"
        show-search
        v-model="queryParams.departmentId"
        :filter-option="false"
        :not-found-content="fetching ? undefined : null"
        allow-clear
        placeholder="请选择科室"
        @change="onDepartmentSelectChange"
        @search="onDepartmentSelectSearch"
      >
        <a-spin v-if="fetching" slot="notFoundContent" size="small" />
        <a-select-option v-for="(item, index) in originData" :key="index" :value="item.department_id">{{
          item.department_name
        }}</a-select-option>
      </a-select>

     
    </div>

  
  </a-modal>
</template>
          
          
          
          <script>
import moment from 'moment'
import {   queryHospitalList,updateDeptAndHospCodeForKey,getDepartmentListForReq } from '@/api/modular/system/posManage'
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
      originData:[],
      fetching: false,
      userId: '',
      timeStr: '',
      record: {},
      findItemData: {},
      treeData: [],
      queryParams: {
        departmentId: undefined,
        hospitalCode: undefined,
        title:'',
        id:'',
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
      title: '修改问卷',

      departmentTypeList: [],
    }
  },

  methods: {
    moment,
    //初始化方法
    modifyQuestion(record) {
      // console.log('IIII:', record)

      this.visible = true
      this.reset()
      this.queryParams.title = record.title
      this.queryParams.departmentId = Number(record.department_id)
      this.queryParams.hospitalCode = record.hospital_code
      this.queryParams.id = record.id
      console.log("KKK:",this.queryParams)

      this.queryHospitalListOut()
      this.getDepartmentSelectList()
    },

    //机构列表
    queryHospitalListOut() {
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: '',
      }
      this.confirmLoading = true
      queryHospitalList(queryData)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item, index) => {
              this.$set(item, 'key', item.hospitalCode)
              this.$set(item, 'value', item.hospitalCode)
              this.$set(item, 'title', item.hospitalName)
              this.$set(item, 'children', item.hospitals)

              item.hospitals.forEach((item1, index1) => {
                this.$set(item1, 'key', item1.hospitalCode)
                this.$set(item1, 'value', item1.hospitalCode)
                this.$set(item1, 'title', item1.hospitalName)
              })
            })

            this.treeData = res.data
          } else {
            this.treeData = res.data
          }
          return []
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    //科室选择变化
    onDepartmentSelectChange(value) {
      console.log('onDepartmentSelectChange', value)
      if (value === undefined) {
        this.originData = []
        this.getDepartmentSelectList(undefined)
      }
      // this.$refs.table.refresh(true)
    },
    onDepartmentSelectSearch(value) {
      this.originData = []
      this.getDepartmentSelectList(value)
    },

     //选择机构时调用 查询科室
     changeSelect(data) {
      this.queryParams.hospitalCode = data
      this.getDepartmentSelectList()
    },

    //获取管理的科室 可首拼
    getDepartmentSelectList(departmentName) {
      this.fetching = true
      var requestData = {
        hospitalCode: this.queryParams.hospitalCode,
        status: 1,
        departmentName: departmentName,
      }
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getDepartmentListForReq(requestData).then((res) => {
        this.fetching = false
        if (res.code == 0) {
          this.originData = res.data.records
        }
      })
    },

    /***
     * 修改问卷
     */
     updateDeptAndHospCodeForKeyOut() {
      this.confirmLoading = true
      updateDeptAndHospCodeForKey({id:this.queryParams.id,departmentId:this.queryParams.departmentId,title:this.queryParams.title,hospitalCode:this.queryParams.hospitalCode})
        .then((res) => {
          if (res.code == 0 && res.success) {
            this.visible = false
            this.$message.success('修改成功')
            this.$emit('ok')
          } else {
            this.$message.error('修改失败:' + res.message)
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 重置
     */
    reset() {
      this.queryParams.hospitalCode = undefined
      this.queryParams.departmentId = undefined
      this.queryParams.title = ''
      this.queryParams.jumpData = undefined
      this.queryParams.id = ''
    },


    /**
     * 确定
     */
     handleSubmit(){
      //提交接口
       if(!this.queryParams.title){
        this.$message.error('请输入问卷标题!')
        return
      }

      if(!this.queryParams.hospitalCode){
        this.$message.error('请选择机构!')
        return
      }

      if(!this.queryParams.departmentId){
        this.$message.error('请选择科室!')
        return
      }
      this.updateDeptAndHospCodeForKeyOut()
     },


    /**
     * 取消
     */
    handleCancel() {
      this.visible = false
      this.previewVisible = false
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
        <style lang="less" scoped>
.div-service-user {
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow: hidden;
  height: 100%;
}
.m-count {
  position: absolute;
  font-size: 12px;
  bottom: 2px;
  right: 40px;
}
</style>