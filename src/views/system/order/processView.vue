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
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">患者信息</span>
        </div>
        <!-- 左边视图 -->
        <div class="div-span-content-left" style="overflow-y: auto !important">
          <!-- <div style="margin-left: 10px; margin-top: 5px; color: #1a1a1a">患者信息</div> -->
          <!-- <div style="width: 100%; height: 1px; margin-top: 5px; background: darkgrey"></div> -->
          <div style="margin-left: 10px; margin-top: 5px; color: #1a1a1a">姓 名:{{ userInfoData.name }}</div>
          <div style="margin-left: 10px; margin-top: 5px; color: #1a1a1a">年 龄:{{ userInfoData.age }}</div>
          <div style="margin-left: 10px; margin-top: 5px; color: #1a1a1a">性 别:{{ userInfoData.sex }}</div>
          <div style="margin-left: 10px; margin-top: 5px; color: #1a1a1a">身 高:{{ userInfoData.height }} cm</div>
          <div style="margin-left: 10px; margin-top: 5px; color: #1a1a1a">体 重:{{ userInfoData.weight }} kg</div>
          <div style="margin-left: 10px; margin-top: 5px; color: #1a1a1a">血 型:{{ userInfoData.bloodType }}</div>
          <div style="margin-left: 10px; margin-top: 5px; color: #1a1a1a">
            婚姻状况:{{ userInfoData.ismarry  }}
          </div>
          <div style="margin-left: 10px; margin-top: 5px; color: #1a1a1a">
            生育状况:{{ userInfoData.havechild  }}
          </div>
          <div v-for="(item, index) in userTagsInfoData" :key="index" :value="item.name">
            <div
              style="
                margin-left: 10px;
                margin-top: 5px;
                color: #1a1a1a;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
              "
            >
              {{ item.name }}:
              <div v-for="(item1, index1) in item.value" :key="index1" :value="item1.value">
                {{ item1.tagsName }}{{ item.value.length - 1 > 0 && index1 != item.value.length - 1 ? '，' : '' }}
              </div>
            </div>
          </div>
        </div>

        <div class="midline"></div>

        <!-- 中间视图 style="overflow-y: auto"-->

        <div class="div-title-mind">
          <div class="div-line-blue"></div>
          <span class="span-title">处方信息</span>
        </div>

        <div class="div-span-content-mid">
          <!-- <div style="margin-left: 20px; margin-top: 5px; color: #1a1a1a">处方信息</div> -->
          <!-- <div style="width: 100%; height: 1px; margin-top: 5px; padding-bottom: 1px; background: darkgrey"></div> -->
          <div class="big-kuang-border">
            <div class="top-content">
              <div style="margin-left: 30%; color: #1a1a1a">{{ preDetailData.medicalInfo.preHead }}</div>
              <div class="span-gray">{{ preDetailData.medicalInfo.preType }}</div>
            </div>

            <div style="margin-left: 43%; margin-top: 10px; color: #1a1a1a">
              {{ preDetailData.medicalInfo.preTitle }}
            </div>
            <div class="user-content">
              <div style="color: #1a1a1a">姓名:{{ preDetailData.medicalInfo.name }}</div>
              <div style="color: #1a1a1a">性别:{{ preDetailData.medicalInfo.sex }}</div>
              <div style="color: #1a1a1a">年龄:{{ preDetailData.medicalInfo.age }}</div>
            </div>
            <div class="user-content" style="margin-bottom: 15px">
              <div style="color: #1a1a1a">科室:{{ preDetailData.medicalInfo.deptName }}</div>
              <div style="color: #1a1a1a">日期:{{ preDetailData.medicalInfo.createDate }}</div>
            </div>
          </div>

          <div class="big-kuang">
            <div style="margin-left: 10px; margin-top: 10px; margin-bottom: 5px; color: #1a1a1a; font-weight: bold">
              诊断
            </div>
            <div class="line-content"></div>
            <div style="margin-left: 10px; margin-top: 5px; margin-bottom: 5px; color: #1a1a1a">
              {{ preDetailData.diagnosis }}
            </div>
          </div>

          <div class="big-kuang">
            <div style="margin-left: 10px; margin-top: 10px; margin-bottom: 5px; color: #1a1a1a; font-weight: bold">
              RP
            </div>
            <div style="width: 100%; height: 1px; margin-right: 10px; margin-right: 10px; background: darkgrey"></div>
            <div v-for="(item, index) in preDetailData.medOrderItems" :key="index" :value="item.drugName">
              <div class="top-content">
                <div style="margin-left: 10px; margin-top: 5px; margin-bottom: 5px; color: #1a1a1a">
                  {{ index + 1 }}.{{ item.drugName }}
                </div>
                <div style="margin-left: auto; margin-top: 5px; margin-bottom: 5px; margin-right: 5px; color: #1a1a1a">
                  X{{ item.itemNum }}{{ item.itemDrugUnit }}
                </div>
              </div>
              <div style="margin-left: 10px; color: #999999; font-size: 1em">规格:{{ item.drugSpec }}</div>
              <div style="margin-left: 10px; color: #1a1a1a; font-size: 10px">
                用法用量:{{ item.frequency }},1次{{ item.useNum + item.useUnit }},{{ item.useMethod }}
              </div>
            </div>
          </div>

          <div class="big-kuang" style="margin-bottom: 10px">
            <div style="margin-left: 10px; margin-top: 10px; margin-bottom: 5px; color: #1a1a1a; font-weight: bold">
              签字盖章
            </div>
            <div class="line-content"></div>

            <div v-if="!preDetailData.caAuthFlag" style="margin-left: 10px; color: #1a1a1a">
              开方医生：{{ preDetailData.medicalInfo.doctorName }}
            </div>
            <div
              v-if="preDetailData.caAuthFlag"
              style="margin-left: 10px; color: #1a1a1a; display: flex; flex-direction: row; margin-top: 5px"
            >
              开方医生：
              <img style="width: 80px; height: 30px" :src="preDetailData.doctorCerFile" />
            </div>
            <div style="margin-left: 10px; color: #1a1a1a; margin-bottom: 10px">
              执行科室：{{ preDetailData.medicalInfo.deptName }}
            </div>
            <div v-if="!preDetailData.caAuthFlag" style="margin-left: 10px; color: #1a1a1a">
              审核药师：{{ preDetailData.medicalInfo.checkUserName }}
            </div>
            <div
              v-if="preDetailData.caAuthFlag"
              style="margin-left: 10px; color: #1a1a1a; display: flex; flex-direction: row; margin-top: 5px"
            >
              审核药师：
              <img v-if="preDetailData.checkerCerFile" style="width: 80px; height: 30px; margin-bottom: 5px" :src="preDetailData.checkerCerFile" />
            </div>
          </div>
        </div>

        <div class="midline"></div>

        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">审核信息</span>
        </div>

        <!-- 右边视图 -->
        <div class="div-span-content-right" style="position: relative">
          <!-- <div style="margin-left: 20px; margin-top: 5px; color: #1a1a1a">审核信息</div>
          <div style="width: 100%; height: 1px; margin-top: 5px; padding-bottom: 1px; background: darkgrey"></div> -->

          <div class="radia-content" v-if="record.checkStatus == 1">
            <div style="margin-left: 10px; margin-top: 10px; color: #1a1a1a; width: 50px">审核：</div>
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

          <div style="margin-left: 10px; margin-top: 10px; color: #1a1a1a" v-if="record.checkStatus != 1">
            审核：{{ preDetailData.medicalInfo.checkStatusDesc }}
          </div>
          <div
            style="margin-left: 10px; margin-top: 10px; color: #1a1a1a"
            v-if="record.checkStatus != 1 && preDetailData.medicalInfo.checkStatus == 3"
          >
            失败原因：{{ preDetailData.medicalInfo.refuseReason }}
          </div>

          <div class="reason-content" v-if="record.checkStatus == 1">
            <div style="margin-left: 10px; margin-top: 10px; color: #1a1a1a">失败原因 ：</div>

            <div style="display: flex; flex-direction: row; overflow: hidden; position: relative">
              <a-textarea
                :disabled="radioTyPe == 2"
                style="height: 80px; min-height: 80px; margin-top: 10px; margin-left: 10px; width: 87%"
                v-model="queryParams.refuseReason"
                :maxLength="200"
                placeholder="请输入原因"
                v-decorator="['doctorBrief', { rules: [{ required: false, message: '请输入科室简介！' }] }]"
              />
              <span class="m-count">{{ queryParams.refuseReason ? queryParams.refuseReason.length : 0 }}/200</span>
            </div>
          </div>

          <!-- 审核药师不再右边区域显示 改成中间底部显示 -->
          <!-- <div v-if="record.checkStatus != 1" style="margin-left: 10px; margin-top: 10px; color: #1a1a1a">
            审核药师：{{ preDetailData.medicalInfo.checkUserName }}
          </div> -->
          <div v-if="record.checkStatus != 1" style="margin-left: 10px; margin-top: 10px; color: #1a1a1a">
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
            if (this.userInfoData) {
              if (this.userInfoData.ismarry) {
                this.$set(this.userInfoData,'ismarry',this.userInfoData.ismarry==1?'已婚':'未婚')
              }else{
                this.$set(this.userInfoData,'ismarry','')
              }

              if (this.userInfoData.havechild) {
                this.$set(this.userInfoData,'havechild',this.userInfoData.havechild==1?'已育':'未育')
              }else{
                this.$set(this.userInfoData,'havechild','')
              }
            }
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
          if(res.code==0){
            this.previsible = false
            this.checkPreOut() //密码正确后 提交审核
          }else{
            this.$message.error(res.message)
          }

      })
      // this.previsible = false
    },
  },
}
</script>

