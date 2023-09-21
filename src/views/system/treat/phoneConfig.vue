<template>
  <a-modal
    :title="titleTab"
    :visible="visible"
    :width="818"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-part">
        <div class="div-part-left">
          <div class="div-content">
            <span style="color: #4d4d4d">张医生|男|42岁|中南大学茅坑</span>

            <div style="flex-wrap: wrap; margin-left: 63%; display: flex; flex-direction: row">
              <div style="color: #4d4d4d; margin-top: 5px">分成</div>
              <a-input-number
                style="display: inline-block; width: 70px; margin-left: 10px"
                v-model="price"
                :min="0"
                :max="100"
                :maxLength="30"
                allow-clear
              />
              <div style="margin-top: 5px; margin-left: 5px">%</div>
            </div>
          </div>

          <div class="top-con">
            <div class="itemday-content">
              <span>周一</span>
              <a-switch style="margin-left: 5px" size="default" :checked="true" />
            </div>

            <div class="itemday-content">
              <span>周二</span>
              <a-switch style="margin-left: 5px" size="default" :checked="true" />
            </div>

            <div class="itemday-content">
              <span>周三</span>
              <a-switch style="margin-left: 5px" size="default" :checked="true" />
            </div>

            <div class="itemday-content">
              <span>周四</span>
              <a-switch style="margin-left: 5px" size="default" :checked="true" />
            </div>

            <div class="itemday-content">
              <span>周五</span>
              <a-switch style="margin-left: 5px" size="default" :checked="true" />
            </div>

            <div class="itemday-content">
              <span>周六</span>
              <a-switch style="margin-left: 5px" size="default" :checked="true" />
            </div>

            <div class="itemday-content">
              <span>周日</span>
              <a-switch style="margin-left: 5px" size="default" :checked="true" />
            </div>
          </div>

          <div class="bottomtime-content">
            <!-- 周一接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                @change="(time, timestring) => timeChangeStart(time, timestring, 1)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>结束时间</div>
              <a-time-picker
                @change="(time, timestring) => timeChangeEnd(time, timestring, 1)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>接诊人数</div>
              <a-input :maxLength="20" class="span-item-value" style="display: inline-block; width: 95px" allow-clear />
            </div>

            <div class="line-devier"></div>

            <!-- 周二接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                @change="(time, timestring) => timeChangeStart(time, timestring, 2)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>结束时间</div>
              <a-time-picker
                @change="(time, timestring) => timeChangeEnd(time, timestring, 2)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>接诊人数</div>
              <a-input :maxLength="20" class="span-item-value" style="display: inline-block; width: 95px" allow-clear />
            </div>

            <div class="line-devier"></div>

            <!-- 周三接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                @change="(time, timestring) => timeChangeStart(time, timestring, 3)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>结束时间</div>
              <a-time-picker
                @change="(time, timestring) => timeChangeEnd(time, timestring, 3)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>接诊人数</div>
              <a-input :maxLength="20" class="span-item-value" style="display: inline-block; width: 95px" allow-clear />
            </div>

            <div class="line-devier"></div>

            <!-- 周四接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                @change="(time, timestring) => timeChangeStart(time, timestring, 4)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>结束时间</div>
              <a-time-picker
                @change="(time, timestring) => timeChangeEnd(time, timestring, 4)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>接诊人数</div>
              <a-input :maxLength="20" class="span-item-value" style="display: inline-block; width: 95px" allow-clear />
            </div>

            <div class="line-devier"></div>

            <!-- 周五接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                @change="(time, timestring) => timeChangeStart(time, timestring, 5)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>结束时间</div>
              <a-time-picker
                @change="(time, timestring) => timeChangeEnd(time, timestring, 5)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>接诊人数</div>
              <a-input :maxLength="20" class="span-item-value" style="display: inline-block; width: 95px" allow-clear />
            </div>

            <div class="line-devier"></div>

            <!-- 周六接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                @change="(time, timestring) => timeChangeStart(time, timestring, 6)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>结束时间</div>
              <a-time-picker
                @change="(time, timestring) => timeChangeEnd(time, timestring, 6)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>接诊人数</div>
              <a-input :maxLength="20" class="span-item-value" style="display: inline-block; width: 95px" allow-clear />
            </div>

            <div class="line-devier"></div>

            <!-- 周日接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                @change="(time, timestring) => timeChangeStart(time, timestring, 7)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>结束时间</div>
              <a-time-picker
                @change="(time, timestring) => timeChangeEnd(time, timestring, 7)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>接诊人数</div>
              <a-input :maxLength="20" class="span-item-value" style="display: inline-block; width: 95px" allow-clear />
            </div>
          </div>

          <div
            class="div-mission-content"
            style="margin-top: 10px"
            v-for="(item, index) in taskList"
            :key="index"
            :value="item"
          >
            <div class="mission-top-add">
              <div class="div-content">
                <span class="span-item-name">单价 </span>
                <a-input-number
                  style="display: inline-block; width: 70px"
                  v-model="item.price"
                  :min="0"
                  :max="10000"
                  :maxLength="30"
                  allow-clear
                />
                <div style="margin-left: 5px; color: #4d4d4d">元</div>

                <a-checkbox style="margin-left: 20px" @click="limitEnable(item)" :checked="item.isLimit" />
                <span class="span-item-name" style="margin-left: 10px">限制条数</span>
                <a-input
                  :maxLength="20"
                  class="span-item-value"
                  v-model="item.limit"
                  style="display: inline-block; width: 60px"
                  allow-clear
                />

                <a-checkbox style="margin-left: 20px" @click="limitService(item)" :checked="item.isSerTime" />
                <span class="span-item-name" style="margin-left: 10px">服务时效</span>
                <a-input
                  :maxLength="20"
                  class="span-item-value"
                  v-model="item.timeliness"
                  style="display: inline-block; width: 60px"
                  allow-clear
                />

                <a-select v-model="item.unit" style="width: 70px; margin-left: 10px" allow-clear placeholder="单位">
                  <a-select-option v-for="(item, index) in timeUnitTypesData" :key="index" :value="item.code">{{
                    item.value
                  }}</a-select-option>
                </a-select>

                <a-button style="margin-left: auto; margin-right: 10px" type="primary" ghost @click="deleteTask(index)"
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

            <!-- <div class="div-divider">
                <div class="div-content">
                  <div class="small-content">
                    <a-button :style="{ 'margin-right': '10px' }" type="primary" ghost @click="deleteTask(index)"
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
              </div> -->
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
                
                
                <script>
