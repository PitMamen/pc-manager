<template>
  <a-modal
    :title="record.accountId ? '修改收款商户' : '新增收款商户'"
    :width="488"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
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
            <span class="span-item-name"><span style="color: red">*</span>商户类型:</span>
            <a-select
              v-model="checkData.channel"
              placeholder="请选择商户类型"
              allow-clear
              style="width: 120px; height: 28px"
            >
              <a-select-option v-for="item in payeeType" :key="item.code" :value="item.code">{{
                item.name
              }}</a-select-option>
            </a-select>
          </div>

          <div class="div-content">
            <span class="span-item-name">商户编码:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.merchantId"
              style="display: inline-block"
              allow-clear
              :disabled="record.accountId"
              :maxLength="40"
              placeholder="请输入商户编码"
            />
          </div>

          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>商户名称:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.name"
              style="display: inline-block"
              allow-clear
              :maxLength="40"
              placeholder="请输入商户名称"
            />
          </div>

          <div class="div-content">
            <span class="span-item-name">拼音码:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.namePy"
              style="display: inline-block"
              allow-clear
              :maxLength="40"
              placeholder="请输入商户名称"
            />
          </div>

          <div class="div-content">
            <span class="span-item-name">所属机构:</span>
            <a-tree-select
              v-model="checkData.hospitalCode"
              style="min-width: 120px"
              :tree-data="treeData"
              placeholder="请选择"
              tree-default-expand-all
            >
            </a-tree-select>
          </div>

          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">服务权限</span>
          </div>
          <!-- <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>所属角色:</span>
            <a-select
              v-model="checkData.role"
              allow-clear
              placeholder="请选择所属角色"
              :maxTagCount="3"
              :collapse-tags="true"
              mode="multiple"
              style="height: 28px"
              @change="onRoleSelectChange"
            >
              <a-select-option v-for="(item, index) in roleList" :key="index" :value="item.roleId">{{
                item.roleRealName
              }}</a-select-option>
            </a-select>
          </div> -->

          <!-- <div class="div-content" style="margin-left: 1px; width: 433px">
            <a-checkbox v-model="accountChecked">客服坐席:</a-checkbox>
            <a-input
              v-model="checkData.seatUser"
              class="span-item-value"
              style="display: inline-block"
              :disabled="!accountChecked"
              placeholder="请输入客服坐席ID"
            />
          </div> -->
          <!-- <div class="div-content" style="margin-left: 1px; width: 433px">
            <a-checkbox v-model="wecomChecked">企微账号:</a-checkbox>
            <a-select
              :disabled="!wecomChecked"
              v-model="checkData.companywxUserId"
              allow-clear
              placeholder="请选择企微账号"
            >
              <a-select-option v-for="(item, index) in wecomUserList" :key="index" :value="item">{{
                item
              }}</a-select-option>
            </a-select>
          </div> -->
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
  
  
  <script>
import { queryHospitalList } from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { isObjectEmpty, isStringEmpty, isArrayEmpty } from '@/utils/util'
import Vue from 'vue'
export default {
  components: {},
  data() {
    return {
      visible: false,
      record: {},
      headers: {},
      confirmLoading: false,
      // 高级搜索 展开/关闭
      danandataList: [],
      treeData: [],
      checkData: {
        name: '', //商户名称
        channel: '', //商户类型
        merchantId: '', //商户编码
        namePy: '',
        hospitalCode: undefined, //
        paramJson:''
      },
      fetching: false,
      accountChecked: false, //客服坐席
      wecomChecked: false, //企稳账号


      payeeType: [
        {
          code: 'wechat',
          name: '微信',
        },
        {
          code: 'alipay',
          name: '支付宝',
        },
      ],
    }
  },
  created() {},
  methods: {
    clearData() {
      this.record = {}
      this.checkData = {
        name: '', //商户名称
        channel: '', //商户类型
        merchantId: '', //商户编码
        namePy: '',
        hospitalCode: undefined, //机构
        paramJson:''
      }
      this.accountChecked = false
      this.wecomChecked = false
    },
    //新增
    addModel() {
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.queryHospitalListOut()
    },
    //修改
    editModel(record) {
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.record = record

      this.queryHospitalListOut()
    },

    /**
     * 所属机构接口
     */
    /**
     *
     * @param {}
     */
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

    handleSubmit() {
      console.log(this.checkData)

      if (isStringEmpty(this.checkData.loginName)) {
        this.$message.error('请输入登录账号')
        return
      }
      if (!this.checkAccountName()) {
        return
      }

      if (isStringEmpty(this.checkData.userId)) {
        this.$message.error('请选择对应人员')
        return
      }

      if (isArrayEmpty(this.checkData.role)) {
        this.$message.error('请分配角色')
        return
      }

      if (this.accountChecked) {
        //如果勾选了客服坐席

        if (isStringEmpty(this.checkData.seatUser)) {
          this.$message.error('请输入客服坐席ID')
          return
        }
      }
      if (this.wecomChecked) {
        //如果勾选了企微账号

        if (isStringEmpty(this.checkData.companywxUserId)) {
          this.$message.error('请选择企业微信账号')
          return
        }
      }

      var postData = {
        loginName: this.checkData.loginName,
        userId: this.checkData.userId,
        actorIds: this.checkData.role,
      }
      if (this.accountChecked) {
        postData.seatUser = this.checkData.seatUser
      } else {
        postData.seatUser = ''
      }
      if (this.wecomChecked) {
        postData.companywxUserId = this.checkData.companywxUserId
      } else {
        postData.companywxUserId = ''
      }
      this.confirmLoading = true

      if (this.record.accountId) {
        postData.accountId = this.record.accountId
        //修改
        this.editAccount(postData)
      } else {
        //新增
        this.addAccount(postData)
      }
    },

    addAccount(postData) {
      createDoctorAccount(postData).then((res) => {
        if (res.code == 0) {
          this.$message.success('新增成功！')
          this.visible = false
          this.$emit('ok', '')
        } else {
          this.$message.error(res.message)
        }
        this.confirmLoading = false
      })
    },
    editAccount(postData) {
      updateDoctorAccount(postData).then((res) => {
        if (res.code == 0) {
          this.$message.success('修改成功！')
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
  width: 420px;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 26px;
  margin-top: 20px;
  margin-bottom: 10px;
  margin-left: 14px;

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
  height: 342px;
  margin-top: 10px;

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
    margin-bottom: 10px;
    width: 420px;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    margin-left: 14px;
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
      width: 60px;
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
  