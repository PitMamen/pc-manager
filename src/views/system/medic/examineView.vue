<template>
  <a-modal
    :title="title"
    :width="1000"
    :height="800"
    :visible="visible"
    :footer="footer"
    @cancel="handleCancel"
    @ok="handleSubmit"
    :confirmLoading="confirmLoading"
  >
    <template slot="footer">
      <a-button type="primary" @click="handleSubmit">确定</a-button>
      <a-button @click="handleCancel">关闭</a-button>
    </template>

    <div style="height: 500px; width: 100%">
      <div class="div-appoint-detail-check">
        <div class="left-content">
          <div class="div-title-mind">
            <div class="div-line-blue"></div>
            <span class="span-title">文章内容</span>
          </div>

          <div class="top-kuang">
            <div class="title">胰岛素如何注射</div>
            <div class="line-content"></div>
            <div class="name">张燕医生 &nbsp;|&nbsp;主任医生 &nbsp;|&nbsp;中南大学湘雅二医院</div>

            <div class="time">
              <div>创建时间:2023-10-11</div>
              <div>提交时间:2023-10-12</div>
              <div style="margin-right: 30px">文章来源时间:2023-10-13</div>
            </div>
            <div class="name">转载出处:来自中南大学湘雅二医院,<www class="xy22"></www></div>

            <div class="bannarimag">
              <div>封面图片:</div>
              <img style="margin-left: 20px; height: 50px; width: 50px" src="~@/assets/icons/benci.png" />
            </div>
          </div>

          <div class="div-span-content-mid">
            <div class="big-kuang-border"></div>

            <div class="big-kuang">
              <div style="margin-left: 10px; margin-top: 10px; margin-bottom: 5px; color: #1a1a1a; font-weight: bold">
                详细内容
              </div>

              <div style="margin-left: 10px">从这里开始是文章内容</div>
            </div>
          </div>
        </div>

        <!-- <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">审核信息</span>
        </div> -->

        <!-- 右边视图 -->
        <div class="right-content" >
          <div class="div-title-right">
            <div class="div-line-blue"></div>
            <span class="span-title">审核结果</span>
          </div>

          <div class="radia-content" v-if="record.checkStatus == 1">
            <div style=" margin-top: 10px; color: #1a1a1a; ">审核结果：</div>
            <a-radio-group
              style="margin-top: 10px"
              name="radioGroup"
              v-model="radioTyPe"
              @change="radioChange"
              v-decorator="['roleId', { rules: [{ required: true, message: '请选择审核结论！' }] }]"
            >
              <a-radio :value="2" style="font-size: 8px; color: #1a1a1a; margin-right: 0px !important"> 成功 </a-radio>
              <a-radio :value="3" style="font-size: 8px; color: #1a1a1a"> 失败 </a-radio>
            </a-radio-group>
          </div>

          <div style="margin-top: 10px; color: #1a1a1a" v-if="record.checkStatus != 1">
            审核：{{ preDetailData.medicalInfo.checkStatusDesc }}
          </div>
          <div
            style=" margin-top: 10px; color: #1a1a1a"
            v-if="record.checkStatus != 1 && preDetailData.medicalInfo.checkStatus == 3"
          >
            不通过原因：{{ preDetailData.medicalInfo.refuseReason }}
          </div>

          <div class="reason-content" v-if="record.checkStatus == 1">
            <div style="margin-top: 10px; color: #1a1a1a">不通过原因 ：</div>

            <div style="display: flex; flex-direction: row; overflow: hidden; position: relative">
              <a-textarea
                :disabled="radioTyPe == 2"
                style="height: 100px; min-height: 80px; margin-top: 10px;  width: 100%"
                v-model="queryParams.refuseReason"
                :maxLength="200"
                placeholder="请输入原因"
                v-decorator="['doctorBrief', { rules: [{ required: false, message: '请输入原因!' }] }]"
              />
              <span class="m-count">{{ queryParams.refuseReason ? queryParams.refuseReason.length : 0 }}/200</span>
            </div>
          </div>

          <div style="margin-top: 10px; color: #1a1a1a">审核人 ：</div>
          <div v-if="record.checkStatus != 1" style=" margin-top: 10px; color: #1a1a1a">
            审核日期：{{ preDetailData.medicalInfo.checkDate }}
          </div>

        </div>
      </div>
    </div>
    <a-modal
      :title="titleSmall"
      :width="300"
      :height="600"
      :visible="previsible"
      :footer="footer"
      :confirmLoading="confirmLoading"
      @cancel="cancelcheckCaPassword"
      style="margin-top: 10%"
    >
      <template slot="footer">
        <a-button type="primary" @click="handlecheckCaPassword">确定</a-button>
        <a-button @click="cancelcheckCaPassword">关闭</a-button>
      </template>

      <div style="display: flex; flex-direction: row">
        <div style="margin-top: 5px">验证密码：</div>
        <a-input v-model="inputPassword" allow-clear placeholder="请输入密码" style="width: 180px" />
      </div>
    </a-modal>
  </a-modal>
