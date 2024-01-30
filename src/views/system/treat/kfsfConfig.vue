<template>
  <a-modal
    :title="titleTab"
    :visible="visible"
    :width="800"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-part">
        <div class="div-part-left">
          <div class="div-content">
            <span style="color: #4d4d4d"
              >{{ record.userName }} &nbsp;|&nbsp;{{ record.userSex }}&nbsp;|&nbsp;{{ record.userAge }}&nbsp;|&nbsp;{{
                record.hospitalName
              }}</span
            >

            <div style="flex-wrap: wrap; margin-left: auto; display: flex; flex-direction: row">
              <div style="color: #4d4d4d; margin-top: 5px">分成</div>
              <a-input-number
                style="display: inline-block; width: 70px; margin-left: 10px"
                v-model="achievementRatio"
                :min="0"
                :max="100"
                :maxLength="30"
                allow-clear
              />
              <div style="margin-top: 5px; margin-left: 5px; margin-right: 20px">%</div>
            </div>
          </div>

          <div class="div-mission-content" v-for="(item, index) in taskList" :key="index" :value="item">
            <div class="mission-top-add">
              <div class="div-content">
                <span class="span-item-name">单价 </span>
                <a-input-number
                  style="display: inline-block; width: 70px"
                  v-model="item.price"
                  :min="1"
                  :max="10000"
                  :maxLength="30"
                  allow-clear
                />
                <div style="margin-left: 5px; color: #4d4d4d">元</div>

                <span class="span-item-name" style="margin-left: 25px">图文咨询配置</span>
                <!--  -->
                <a-checkbox style="margin-left: 5px" @click="limitEnable(item)" :checked="item.isLimit" />
                <span class="span-item-name" style="margin-left: 10px">限制条数</span>
                <a-input
                  :maxLength="20"
                  class="span-item-value"
                  v-model="item.textCount"
                  style="display: inline-block; width: 60px"
                  allow-clear
                />

                <!--  -->
                <!-- <a-checkbox style="margin-left: 20px" @click="limitService(item)" :checked="item.isSerLimit" /> -->
                <span class="span-item-name" style="margin-left: 20px">随访计划</span>
                <a-select
                  class="span-item-value"
                  v-model="item.followPlanId"
                  placeholder="请选择随访计划"
                  allow-clear
                  style="width: 120px; height: 28px"
                >
                  <a-select-option v-for="item in plans" :key="item.id" :value="item.id">{{
                    item.planName
                  }}</a-select-option>
                </a-select>

                <span class="span-item-name" style="margin-left: 20px">服务时效</span>
                <a-input
                  :disabled="true"
                  :maxLength="20"
                  class="span-item-value"
                  v-model="item.expireValue"
                  style="display: inline-block; width: 80px"
                  allow-clear
                />

                <!-- <a-select v-model="item.timeUnit" style="width: 70px; margin-left: 10px" allow-clear placeholder="单位">
                  <a-select-option v-for="(item, index) in timeUnitTypesData" :key="index" :value="item.code">{{
                    item.value
                  }}</a-select-option>
                </a-select> -->
              </div>
            </div>

            <div class="div-divider">
              <div class="div-content">
                <div class="small-content">
                  <a-button :style="{ 'margin-right': '10px' }" type="primary" ghost @click="deleteTask(item, index)"
                    >删除</a-button
                  >
                  <a-button
                    style="margin-right: 10px"
                    type="primary"
                    @click="addTask()"
                    v-if="index == taskList.length - 1"
                    >新增</a-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
                
                
                <script>