<style lang="less">
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

  .div-title-mind {
    margin-top: 10px;
    display: flex;
    background-color: #ebebeb;
    flex-direction: row;
    width: 56% !important;
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
  .div-span-content-mid {
    overflow-x: hidden;
    overflow-y: auto;
    width: 56%;
    // min-height: 100%;
    // height: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 40px;
    margin-left: -55.9%;
    position: relative;
    border: 1px solid #dfe3e5;

    .big-kuang-border {
      width: 92%;
      margin-left: 20px;
      margin-right: 50px;
      margin-top: 8px;
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

    .big-kuang {
      width: 92%;
      margin-left: 20px;
      margin-right: 50px;
      margin-top: 8px;
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
    .m-count {
      position: absolute;
      font-size: 12px;
      bottom: 2px;
      right: 30px;
    }

    .reason-content {
      width: 100%;
      display: flex;
      flex-direction: column;
    }

    .radia-content {
      width: 100%;
      display: flex;
      flex-direction: row;
    }
  }

  .div-line-wrap {
    width: 100%;
    margin-top: 3%;
    overflow: hidden;

    .span-item-name {
      width: 33%;
      display: inline-block;
      color: #000;
      font-size: 12px;
      text-align: left;
    }
    .span-item-value {
      width: 65%;
      color: #333;
      text-align: left;
      font-size: 12px;
      display: inline-block;
    }
    .span-item-name-info {
      display: inline-block;
      color: #000;
      font-size: 12px;
      text-align: left;
      margin-right: 5px;
    }
    .span-item-value-info {
      color: #333;
      text-align: left;
      font-size: 12px;
      display: inline-block;
    }
    .span-textarea-value {
      width: 100%;
      color: #333;
      text-align: left;
      height: 200px !important;
      font-size: 12px;
      display: inline-block;
    }
    .ant-select {
      width: 65% !important;
    }
  }

  .div-his-item {
    width: 100%;
    overflow: hidden;
    display: flex;
    height: 40px;
    align-items: center;

    border-bottom: 1px solid #dfe3e5;
    .div-time {
      display: inline-block;
      color: #000;
      font-size: 12px;
      text-align: left;
      margin-left: 16px;
      width: 92px;
    }
    .div-content {
      color: #000;
      text-align: left;
      font-size: 12px;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .div-voice-wrap {
    width: 100%;
    overflow: hidden;
    display: flex;
    .img {
      width: 12px;
      height: 19px;
      margin-right: 8px;
      margin-bottom: 3px;
    }
    .span-item-name {
      display: inline-block;
      color: #000;
      font-size: 14px;
      text-align: left;
    }
    .div-voice-content {
      flex: 1;
    }
    .div-voice-item {
      display: inline-block;
      color: #409eff;
      font-size: 14px;
      text-align: left;
      margin-left: 16px;
      margin-right: 20px;
    }
  }
}
</style>