<template>
  <a-modal
    :title="record.accountId ? '修改账号' : '新增账号'"
    :width="460"
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
            <span class="span-item-name"><span style="color: red">*</span>登录账号:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.loginName"
              style="display: inline-block"
              allow-clear
              placeholder="请输入账号"
           
            />
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>对应人员:</span>
            <a-select
            style=" margin-top: 1px;"
              show-search
              v-model="checkData.userId"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              allow-clear
              placeholder="请选择人员"
              @search="onUserSelectSearch"
              @change="onUserSelectChange"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="(item, index) in userList" :key="index" :value="item.userId">{{
                item.userName
              }}</a-select-option>
            </a-select>
          </div>
          <div class="div-content">
            <span class="span-item-name">所属机构:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.hospitalName"
              style="display: inline-block"
              allow-clear
              readOnly
              placeholder=""
            />
          </div>
          <div class="div-content">
            <span class="span-item-name">联系方式:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.phone"
              style="display: inline-block"
              allow-clear
              readOnly
              placeholder=""
            />
          </div>

          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">服务权限</span>
          </div>
          <div class="div-content">
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
          </div>

          <div class="div-content">
            <a-checkbox v-model="accountChecked"></a-checkbox>
            <span class="span-item-name">客服坐席:</span>
            <a-input
            v-model="checkData.seatUser"
              class="span-item-value"
              style="display: inline-block"
              :disabled="!accountChecked"
              placeholder="请输入客服坐席ID"
            />
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import {
  getRoleList,
  queryHospitalList,
  getDoctorAccountDetail,
  createDoctorAccount,
  getUnbindAccountDoctorUser,
  updateDoctorAccount,
} from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
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
      advanced: false,
      fileList: [],
      danandataList: [],
      treeData: [],
      checkData: {
        loginName: '', //登录账号
        userId: '', //对应人员
        hospitalName: '',
        phone: '',
        role: undefined, //分配角色
        seatUser: '', //坐席
      },
      fetching: false,
      accountChecked: false, //客服坐席

      roleList: [], //角色列表
      rylxList: ['医生', '护士', '药剂师', '医技人员', '后勤人员'], //人员类型
      userList: [],
    }
  },
  created() {},
  methods: {
    clearData() {
      this.record = {}
      this.checkData = {
        loginName: '', //登录账号
        userId: '', //对应人员
        hospitalName: '',
        phone: '',
        role: [], //分配角色
        seatUser: '', //坐席
      }
      this.roleList=[]
      this.userList=[]
      this.accountChecked = false
    },
    //新增
    addModel() {
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.getUserList('')
      this.getRolesOut()
    },
    //修改
    editModel(record) {
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.record = record

      this.getRolesOut()

      this.getDoctorAccountDetailOut(record.accountId)
    },
    //账号详情
    getDoctorAccountDetailOut(accountId) {
      getDoctorAccountDetail({
        accountId: accountId,
      }).then((res) => {
        if (res.code == 0) {
          this.checkData = res.data
          this.accountChecked=res.data.seatUser?true:false
          var roles = []
          res.data.roles.forEach((element) => {
            roles.push(element.roleId)
          })
          console.log(roles)
          this.checkData.role = roles
          this.userList.push({
            ospitalCode: res.data.hospitalCode,
            hospitalName: res.data.hospitalName,
            phone: res.data.phone,
            userId: res.data.userId,
            userName: res.data.userName,
          })
          this.getRolesOut()
        }
      })
    },

    //获取角色列表
    getRolesOut() {
      getRoleList({
        belong: undefined,
        status: 1,
        topFlag: undefined,
        keyWords: undefined,
      }).then((res) => {
        if (res.code == 0) {
          var roleList = []
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].state == 1) {
              roleList.push(res.data[i])
            }
          }
          this.roleList = roleList
        }
      })
    },
    getUserList(queryText) {
      this.fetching = true
      getUnbindAccountDoctorUser({
        status: 0, //（0正常、1停用、2删除）
        queryText: queryText,
        pageNo: 1,
        pageSize: 10000,
      }).then((res) => {
        this.fetching = false
        if (res.code == 0) {
          this.userList = res.data.rows
          this.$forceUpdate()
          console.log(this.userList)
        }
      })
    },
         //不能输入非汉字效验  效验不能输入非空字符串
	  validateNoChinese : ( value, callback) => {
	    let reg = /^[^\u4e00-\u9fa5]+$/g;
	    let regEmpty = /^\s*$/g;
	    if (value && !reg.test(value)) {
	      callback('书写格式错误');
	    } else if(value && regEmpty.test(value)) {
	      callback('不能为空');
	    } else {
	      callback();
	    }
	  },
    onRoleSelectChange(value){
      console.log(value)
      this.checkData.role=value
      this.$forceUpdate()
    },
    onUserSelectChange(value) {
      console.log('onUserSelectChange', value)
      var checkedUser = this.userList.find((item) => item.userId == value)
      console.log('checkedUser', checkedUser)
      if (checkedUser) {
        this.checkData.hospitalName = checkedUser.hospitalName
        this.checkData.phone = checkedUser.phone
      }
    },
    onUserSelectSearch(value) {
      console.log(value)
      this.getUserList(value)
    },
    checkAccountName() {
      console.log(this.checkData.loginName)
      var value=this.checkData.loginName
      let reg = /^[^\u4e00-\u9fa5]+$/g;
	    let regEmpty = /^\s*$/g;
	    if (value && !reg.test(value)) {
	     
        this.$message.error('账号不能输入中文')
        return false
	    }else {
        return true
      } 
    },
    handleSubmit() {
      console.log(this.checkData)

      if (this.checkData.loginName.length == 0) {
        this.$message.error('请输入登录账号')
        return
      }
      if(!this.checkAccountName()){
        return
      }


      if (this.checkData.userId.length == 0) {
        this.$message.error('请选择对应人员')
        return
      }

      if (this.checkData.role.length == 0) {
        this.$message.error('请分配角色')
        return
      }

      if (this.accountChecked) {
        //如果勾选了客服坐席

        if (this.checkData.seatUser.length == 0) {
          this.$message.error('请输入客服坐席ID')
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
      }else{
        postData.seatUser=''
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
.div-title {
  background-color: #f7f7f7;
  flex-direction: row;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 26px;
  margin-top: 20px;
  margin-bottom: 10px;

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
  height: 310px;
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
    width: 100%;
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