import {
  mgrDoctorRehabilitationFollows,
  qryFollowPlanByFollowType,
  deleteRehabilitationFollowCommodity,
  mgrSaveDoctorRehabilitationFollows,
} from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { isObjectEmpty, isStringEmpty, isArrayEmpty, formatDate } from '@/utils/util'
import Vue from 'vue'
import moment from 'moment'
import { Item } from 'ant-design-vue/es/vc-menu'
export default {
  components: {},
  data() {
    return {
      visible: false,
      titleTab: '康复随访配置',
      plans: [],
      record: {},
      headers: {},
      confirmLoading: false,
      achievementRatio: 0,

      taskList: [
        {
          commodityId: '',
          commodityPkgId: '',
          doctorUserId: '',
          expireValue: '',
          followPlanId: '',
          followPlanName: '',
          price: 0,
          textCount: 0,
        },
      ],
    }
  },
  created() {},
  methods: {
    moment,
    clearData() {
      this.taskList = []
    },

    addTask() {
      if (this.taskList.length >= 5) {
        this.$message.error('最多5条')
        return
      }

      this.taskList.push({
        commodityId: '',
        commodityPkgId: '',
        doctorUserId: this.record.userId,
        expireValue: '0天',
        followPlanId: '',
        followPlanName: '',
        price: 0,
        textCount: 0,
        isLimit: false,
      })
    },

    deleteTask(item, index) {
      console.log('CCCC:', item)
      if (this.taskList.length == 1) {
        this.$message.error('至少配置一项!')
        return
      }

      if (!item.commodityId || item.commodityId == '') {
        //如果删除新增的  直接删除视图
        this.taskList.splice(index, index)
        return
      }

      this.delCollectionItemByidOut(item.commodityId, index)
      // this.taskList.splice(index, 1)
    },

    /**
     * 随访方案列表
     */
    qryFollowPlanByFollowTypeOut() {
      // this.confirmLoading = true
      qryFollowPlanByFollowType({
        tenantId: '',
        hospitalCode: this.record.hospitalCode,
        followType: 4,
      })
        .then((res) => {
          if (res.code == 0) {
            this.plans = res.data
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    // 单独删除
    delCollectionItemByidOut(commodityId, index) {
      console.log('ID:', commodityId)
      this.confirmLoading = true
      deleteRehabilitationFollowCommodity({ commodityId: commodityId })
        .then((res) => {
          this.confirmLoading = false
          if (res.code == 0) {
            this.taskList.splice(index, index)
            this.$message.success('刪除成功')
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    limitEnable(item) {
      item.isLimit = !item.isLimit
    },

    // limitService(item) {
    //   item.isSerLimit = !item.isSerLimit
    // },

    // 康复随访
    kfsfmodal(record) {
      this.clearData()
      this.visible = true
      this.record = record
      console.log('1111:', record)
      this.qryFollowPlanByFollowTypeOut()
      this.getDetailData1()
    },

    getDetailData1() {
      mgrDoctorRehabilitationFollows({ doctorUserId: this.record.userId })
        .then((res) => {
          if (res.code == 0) {
            //区分新增和修改
            if (res.data && res.data.items.length > 0) {
              this.achievementRatio = res.data.achievementRatio

              if (!res.data.items || res.data.items.length == 0) {
                this.addTask()
                return
              }

              this.taskList = res.data.items
              if (this.taskList && this.taskList.length > 0) {
                this.taskList.forEach((item) => {
                  this.$set(item, 'expireValue', item.expireValue + '天')
                  this.$set(item, 'textCount', item.textCount || 0)
                  this.$set(item, 'isLimit', false)
                })
              }
            }
          } else {
            this.$message.error(res.message)
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    handleSubmit() {
      var itemsTemp = []

      let uploadData = {
        doctorUserId: this.record.userId,
        items: this.taskList,
      }

      this.confirmLoading = true
      mgrSaveDoctorRehabilitationFollows(uploadData)
        .then((res) => {
          this.confirmLoading = false
          if (res.code == 0) {
            this.$message.success('保存成功')
            this.visible = false
            this.$emit('ok')
            // this.$router.push({ path: './serviceWise?keyindex=1' })
          } else {
            this.$message.error(res.message)
          }
        })
        .finally((res) => {
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
/deep/.ant-select-selection {
  /deep/.ant-select-selection--single {
    width: 70px !important;
  }
}

/deep/.ant-input-number {
  min-height: 30px !important;
  font-size: 12px !important;
  line-height: 1.5;
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
.m-count-pxk {
  position: absolute;
  font-size: 12px;
  bottom: 2px;
  right: 18px;
}
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

  .div-part-left {
    width: 100%;
    overflow: hidden;
  }
  .div-part-right {
    float: right;
    width: 353px;
    overflow: hidden;
    height: 100%;
  }

  //  框
  .div-mission-content {
    border-radius: 6px;
    background: #ffffff;
    border: 1px solid #e6e6e6;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 90px;
    margin-bottom: 10px;

    .mission-top-add {
      font-size: 12px;
      display: flex;
      flex-direction: row;
      margin-top: 1%;
      align-items: center;

      .btn-top {
        margin-left: 1%;
        display: flex;
        background: #1890ff;
        border: #1890ff solid 1px;
        border-radius: 3px;
        padding: 5px 10px;
        flex-direction: row;
        align-items: center;
        &:hover {
          cursor: pointer;
        }
      }

      .btn-desc {
        margin-left: 1%;
        display: flex;
        flex-direction: column;
        .desc-content {
        }
      }
    }

    .mission-top {
      margin-top: 1%;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;

      .div-type {
        width: 6%;
        margin-left: 1%;
        background-color: #bbbbbb;
        color: #333;
        border-radius: 2px;
        display: inline-block;
        text-align: center;
        height: 27px;
        font-size: 12px;
        padding-top: 4px;

        &:hover {
          cursor: pointer;
        }
      }
      /deep/ .ant-time-picker-input {
        height: 28px !important;
      }

      .mid-select-one.ant-select {
        width: 10% !important;
        margin-left: 1% !important;
      }
      .mid-select-two.ant-select {
        width: 10% !important;
        margin-left: 1% !important;
      }

      .end-btn-stop {
        display: flex;
        flex-direction: row;
        align-items: center;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .div-divider {
      //   margin: 1% 0% 0% 1%;
      width: 98%;
      background-color: #e6e6e6;
      height: 1px;
    }

    .mission-bottom {
      margin-top: 1%;
      margin-bottom: 1%;
      width: 95%;
      display: flex;
      flex-direction: row;
      align-items: center;

      .end-btn {
        display: flex;
        flex-direction: row;
        align-items: center;

        &:hover {
          cursor: pointer;
        }
      }

      .end-btn-task {
        display: flex;
        flex-direction: row;
        align-items: center;

        .span-end {
          padding: 4px 15px;
          // background-color: yellow;
          // width: 100px;
          color: #1890ff;
          border: 1px solid #1890ff;
          // border: 2px solid #1890ff;
          // border: 2px solid #01AFF4;
          // border-radius: 8px;
          margin-left: 2%;

          &:hover {
            cursor: pointer;
          }
        }
      }

      .mission-bottom-left {
        width: 100%;
        display: flex;
        flex: 1;
        flex-direction: row;
        align-items: center;

        .mid-select-one.ant-select {
          width: 12% !important;
          margin-left: 1% !important;
        }
        .mid-select-two.ant-select {
          width: 120px !important;
          margin-left: 1% !important;
        }
      }
    }
  }

  // 框

  .div-content {
    margin-top: 5px;
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    margin-left: 10px;

    .small-content {
      display: flex;
      flex-direction: row;
      margin-left: 80%;
      width: 100%;
    }

    .span-item-name {
      display: inline-block;
      color: #4d4d4d;
      font-size: 12px;
      text-align: right;
      margin-right: 10px;
    }

    .span-item-value {
      //   flex: 1;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      width: 300px;
      display: inline-block;
    }

    .ant-calendar-picker {
      //   flex: 1;
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
                