import { updateExpressInfo } from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { isObjectEmpty, isStringEmpty, isArrayEmpty, formatDate } from '@/utils/util'
import Vue from 'vue'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      visible: false,
      titleTab: '复诊续方配置',
      islimitTip: true,
      isSertimelimit: true,
      record: {},
      headers: {},
      price: 60,
      confirmLoading: false,
      checkData: {
        expressDate: formatDate(new Date()),
        expressName: '',
        expressNo: '',
        orderId: 0,
      },

      taskList: [
        {
          price: 20,
          isLimit: false,
          limit: 20,
          isSerTime: false,
          timeliness: 24,
          unit: 1,
        },
      ],

      timeUnitTypesData: [
        {
          code: 1,
          value: '小时',
        },
        {
          code: 2,
          value: '天',
        },
      ],
      lableTypeListData: [],
    }
  },
  created() {},
  methods: {
    moment,
    clearData() {
      this.taskList = [
        {
          price: 20,
          isLimit: false,
          limit: 20,
          isSerTime: false,
          timeliness: 24,
          unit: 1,
        },
      ]
    },

    timeChangeStart(moment, starttimestring, type) {
      // 周一开始时间
      console.log('ssss:', type, starttimestring)
      if (type == 1) {
        //周二开始时间
      } else if (type == 2) {
        //周三开始时间
      } else if (type == 3) {
        //周四开始时间
      } else if (type == 4) {
        //周五开始时间
      } else if (type == 5) {
        //周六开始时间
      } else if (type == 6) {
        //周日开始时间
      } else if (type == 7) {
      }
    },

    timeChangeEnd(moment, endtimestring, type) {
      console.log('BBBBB:', endtimestring, type)
      // 周一结束时间
      if (type == 1) {
        //周二结束时间
      } else if (type == 2) {
        //周三结束时间
      } else if (type == 3) {
        //周四结束时间
      } else if (type == 4) {
        //周五结束时间
      } else if (type == 5) {
        //周六结束时间
      } else if (type == 6) {
        //周日结束时间
      } else if (type == 7) {
      }
    },

    addTask() {
      if (this.taskList.length >= 5) {
        this.$message.error('最多5条')
        return
      }

      this.taskList.push({
        price: 20,
        isLimit: false,
        limit: 20,
        isSerTime: false,
        timeliness: 24,
        unit: 1,
      })
    },

    deleteTask(index) {
      if (this.taskList.length == 1) {
        this.$message.error('至少配置一项!')
        return
      }
      this.taskList.splice(index, 1)
    },

    limitEnable(item) {
      item.isLimit = !item.isLimit
      console.log('Dddddddd:', item.isLimit)
    },

    limitService(item) {
      item.isSerTime = !item.isSerTime
      console.log('11111111111:', item.isSerTime)
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

    // 配送
    editmodal(type) {
      this.clearData()
      this.visible = true
      this.titleTab = type == 1 ? '电话咨询配置' : '视频咨询配置'
      console.log('4434444444')
      // this.confirmLoading = false
      // this.checkData.orderId = orderId
      // this.getUserTagsTypeListOut()
    },

    onDatePickerChange(date, dateString) {
      console.log(date, dateString)
      this.checkData.expressDate = dateString
    },

    handleSubmit() {
      console.log(this.checkData)
      if (isStringEmpty(this.checkData.expressDate)) {
        this.$message.error('请选择发货日期')
        return
      }
      if (isStringEmpty(this.checkData.expressNo)) {
        this.$message.error('请输入物流单号')
        return
      }

      if (isStringEmpty(this.checkData.expressName)) {
        this.$message.error('请输入物流公司名称')
        return
      }

      this.updateExpressInfoOut()
    },

    //修改类别
    updateExpressInfoOut() {
      this.confirmLoading = true
      updateExpressInfo(this.checkData).then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功！')
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

  .top-con {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 40px;
    background: #f5f5f5;
  }

  .itemday-content {
    width: 14.2%;
    display: flex;
    margin-left: 21px;
    flex-direction: row;
    align-items: center;
  }

  .bottomtime-content {
    width: 781px;
    height: 162px;
    background: rgba(245, 245, 245, 0);
    border: 1px solid #e6e6e6;
    display: flex;
    flex-direction: row;
  }

  .itemtime-content {
    width: 111px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .line-devier {
    height: 100%;
    width: 1px;
    background: #e6e6e6;
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
      margin-left: 73%;
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
                