</template>
  
  
  <script>
import {
  getUserExternalInfo,
  getSavedUserTagsInfo,
  checkPre,
  preDetail,
  checkCaPassword,
} from '@/api/modular/system/posManage'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'

export default {
  data() {
    return {
      titleSmall: '输入密码',
      previsible: false,
      user: {},
      record: {},
      radioTyPe: '2',
      isCheckInfo: false,
      visible: false,
      title: '处方审核',
      footer: null,
      confirmLoading: false,
      userInfoData: {},
      userTagsInfoData: [],
      preDetailData: [],
      inputPassword: '',
      queryParams: {
        checkStatus: 0,
        pageNo: 1,
        pageSize: 999,
        preNo: 0,
        refuseReason: '',
      },
    }
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
  },
  methods: {
    radioChange(e) {
      this.radioTyPe = e.target.value
      this.queryParams.checkStatus = e.target.value
      console.log('sss:', this.radioTyPe)
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

    //审核
    process(record) {
      // console.log('1111111111')
      this.title = '处方审核'
      this.visible = true
      this.record = {}
      ;(this.radioTyPe = '2'), (this.footer = undefined)
      this.record = record
      this.queryParams.preNo = record.preNo
      this.queryParams.refuseReason = ''
      this.inputPassword = ''
      this.getUserInfoOut()
      this.getSavedUserTagsInfoOut()
      this.preDetailOut()
    },

    lookview(record) {
      // console.log('22222222')
      this.title = '处方查看'
      this.footer = null
      this.visible = true
      this.record = record
      ;(this.radioTyPe = '2'), (this.queryParams.preNo = record.preNo)
      this.inputPassword = ''
      this.getUserInfoOut()
      this.getSavedUserTagsInfoOut()
      this.preDetailOut()
    },

    //查询患者基本信息接口
    getUserInfoOut() {
      this.confirmLoading = true
      getUserExternalInfo(this.record.userId)
        .then((res) => {
          if (res.code == 0) {
            this.confirmLoading = false
            this.userInfoData = res.data
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    // 查询患者标签接口
    getSavedUserTagsInfoOut() {
      this.confirmLoading = true
      getSavedUserTagsInfo(this.record.userId)
        .then((res) => {
          if (res.code == 0) {
            this.confirmLoading = false
            this.userTagsInfoData = res.data
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    // 查询处方详情接口
    preDetailOut() {
      this.confirmLoading = true
      preDetail({ preNo: this.record.preNo })
        .then((res) => {
          if (res.code == 0) {
            this.confirmLoading = false
            this.preDetailData = res.data
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    // 审核
    checkPreOut() {
      this.confirmLoading = true
      if (this.radioTyPe == 2) {
        this.queryParams.refuseReason = ''
      }
      checkPre(this.queryParams)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('操作成功!')
            this.visible = false
            this.$emit('ok', '')
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    handleCancel() {
      this.visible = false
    },

    handleSubmit() {
      this.previsible = true
      return
      // this.checkPreOut()
    },

    cancelcheckCaPassword() {
      this.previsible = false
    },

    handlecheckCaPassword() {
      checkCaPassword({ password: this.inputPassword }).then((res) => {
        if (res.code == 0) {
          this.previsible = false
          this.checkPreOut() //密码正确后 提交审核
        } else {
          this.$message.error(res.message)
        }
      })
      // this.previsible = false
    },
  },
}
</script>
  
  <style lang="less" scoped>
.midline {
  height: 100%;
  width: 1px;
  margin-left: 12px;
  margin-top: 10px;
}

.top-tab {
  width: 100%;
  overflow: hidden;
}

.div-appoint-detail-check {
  background-color: white;
  width: 100%;
  height: 97%;
  overflow: hidden;
  display: flex;
  flex-direction: row;

  .left-content {
    width: 80%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .div-title-mind {
      margin-top: 10px;
      display: flex;
      background-color: #ebebeb;
      flex-direction: row;
      width: 95% !important;
      display: flex;
      align-items: center;
      flex-direction: row;
      height: 35px;

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

    .div-title {
      margin-top: 10px;
      display: flex;
      background-color: #ebebeb;
      flex-direction: row;
      width: 20% !important;
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

    .top-kuang {
      width: 95%;
      margin-top: 8px;
      background: #ffffff;
      border: 1px solid #e6e6e6;

      .title {
        margin-left: 10px;
        margin-top: 10px;
        margin-bottom: 5px;
        color: #1a1a1a;
        font-weight: bold;
      }

      .name {
        margin-left: 10px;
        margin-top: 10px;
        color: #1a1a1a;
      }

      .time {
        margin-left: 10px;
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        color: #1a1a1a;
      }

      .bannarimag {
        margin-left: 10px;
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        margin-bottom: 5px;
      }
    }

    .div-span-content-mid {
      overflow-x: hidden;
      overflow-y: auto;
      width: 95%;
      // min-height: 100%;
      // height: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 15px;
      position: relative;
      //   border: 1px solid #dfe3e5;

      .big-kuang-border {
        width: 92%;
        margin-left: 20px;
        background: #ffffff;
        // border: 1px solid #e6e6e6;

        .line-content {
          width: 100%;
          height: 1px;
          margin-right: 10px;
          margin-right: 10px;
          background: darkgrey;
        }

        .user-content {
          margin-left: 10px;
          margin-right: 40px;
          margin-top: 10px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-between;
        }

        .top-content {
          margin-top: 10px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;

          .span-gray {
            padding: 2px 7px;
            font-size: 12px;
            margin-left: auto;
            margin-right: 20px;
            color: #4d4d4d;
            border: #4d4d4d 1px solid;
            border-radius: 4px;
          }
        }
      }
    }

    .div-span-content-left {
      width: 20%;
      // height: 100%;

      margin-top: 40px;
      margin-left: -19.9%;
      background: rgba(0, 1, 3, 0);
      border: 1px solid #dfe3e5;
      display: flex;
      flex-direction: column;
    }

    .big-kuang {
      width: 100%;
      background: #ffffff;
      border: 1px solid #e6e6e6;

      .line-content {
        width: 100%;
        height: 1px;
        margin-right: 10px;
        margin-right: 10px;
        background: darkgrey;
      }

      .user-content {
        margin-left: 10px;
        margin-right: 40px;
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
      }

      .top-content {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .span-gray {
          padding: 2px 7px;
          font-size: 12px;
          margin-left: auto;
          margin-right: 20px;
          color: #4d4d4d;
          border: #4d4d4d 1px solid;
          border-radius: 4px;
        }
      }
    }

    .span-mid-title {
      width: 100%;
      display: inline-block;
      color: #4d4d4d;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 10px;
    }
    .span-mid-audio {
      position: absolute;

      left: 26%;

      top: 35px;

      z-index: 10000;
    }
  }

  .right-content {
    width: 20%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .div-title-right {
      margin-top: 10px;
      display: flex;
      background-color: #ebebeb;
      flex-direction: row;
      width: 100% !important;
      display: flex;
      align-items: center;
      flex-direction: row;
      height: 35px;

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

    .radia-content {
      width: 100%;
      display: flex;
      flex-direction: row;
    }

    .m-count {
      position: absolute;
      font-size: 12px;
      bottom: 2px;
      right: 10px;
    }

    .reason-content {
      width: 100%;
      display: flex;
      flex-direction: column;
    }
  }

  .div-span-content-right {
    width: 20%;
    display: flex;
    flex-direction: column;
    margin-top: 40px;
    margin-left: -19.9%;
    position: relative;
    border: 1px solid #dfe3e5;
    overflow: hidden;

    .div-service-user {
      display: flex;
      flex-direction: row;
      overflow: hidden;
      width: 100%;
      height: 100%;
    }
  

    
  }
}
</style>