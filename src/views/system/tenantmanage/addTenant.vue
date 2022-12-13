<template>
  <a-modal
    :title="title"
    :width="700"
    :height="450"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
  >
    <div class="div-service-user">
      <!-- 左边 -->
      <div class="div-totalleft" style="margin-top:0px">
        <div class="display-item" style="margin-left: 10px">
          <span style="margin-top: 7px"> <span style="color: red">*</span> 租户编码:</span>
          <a-input
            v-model="queryParams.tenantCode"
            allow-clear
            placeholder="请输入内容"
            style="width: 200px; margin-left: 5px"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>

        <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span style="margin-top: 10px"> <span style="color: red">*</span> 租户名称:</span>
          <a-input
            v-model="queryParams.tenantName"
            allow-clear
            placeholder="请输入内容"
            style="width: 200px; margin-top: 5px; margin-left: 5px"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>

        <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span style="margin-top: 7px"> <span style="color: red">*</span> 到期时间:</span>
          <a-date-picker
            style="margin-top: 5px; margin-left: 5px; height: 28px; width: 200px"
            v-model="queryParams.expireDate"
            format="YYYY-MM-DD"
          />
        </div>

        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">租户管理员信息</span>
        </div>

        <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span style="margin-top: 10px"> <span style="color: red">*</span> 登录账号:</span>
          <a-input
            v-model="queryParams.adminAccount"
            allow-clear
            placeholder="请输入内容"
            style="width: 200px; margin-top: 5px; margin-left: 5px"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>

        <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span style="margin-top: 10px"> <span style="color: red">*</span> 管理员姓名:</span>
          <a-input
            v-model="queryParams.adminName"
            allow-clear
            placeholder="请输入内容"
            style="width: 188px; margin-top: 5px; margin-left: 5px"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>

        <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span style="margin-top: 10px"> <span style="color: red">*</span> 联系电话:</span>
          <a-input
            type="number"
            v-model="queryParams.phone"
            allow-clear
            placeholder="请输入内容"
            style="width: 200px; margin-top: 5px; margin-left: 5px"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>

        <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span style="margin-top: 10px"> <span style="color: red">*</span> 邮箱地址:</span>
          <a-input
            v-model="queryParams.email"
            allow-clear
            placeholder="请输入内容"
            style="width: 200px; margin-top: 5px; margin-left: 5px"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>

        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">初始化机构</span>
        </div>

        <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span style="margin-top: 10px"> <span style="color: red">*</span> 机构编码:</span>
          <a-input
          type="number"
            v-model="queryParams.hospitalCode"
            allow-clear
            placeholder="请输入内容"
            style="width: 200px; margin-top: 5px; margin-left: 5px"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>

        <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span style="margin-top: 10px"> <span style="color: red">*</span> 机构名称:</span>
          <a-input
            v-model="queryParams.hospitalName"
            allow-clear
            placeholder="请输入内容"
            style="width: 200px; margin-top: 5px; margin-left: 5px"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>
      </div>

      <!-- ri -->
      <div class="card-right-user" style="overflow-y: auto; height: 450px">
        <div style="margin-bottom: 20px" class="div-total1" v-for="(item, index) in appListOut" :key="index">
          <div class="rigth-content" style="margin-left: 20%; margin-top: 10px">
            <img v-if="item.id==1"
              style="width: 13px; height: 13px"
              src="~@/assets/icons/manbing.svg"/>

              <img v-if="item.id==2"
              style="width: 13px; height: 13px"
              src="~@/assets/icons/yiyuan.svg"/>

              <img v-if="item.id==3"
              style="width: 13px; height: 13px"
              src="~@/assets/icons/shezhi.svg"/>


              <img v-if="item.id==4"
              style="width: 13px; height: 13px"
              src="~@/assets/icons/shangchengxiantiao.svg"/>

            <span class="span-item-value" style="font-size:14px;margin-top: -5px;margin-left: 3px;color: #4D4D4D;">{{ item.applicationName }} </span>
          </div>

          <a-checkbox
            style="margin-bottom: 15px; margin-left: 10%"
            v-model="item.isChecked"
            @change="selectChange(item)"
          ></a-checkbox>

          <div class="rigth-content" style="margin-left: 20%; ">

          <span  style="margin-left: 1px; font-size: 12px; color: #999999;margin-top: -30px; width: 80%;">
            {{ item.remark }}</span
          >

          </div>
        </div>
        <!-- </div> -->
      </div>
    </div>
  </a-modal>
