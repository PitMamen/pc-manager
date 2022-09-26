<template>
  <a-modal
    title=""
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-order-detail" id="printContent">
        <h2>预约</h2>
        <div class="div-line-wrap">
          <span class="span-item-name"> 姓名 :</span>
          <span class="span-item-value">{{ record.xm || '' }} </span>
          <span class="span-item-name" style="margin-left: 3%"> 住院号 :</span>
          <span class="span-item-value" style="margin-left: -5%">{{ record.zyh || '' }}</span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 科室 :</span>
          <span class="span-item-value">{{ record.ksmc || '' }} </span>

          <!-- <span class="span-item-name" style="margin-left: 3%"> 医生 :</span>
          <span class="span-item-value" style="margin-left: -5%">{{ '李铁' }} </span> -->
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 复诊时间 :</span>
          <span class="span-item-value">{{ record.appointment_datetime || '' }} </span>

          <span class="span-item-name" style="margin-left: 3%"> 计划 :</span>
          <span class="span-item-value" style="margin-left: -5%">{{ record.plan_name }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 预约信息 :</span>
          <span class="span-item-value">{{ '(该信息将会以短信的方式发送给患者)' }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 预约医生 :

            <a-input with="60%" v-model="queryParamsConfirm.appointmentDoctorName" allow-clear placeholder="请输入医生姓名" />
          </span>
        

          <!-- <a-select allow-clear v-model="queryParamsConfirm.appointmentDoctorId" placeholder="医生">
            <a-select-option v-for="(item, index) in docList" :key="index" :value="item.userId">{{
              item.userName
            }}</a-select-option>
          </a-select> -->
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 时间 :</span>
          <a-date-picker format="YYYY-MM-DD" v-model="queryParamsConfirm.appointmentDatetime" />

          <a-time-picker
            style="margin-left: 2%"
            @change="timeChangeStart"
            :default-value="moment('12:00', 'HH:mm')"
            format="HH:mm"
          />
        </div>

        <div class="div-divider"></div>
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import { getUserList, rdiagnosisFun } from '@/api/modular/system/posManage'
import moment from 'moment'

export default {
  data() {
    return {
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
      total: 0,
      docList: [],
      timeStr: '',
      record: {},
      queryParamsConfirm: {
        appointmentDatetime: '',
        appointmentDoctorId: '',
        appointmentDoctorName: '',
        appointmentText: '',
        id: '',
      },

      queryParam: {
        pageNo: 1,
        pageSize: 1000,
        roleId: 3,
        departmentId: 0,
        status: 0,
      },
    }
  },

  watch: {
    timeStr() {},
  },

  created() {},

  methods: {
    moment,
    //初始化方法
    edit(record) {
      this.visible = true
      this.record = record
      this.queryParamsConfirm.id = record.id
      this.getDocs()
    },

    formatDate(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      return `${myyear}-${mymonth}-${myweekday}`
    },

    rdiagnosisFun() {
      this.queryParamsConfirm.appointmentDatetime = this.formatDate(queryParamsConfirm.appointmentDatetime) + this.timeStr
      console.log('请求参数:', this.queryParamsConfirm)

      // rdiagnosisFun(this.queryParamsConfirm).then((res) => {
      //   if (res.code == 0) {
      //   }
      // })
    },

    getDocs() {
      getUserList(this.queryParam).then((res) => {
        if (res.code == 0) {
          this.docList = res.data.rows
        }
      })
    },

    timeChangeStart(moment, time) {
      this.timeStr = time
      console.log('s1', moment)
      console.log('s2', time)
    },

    handleSubmit() {
      this.rdiagnosisFun()
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>
<style lang="less">
.div-order-detail {
  background-color: white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0 5% 0 5%;
  // padding: 0 15%;
  .p-title {
    margin-top: 20px;
    height: 20px;
    font-size: 20px;
    text-align: left;
    color: #000;
    font-weight: bold;
    // border-bottom: 1px solid #e6e6e6;
  }
  .div-divider {
    margin-top: 4%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1.5px;
  }

  .div-line-wrap {
    width: 100%;
    margin-top: 3%;
    overflow: hidden;

    .span-item-name {
      width: 13%;
      display: inline-block;
      color: #000;
      font-size: 14px;
      text-align: left;
    }
    .span-item-value {
      width: 35%;
      color: #333;
      text-align: left;
      padding-left: 20px;
      font-size: 14px;
      display: inline-block;
    }

    .ant-select {
      width: 18.5% !important;
      margin-left: 1.5% !important;
    }

    .sign-name {
      color: #000;
      font-size: 18px;
      font-family: '楷体', '楷体_GB2312';
      // font-family: 'FZKai-Z03S';
      // font-family: 'LiSu';
      font-style: italic;
    }
  }

  .div-medicine-fang-wrap {
    margin-top: 2%;
    width: 96%;
    margin-left: 2%;
    // height: 100%;
    border-radius: 6px;
    border: 1px solid #e6e6e6;

    .firstItem {
      // border-radius: 6px;
      border-bottom: 1px solid #e6e6e6;
    }
    .div-medicine-fang-item {
      background-color: white;
      padding: 2% 2%;

      // margin-top: 1%;
      // margin-bottom: 1%;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .div-line-medicine {
        width: 100%;
        margin-top: 1%;
        overflow: hidden;
        .span-item-name {
          width: 15%;
          display: inline-block;
          color: #000;
          font-size: 14px;
          text-align: left;
        }

        .span-item-value {
          width: 15%;
          color: #333;
          text-align: left;
          padding-left: 10px;
          font-size: 14px;
          display: inline-block;
        }
      }
    }
  }

  .btn-add-plan {
    margin-top: 3%;
    margin-left: 35%;
  }
  .btn-save-plan {
    margin-top: 5%;
    display: block;
    margin-bottom: 10%;
  }
}
.div-detail {
  margin-left: 2%;
  margin-top: 1%;
  color: #1890ff;
  &:hover {
    cursor: pointer;
  }
}
</style>
