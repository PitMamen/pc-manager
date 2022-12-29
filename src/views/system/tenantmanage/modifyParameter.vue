<template>
  <a-modal
    :title="title"
    :width="650"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
  >
    <div class="div-service-user" style="margin-left: 15px">
      <span class="span-item-name" style="margin-top: 5px"><span style="color: red">*</span> 所属租户 : </span>
      <!-- <a-select
        v-model="tenantName"
        placeholder="请选择所属租户"
        allow-clear
        style="min-width: 180px; margin-left: 5px"
        @select="onSelect"
      >
        <a-select-option v-for="item in tenantListOut" :key="item.tenantId" :value="item.tenantId">{{
          item.tenantName
        }}</a-select-option>
      </a-select> -->

      <span class="span-item-name" style="display: inline-block; margin-top: 5px; width: 180px; margin-left: 5px">{{
        tenantName
      }}</span>

      <span class="span-item-name" style="margin-top: 5px; margin-left: 80px"
        ><span style="color: red">*</span> 所属应用 :</span
      >
      <a-select
        v-model="queryParamsData.applicationId"
        placeholder="请选择应用类型"
        allow-clear
        style="min-width: 180px; margin-left: 5px"
      >
        <a-select-option v-for="item in appListOut" :key="item.id" :value="item.id">{{
          item.applicationName
        }}</a-select-option>
      </a-select>
    </div>

    <div class="div-service-user" style="margin-top: 20px; margin-left: 15px">
      <span class="span-item-name" style="margin-top: 5px"><span style="color: red">*</span> 参数编码 :</span>

      <a-input
        class="span-item-value"
        v-model="queryParamsData.code"
        :maxLength="30"
        style="display: inline-block; width: 180px; margin-left: 5px"
        allow-clear
        placeholder="请输入参数编码"
      />

      <span class="span-item-name" style="margin-top: 5px; margin-left: 80px"
        ><span style="color: red">*</span> 参数名称 :</span
      >
      <a-input
        class="span-item-value"
        v-model="queryParamsData.name"
        :maxLength="30"
        style="display: inline-block; width: 180px; margin-left: 5px"
        allow-clear
        placeholder="请输入参数名称 "
      />
    </div>

    <div class="div-service-user" style="margin-top: 20px; margin-left: 15px">
      <span class="span-item-name" style="margin-top: 5px; margin-left: 1px"
        ><span style="color: red">*</span> 参 数 值 :</span
      >
      <a-input
        class="span-item-value"
        v-model="queryParamsData.value"
        :maxLength="30"
        style="display: inline-block; width: 180px; margin-left: 8px"
        allow-clear
        placeholder="请输入参数值 "
      />
    </div>

    <div class="div-service-user" style="margin-top: 10px; margin-left: 18px">
      <span style="margin-top: 10px; width: 85px; margin-left: 2px"> 参数描述 :</span>
      <a-textarea
        style="height: 80px; min-height: 80px; margin-top: 10px; margin-left: -21px; width: 83%"
        v-model="queryParamsData.remark"
        placeholder="请输入参数描述"
        v-decorator="['doctorBrief', { rules: [{ required: false, message: '请输入参数描述！' }] }]"
      />
    </div>
  </a-modal>
</template>
          
          
          
          <script>
import moment from 'moment'
import { getApplicationlist, getTenantList, saveSysConfigData } from '@/api/modular/system/posManage'
import { STable } from '@/components'


export default {
  components: {
    STable,
  },
  data() {
    return {
      queryParamsData: {
        applicationId: '',
        value: '',
        tenantId: '',
        code: '',
        name: '',
        id: '',
        remark: '',
      },

      tenantName: '',
      applicationName: '',

      appList: [],
      appListOut: [],

      tenantListOut: [],
      tenantList: [],

      queryParamsApp: {
        applicationName: '',
        applicationType: '', //1内部应用,2外部应用
        status: 1, //1开启,2关闭
      },

      queryParamsTenant: {
        metaName: '',
        status: 1,
        tenantName: '',
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
      title: '修改参数',
    }
  },

  methods: {
    moment,
    //初始化方法
    modify(record) {
      this.visible = true
      this.reset()

      this.queryParamsData.code = record.code
      this.queryParamsData.value = record.value
      this.queryParamsData.remark = record.remark
      this.queryParamsData.name = record.name
      this.queryParamsData.tenantId = record.tenantId
      this.queryParamsData.applicationId = record.applicationId
      this.queryParamsData.id = record.id
      this.tenantName = record.tenantName

      this.getApplicationlistOut()
  
    },

    /**
     * 选择
     *
     */
    onSelect(tenantId) {
      console.log('mmmmmm:', tenantId)
      this.queryParamsData.tenantId = tenantId
    },

    /**
     * 查询应用列表
     */
    getApplicationlistOut() {
      this.confirmLoading = true
      getApplicationlist(this.queryParamsApp)
        .then((res) => {
          if (res.code == 0) {
            this.appList = res.data
            this.appListOut = JSON.parse(JSON.stringify(this.appList))
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 租户列表
     */
    getTenantListOut() {
      this.confirmLoading = true
      getTenantList(this.queryParamsTenant)
        .then((res) => {
          if (res.code == 0) {
            this.tenantList = res.data.records
            this.tenantListOut = JSON.parse(JSON.stringify(this.tenantList))
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /***
     * 修改参数接口调用
     */
    modifyParameterOut() {
      this.confirmLoading = true
      saveSysConfigData(this.queryParamsData)
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
      this.queryParamsData.code = ''
      this.queryParamsData.value = ''
      this.queryParamsData.remark = ''
      this.queryParamsData.name = ''
      this.queryParamsData.tenantId = ''
      this.queryParamsData.applicationId = ''
      this.tenantName = ''
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
      if (!this.queryParamsData.tenantId) {
        this.$message.error('请选择所属租户')
        return
      }

      if (!this.queryParamsData.applicationId) {
        this.$message.error('请选择所属应用')
        return
      }

      if (!this.queryParamsData.name) {
        this.$message.error('请输入参数名称')
        return
      }

      if (!this.queryParamsData.code) {
        this.$message.error('请输入参数编码')
        return
      }

      if (!this.queryParamsData.value) {
        this.$message.error('请输入参数值')
        return
      }

      this.modifyParameterOut()
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