</template>
    
    
    
    <script>
import moment from 'moment'
import { getApplicationlist, saveaddTenand } from '@/api/modular/system/posManage'
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
      userId: '',
      appList: [],
      appListOut: [],
      timeStr: '',
      msgData: [],
      templateListWX: [],
      templateListSMS: [],
      templateListQues: [],
      id: '', //表名ID
      messageContentType: '',
      queryParams: {
        adminAccount: '',
        adminName: '',
        email: '',
        expireDate: '',
        hospitalName: '',
        hospitalCode: '',
        phone: '',
        tenantName: '',
        tenantCode: '',
        hospitalCode: '',
        applicationIds: [], //应用ID集合
      },

      queryParamsApp: {
        applicationName: '',
        applicationType: '', //1内部应用,2外部应用
        status: 1, //1开启,2关闭
      },

      visitTypeList: [
        { code: 2, value: '微信消息' },
        { code: 3, value: '短信消息' },
      ],

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
      title: '新增租户',
    }
  },

  watch: {
    timeStr() {},
  },
  methods: {
    moment,
    //初始化方法
    add(record) {
      this.visible = true
      this.reset()
      this.getApplicationlistOut()
    },

    /**
     * 查询历史随访记录
     */
    getApplicationlistOut() {
      this.confirmLoading = true
      getApplicationlist(this.queryParamsApp)
        .then((res) => {
          if (res.code == 0) {
            this.appList = res.data
            this.appListOut = JSON.parse(JSON.stringify(this.appList))
            this.appListOut.forEach((item, index) => {
              this.$set(item, 'isChecked', false)
            })
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /***
     * 新增租户接口调用
     */
    addTenant() {
      this.confirmLoading = true
      saveaddTenand(this.queryParams)
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

    formatDateOut(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      return `${myyear}-${mymonth}-${myweekday}`
    },

    //选择应用
    selectChange(record) {
      //   console.log('999999:', record.isChecked)
      if (record.isChecked) {
        this.queryParams.applicationIds.push(record.id)
      } else {
        this.queryParams.applicationIds.splice(this.queryParams.applicationIds.indexOf(record.id), 1)
        console.log('8888888:', this.queryParams.applicationIds)
      }
      this.queryParams.applicationIds = this.removeDuplicate(this.queryParams.applicationIds)
      console.log('999999:', this.queryParams.applicationIds)
    },

    //数组元素去重
    removeDuplicate(arry) {
      const newArry = []
      if (arry != null && arry.length > 0) {
        arry.forEach((item) => {
          if (!newArry.includes(item)) {
            newArry.push(item)
          }
        })
      }
      return newArry
    },

    /**
     * 重置
     */
    reset() {
      this.queryParams.adminAccount = ''
      this.queryParams.adminName = ''
      this.queryParams.email = ''
      this.queryParams.expireDate = ''
      this.queryParams.hospitalName = ''
      this.queryParams.hospitalCode = ''
      this.queryParams.phone = ''
      this.queryParams.tenantName = ''
      this.queryParams.tenantCode = ''
      this.queryParams.applicationIds = []
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
      if (!this.queryParams.adminAccount) {
        this.$message.$error('请输入管理员账号')
        return
      }

      if (!this.queryParams.adminName) {
        this.$message.$error('请输入管理员姓名')
        return
      }
      if (!this.queryParams.email) {
        this.$message.$error('请输入邮箱地址')
        return
      }
      if (!this.queryParams.expireDate) {
        this.$message.$error('请选择到期日期')
        return
      }
      if (!this.queryParams.hospitalName) {
        this.$message.$error('请输入机构名称')
        return
      }
      if (!this.queryParams.hospitalCode) {
        this.$message.$error('请输入机构编码')
        return
      }
      if (!this.queryParams.phone) {
        this.$message.$error('请输入手机号码')
        return
      }
      if (!this.queryParams.tenantName) {
        this.$message.$error('请输入租户名称')
        return
      }

      if (!this.queryParams.tenantCode) {
        this.$message.$error('请输入租户编码')
        return
      }
      if (!this.queryParams.applicationIds) {
        this.$message.$error('请选择对应应用权限')
        return
      }

      this.addTenant()
    },
  },
}
</script>




  <style lang="less">

  .rigth-content{
    display: flex;
    flex-direction: row;
    width: 80%;
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



.div-service-user {
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow: hidden;
  height: 100%;

  .div-total1 {
    height: 100px;
    width: 90%;
    margin-left: 20px;
    margin-right: 60px;
    //   background-color: #f0f0f2;
    background-color: #ffffff;
    border: 1px solid #e6e6e6;
    border-radius: 2px;
    padding: 2% 0;
    overflow: hidden;

    .div-item {
      float: left;
      width: 20%;

      p {
        margin: 0 auto;
        text-align: center;
      }
    }
  }

  .div-totalleft {
    // height: 100%;
    width: 50%;
    margin-left: 10px;
    //   background-color: #f0f0f2;
    background-color: #ffffff;
    border: 1px solid #ffffff !important;
    // border-radius: 5px;
    padding: 2% 0;
    overflow: hidden;

    .div-item {
      float: left;
      width: 20%;

      p {
        margin: 0 auto;
        text-align: center;
      }
    }
  }

  .div-totaltop {
    height: 90px;
    width: 90%;
    margin-left: 20px;
    margin-right: 60px;
    //   background-color: #f0f0f2;
    background-color: #ffffff;
    border: 1px solid #e6e6e6;
    border-radius: 2px;
    padding: 2% 0;
    overflow: hidden;

    .div-item {
      float: left;
      width: 20%;

      p {
        margin: 0 auto;
        text-align: center;
      }
    }
  }

  .div-line-wrap {
    width: 120%;
    overflow: hidden;

    .span-item-name {
      width: 80%;
      display: inline-block;
      color: #4d4d4d;
      font-size: 12px;
      text-align: left;
    }

    .span-item-value {
      width: 20%;
      // overflow: hidden;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      display: inline-block;
      text-overflow: ellipsis;
    }

    .span-item-value1 {
      width: 10%;
      margin-bottom: -4px;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      display: inline-block;
      white-space: nowrap;
      -webkit-line-clamp: 1;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .div-service-left-user {
    background-color: white;
    padding: 2% 3%;
    float: left;
    height: 100%;
    min-height: 300px;
    border-right: 1px dashed #e6e6e6;
    width: 50%;
    overflow: hidden;

    .div-divider {
      width: 100%;
      background-color: #e6e6e6;
      height: 1px;
    }

    .p-part-title {
      height: 18px;
      font-size: 18px;
      text-align: left;
      color: #000;
      font-weight: bold;
    }

    .div-part {
      overflow: hidden;
      width: 100%;
      padding-left: 5%;
      height: 10%;

      .checked {
        color: #1890ff !important;
      }

      .p-name {
        margin-top: 3.5%;
        display: block;
        height: 100%;
        padding-left: 1%;
        color: #000;
        font-size: 14px;
        text-align: left|center;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  .display-item {
    display: flex;
    flex-direction: row;
    width: 100%;
    // margin-top: -20px;
  }

  .card-right-user {
    overflow: hidden;
    width: 65% !important;

    .table-operator {
      margin-bottom: 18px;
    }
    button {
      margin-right: 8px;
    }

    .title {
      background: #fff;
      font-size: 18px;
      font-weight: bold;
      color: #000;
    }
  }
}
</style>