<template>
  <a-modal
    :title="title"
    :width="1000"
    :height="1000"
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

    <div style="height: 500px; width: 100%; display: flex; flex-direction: row">
      <div class="div-appoint-detail-check">
        <div class="div-title-mind">
          <div class="div-line-blue"></div>
          <span class="span-title">人员信息</span>
        </div>

        <div class="div-span-content-mid">
          <div class="div-up-content">
            <div class="div-pro-line" style="margin-top: -12px">
              <span class="span-item-name">头像 :</span>
              <a-avatar
                :size="48"
                :src="record.avatarUrl"
                icon="user"
                style="margin-right: 21px; margin-left: 20px; margin-top: 11px"
              />
            </div>

            <div class="div-pro-line" style="margin-left: -25px !important;">
              <span class="span-item-name">姓名 :</span>
              <span class="span-item-value">{{ record.userName }}</span>
            </div>

            <div class="div-pro-line" style="width: 31%">
              <span class="span-item-name"> 身份证号 :</span>
              <span class="span-item-value" style="width: 70%">{{ record.identificationNo }}</span>
            </div>
          </div>

          <div class="div-up-content" style="margin-left: 35%">
            <div class="div-pro-line" style="margin-left: -4.8%; margin-top: -2%">
              <span class="span-item-name">联系电话 :</span>
              <span class="span-item-value" style="width: 48%">{{ record.phone }}</span>
            </div>

            <div class="div-pro-line" style=" margin-top: -2%">
              <span class="span-item-name"> 类型 :</span>
              <span class="span-item-value" style="width: 70%">{{ record.personType }}</span>
            </div>
          </div>

          <div class="div-up-content">
            <div class="div-pro-line">
              <span class="span-item-name">职称 :</span>
              <span class="span-item-value" style="width: 48%">{{ record.professionalTitle }}</span>
            </div>

            <div class="div-pro-line" style="margin-left: -4%">
              <span class="span-item-name">所属机构 :</span>
              <span class="span-item-value" style="width: 48%">{{ record.hospitalName }}</span>
            </div>

            <div class="div-pro-line" >
              <span class="span-item-name">所属科室 :</span>
              <span class="span-item-value" style="width: 48%">{{ record.departmentName }}</span>
            </div>
          </div>

          <div class="div-up-content">
            <div class="div-pro-line" style="width: 100%">
              <span class="span-item-name">擅长领域 :</span>

              <span class="span-item-value" style="width: 100%; flex-wrap: wrap">{{ record.expertInDisease }}</span>
            </div>
          </div>

          <div class="div-up-content">
            <div class="div-pro-line" style="width: 100%">
              <span class="span-item-name">详细介绍 :</span>

              <span class="span-item-value" style="width: 100%; flex-wrap: wrap">{{ record.doctorBrief }}</span>
            </div>
          </div>

          <div class="item-idcard" style="margin-top: 15px">
            <!-- 身份证照片 -->
            <div style="margin-left: 10px; color: #333">身份证照片：</div>

            <a-upload
              :disabled="true"
              :showUploadList="{ showRemoveIcon: false }"
              list-type="picture-card"
              :file-list="idcardZList"
              accept="image/jpeg,image/png,image/jpg"
            >
            </a-upload>

            <a-upload
              :disabled="true"
              :showUploadList="{ showRemoveIcon: false }"
              list-type="picture-card"
              :file-list="idcardFList"
              accept="image/jpeg,image/png,image/jpg"
            >
            </a-upload>


            <!-- 职称照片 -->
            <div style="margin-left: 3%; color: #333">职称照片：</div>

            <a-upload
              :disabled="true"
              :showUploadList="{ showRemoveIcon: false }"
              list-type="picture-card"
              :file-list="titleZList"
              accept="image/jpeg,image/png,image/jpg"
            >
            </a-upload>

          </div>

          <div class="item-idcard" style="margin-top: 15px">
            <!-- 资格证照片 -->
            <div style="margin-left: 10px; color: #333">资格证照片：</div>

            <a-upload
              :disabled="true"
              :showUploadList="{ showRemoveIcon: false }"
              list-type="picture-card"
              :file-list="qualificationZList"
              accept="image/jpeg,image/png,image/jpg"
            >
            </a-upload>

            <a-upload
              :disabled="true"
              :showUploadList="{ showRemoveIcon: false }"
              list-type="picture-card"
              :file-list="qualificationFList"
              accept="image/jpeg,image/png,image/jpg"
            >
            </a-upload>

            <!-- <img style="width: 60px; height: 60px; margin-left: 10px" class="item-image" :src="record.qualificationZ" /> -->
            <!-- <img style="width: 60px; height: 60px; margin-left: 20px" class="item-image" :src="record.qualificationF" /> -->

            <!-- 执业证照片 -->
            <div style="margin-left: 3%; color: #333">执业证照片：</div>

            <a-upload
              :disabled="true"
              :showUploadList="{ showRemoveIcon: false }"
              list-type="picture-card"
              :file-list="practiceZList"
              accept="image/jpeg,image/png,image/jpg"
            >
            </a-upload>

            <a-upload
              :disabled="true"
              :showUploadList="{ showRemoveIcon: false }"
              list-type="picture-card"
              :file-list="practiceFList"
              accept="image/jpeg,image/png,image/jpg"
            >
            </a-upload>

            <!-- <img style="width: 60px; height: 60px; margin-left: 10px" class="item-image" :src="record.practiceZ" /> -->
            <!-- <img style="width: 60px; height: 60px; margin-left: 10px" class="item-image" :src="record.practiceF" /> -->
          </div>
        </div>
      </div>

      <div class="right-content1">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">审核信息</span>
        </div>

        <div class="div-span-content-right" style="position: relative">
          <div class="div-service-user">
            <span style="color: #000">渠道来源：</span>
            <span style="color: #000">{{ record.authSourceStr }}</span>
          </div>

          <div v-if="record.isLook" class="div-service-user">
            <span style="color: #000">审核：</span>
            <span style="color: #000">{{ record.authStatusStr }}</span>
          </div>

          <div v-if="record.isLook && record.authStatusStr == '审核不通过'" class="div-service-user">
            <span style="color: #000">不通过原因：</span>
            <span style="color: #000">{{ record.reason }}</span>
          </div>

          <div v-if="!record.isLook" class="radia-content">
            <div style="margin-left: 22px; margin-top: 10px; color: #1a1a1a; width: 50px">审核：</div>
            <a-radio-group
              style="margin-top: 10px"
              name="radioGroup"
              v-model="radioTyPe"
              @change="radioChange"
              v-decorator="['roleId', { rules: [{ required: true, message: '请选择审核结论！' }] }]"
            >
              <a-radio :value="2" style="font-size: 8px; color: #1a1a1a; margin-right: 0px !important"> 通过 </a-radio>
              <a-radio :value="3" style="font-size: 8px; color: #1a1a1a"> 不通过 </a-radio>
            </a-radio-group>
          </div>

          <div v-if="radioTyPe == 3" class="reason-content">
            <div style="margin-left: 20px; margin-top: 10px; color: #1a1a1a">不通过原因 ：</div>

            <div style="display: flex; flex-direction: row; overflow: hidden; position: relative; margin-left: 10px">
              <a-textarea
                style="height: 80px; min-height: 80px; margin-top: 10px; margin-left: 10px; width: 87%"
                v-model="queryParams.reason"
                :maxLength="200"
                placeholder="请输入原因"
                v-decorator="['doctorBrief', { rules: [{ required: false, message: '请输入科室简介！' }] }]"
              />
              <span class="m-count">{{ queryParams.reason ? queryParams.reason.length : 0 }}/200</span>
            </div>
          </div>

          <div v-if="record.isLook" class="div-service-user">
            <span style="color: #000">审核人：</span>
            <span style="color: #000">{{ record.updateName }}</span>
          </div>

          <div v-if="record.isLook" class="div-service-user">
            <span style="color: #000">审核日期：</span>
            <span style="color: #000">{{ record.updateTime }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- <a-modal
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
        <a-input allow-clear placeholder="请输入密码" style="width: 180px" />
      </div>
    </a-modal> -->
  </a-modal>
</template>
  
  
  <script>
import { temporaryAudit } from '@/api/modular/system/posManage'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'

export default {
  components: {},

  data() {
    return {
      titleSmall: '输入密码',
      idcardZList: [],
      idcardFList: [],
      titleZList: [],
      qualificationZList: [],
      qualificationFList: [],
      practiceZList: [],
      practiceFList: [],
      previsible: false,
      user: {},
      record: {},
      radioTyPe: '2',
      isCheckInfo: false,
      visible: false,
      title: '人员审核',
      footer: null,
      confirmLoading: false,
      userInfoData: {},
      userTagsInfoData: [],
      preDetailData: [],
      queryParams: {
        authSource: 1,
        authStatus: 3,
        reason: '',
        userId: '',
      },
    }
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    console.log("ddd:",this.user)
  },
  methods: {
    radioChange(e) {
      this.radioTyPe = e.target.value
      this.queryParams.authStatus = this.radioTyPe == 3 ? 3 : 9
      //   console.log('sss:', this.radioTyPe)
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
      this.title = '人员审核'
      this.visible = true
      this.record = {}
      ;(this.radioTyPe = '2'), (this.footer = undefined)
      this.record = record
      this.queryParams.userId = record.userId
      this.queryParams.authSource = record.authSource

      this.idcardZList = []
      this.idcardFList = []
      this.titleZList = []
      this.qualificationZList = []
      this.qualificationFList = []
      this.practiceZList = []
      this.practiceFList = []

      if (record.idcardZ) {
        this.idcardZList.push({
          uid: '-1',
          name: '照片',
          status: 'done',
          // url: record.idcardZ,
          url: record.idcardZ,
        })
      }

      if (record.idcardF) {
        this.idcardFList.push({
          uid: '-1',
          name: '照片',
          status: 'done',
          // url: record.idcardF,
          url: record.idcardF,
        })
      }

      if (record.titleZ) {
        //   职称证
        this.titleZList.push({
          uid: '-1',
          name: '照片',
          status: 'done',
          url: record.titleZ,
          // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        })
      }

      if (record.qualificationZ) {
        // 资格证
        this.qualificationZList.push({
          uid: '-1',
          name: '照片',
          status: 'done',
          url: record.qualificationZ,
          // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        })
      }

      if (record.qualificationF) {
        this.qualificationFList.push({
          uid: '-1',
          name: '照片',
          status: 'done',
          url: record.qualificationF,
          // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        })
      }

      if (record.practiceZ) {
        //   执业证
        this.practiceZList.push({
          uid: '-1',
          name: '照片',
          status: 'done',
          url: record.practiceZ,
          // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        })
      }

      if (record.practiceF) {
        this.practiceFList.push({
          uid: '-1',
          name: '照片',
          status: 'done',
          url: record.practiceF,
          // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        })
      }
    },

    lookview(record) {
      // console.log('22222222')
      this.title = '人员审核'
      this.footer = null
      this.visible = true
      this.record = record
      ;(this.radioTyPe = '2'), (this.queryParams.preNo = record.preNo)
    },

    // 审核
    temporaryAuditOut() {
      this.confirmLoading = true
      if (this.radioTyPe == 2) {
        this.queryParams.reason = ''
      }
      temporaryAudit(this.queryParams)
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
      if (this.record.isLook) {
        this.visible = false
        return
      }

      this.temporaryAuditOut()
    },

    // cancelcheckCaPassword() {
    //   this.previsible = false
    // },

    // handlecheckCaPassword() {
    //   checkCaPassword({ password: this.inputPassword }).then((res) => {
    //     if (res.code == 0) {
    //       this.previsible = false
    //       this.checkPreOut() //密码正确后 提交审核
    //     } else {
    //       this.$message.error(res.message)
    //     }
    //   })
    // },
  },
}
</script>


<style lang="less" scoped>
.ant-upload-picture-card-wrapper {
  display: inline-block;
  zoom: 1;
  width: 100px;
}
</style>
  
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

.right-content1 {
  display: flex;
  flex-direction: column;
  width: 45%;

  .div-title {
    margin-top: 10px;
    display: flex;
    background-color: #ebebeb;
    flex-direction: row;
    width: 86% !important;
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 26px;
    margin-left: 40px;

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

  .div-span-content-right {
    margin-left: 40px;
    width: 86%;
    height: 86%;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    // margin-left: -19.9%;
    // position: relative;
    border: 1px solid #dfe3e5;
    overflow: hidden;

    .div-service-user {
      display: flex;
      flex-direction: row;
      overflow: hidden;
      width: 100%;
      margin-left: 20px;
      margin-top: 22px;
    }

    // .div-title-mind {
    //   margin-top: 10px;
    //   display: flex;
    //   background-color: #ebebeb;
    //   flex-direction: row;
    //   width: 100% !important;
    //   display: flex;
    //   align-items: center;
    //   flex-direction: row;
    //   height: 26px;

    //   .div-line-blue {
    //     width: 5px;
    //     height: 100%;
    //     background-color: #1890ff;
    //   }
    //   .span-title {
    //     font-size: 12px;
    //     margin-left: 10px;
    //     font-weight: bold;
    //     color: #333;
    //   }
    // }

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
      margin-top: 10px;
    }

    .radia-content {
      width: 100%;
      display: flex;
      flex-direction: row;
      margin-top: 10px;
    }
  }
}

.div-appoint-detail-check {
  background-color: white;
  width: 88% !important;
  height: 97%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .div-title-mind {
    margin-top: 10px;
    background-color: #ebebeb;
    width: 100% !important;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    height: 30px;

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

  .div-span-content-mid {
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
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

    .div-up-content {
      width: 100%;
      display: flex;
      padding-left: 8px;
      flex-direction: row;
      margin-left: 30px;
      margin-top: 8px;

      .div-pro-line {
        width: 30%;
        margin-top: 1%;
        overflow: hidden;

        .ant-select {
          width: 58.5% !important;
          margin-left: 1.5% !important;
        }

        .span-item-name {
          display: inline-block;
          color: #000;
          font-size: 12px;
          text-align: left;
        }
        .span-item-value {
          width: 38%;
          color: #333;
          text-align: left;
          padding-left: 1.5%;
          font-size: 12px;
          //   display: inline-block;
        }

        // global-search ant-select ant-select-combobox
        .global-search.ant-select {
          width: 90% !important;
        }
      }
    }

    .item-idcard {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width: 95%;
      margin-left: 25px;
      //   margin-bottom: 8px;
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
      //   display: inline-block;
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