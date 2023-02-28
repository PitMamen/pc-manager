<template>
  <!-- <div style="height: 500px; width: 100%"> -->
  <div class="inner-wrap">
    <div class="div-yizhu" v-if="recordIn" style="padding-right: 10px; padding-bottom: 10px">
      <div class="div-info" style="overflow-y: auto">
        <span>所属随访方案：{{ recordIn.followPlanName }}</span>
        <span style="margin-left: 30px">执行科室：{{ recordIn.executeDepartmentName || '' }}</span>
      </div>
      <div class="div-janyan" style="overflow-y: auto; height: 370px; margin-top: 16px">
        <a-table
          ref="table"
          :pagination="false"
          style="margin-bottom: 10px"
          size="default"
          :scroll="{ x: true }"
          :loading="isLoading"
          :columns="columns"
          :data-source="dataList"
          :alert="true"
          :rowKey="(record) => record.code"
        >
          <span slot="action" slot-scope="text, record" v-if="record.status.value == 1 || record.status.value == 2">
            <a-popconfirm placement="topRight" title="确认是否终止该任务？" @confirm="goStop(record)">
              <a style="margin-left: 5px">停止任务</a>
            </a-popconfirm>

            <!-- <a-icon type="arrow-down" /> -->
          </span>
        </a-table>
      </div>

      <!--  -->
      <div class="div-bo">
        <div style="float: right">
          <a-popconfirm placement="topRight" title="确认是否终止该方案？" @confirm="goStopPlan">
            <div class="bo-btn">终止方案</div>
          </a-popconfirm>
          <div
            @click="goAdd"
            class="bo-btn"
            style="margin-left: 30px; color: #409eff; background-color: white; border: 1px solid #409eff"
          >
            新增任务
          </div>
        </div>
      </div>
    </div>

    <a-modal
      :title="title"
      width="1223px"
      :visible="visible"
      :footer="null"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="div-add-task">
        <!-- 左边 -->
        <div class="div-task-left">
          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">添加任务</span>
          </div>

          <div class="display-item">
            <span class="item-name"> 随访方式：</span>

            <a-select
              style="width: 322px"
              allow-clear
              v-model="queryParams.messageType"
              @select="onTypeSelect"
              placeholder="微信随访/短信随访"
            >
              <a-select-option v-for="(item, index) in visitTypeList" :key="index" :value="item.value">{{
                item.description
              }}</a-select-option>
            </a-select>
          </div>

          <!--  -->
          <div class="display-item">
            <span class="item-name"> 随访内容：</span>

            <a-select
              style="width: 322px"
              allow-clear
              v-model="queryParams.messageContentId"
              @select="onContentSelect"
              placeholder="随访内容"
            >
              <a-select-option v-for="(item, index) in msgData" :key="index" :value="item.id">{{
                item.templateTitle
              }}</a-select-option>
            </a-select>
          </div>

          <!--  -->
          <div class="display-item" style="margin-top: 18px">
            <span class="item-name"> 执行时间：</span>
            <!-- <a-radio-group name="radioGroup" v-model="queryParams.executeType" style="margin-top: 10px; margin-left: -20px" @change="radioChange"> -->
            <a-radio-group name="radioGroup" v-model="queryParams.executeType" defaultValue="1">
              <a-radio class="btn-add-plan" value="1" style="font-size: 12px"> 立即执行 </a-radio>
              <a-radio value="2" style="font-size: 12px"> 定时执行 </a-radio>
            </a-radio-group>
          </div>

          <div v-if="queryParams.executeType == '2'" class="display-item" style="margin-left: 73px; margin-top: 18px">
            <!-- <a-form-item> -->
            <a-date-picker style="height: 28px; width: 150px" v-model="queryParams.executeTime" format="YYYY-MM-DD" />
            <!-- </a-form-item> -->

            <!-- <div class="display-item;" style="margin-top: 5px"> -->
            <a-time-picker
              style="margin-left: 10px; width: 150px; height: 28px; font-size: 12px"
              @change="timeChangeStart"
              :default-value="moment('00:00', 'HH:mm')"
              format="HH:mm"
            />
            <!-- </div> -->
          </div>

          <div class="display-item" v-if="queryParams.messageType == 1" style="margin-top: 18px">
            <span class="item-name"> 任务执行人：</span>
            <!-- <a-radio-group name="radioGroup" v-model="queryParams.executeType" style="margin-top: 10px; margin-left: -20px" @change="radioChange"> -->

            <a-select
              style="width: 120px"
              disabled
              v-model="chosePerson"
              @select="onTypeSelect"
              placeholder="微信随访/短信随访"
            >
              <a-select-option v-for="(item, index) in userList" :key="index" :value="item.userId">{{
                item.userName
              }}</a-select-option>
            </a-select>
          </div>

          <div class="display-item" style="margin-top: 20px">
            <a-button style="margin-left: 1%" type="primary" @click="commit()">任务执行</a-button>
            <!-- <a-button style="margin-left: 20px" type="default" @click="reset()">任务取消</a-button> -->
          </div>
        </div>

        <!-- 中间竖线 -->
        <div class="line-row"></div>

        <!-- ri -->
        <div class="div-task-right" style="overflow-y: auto; height: 550px">
          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">历史任务</span>
          </div>

          <div class="div-wrap-list">
            <div v-if="recordList && recordList.length > 0">
              <div
                class="div-part"
                :class="{ checked: item.isChecked }"
                v-for="(item, index) in recordList"
                :value="item.templateTitle"
                :key="index"
              >
                <!-- 1 电话  2微信  3短信 -->
                <img
                  v-if="item.messageType.value == 1"
                  style="width: 14px; height: 11px"
                  src="~@/assets/icons/dh_icon.png"
                />
                <img
                  v-if="item.messageType.value == 2"
                  style="width: 14px; height: 11px"
                  src="~@/assets/icons/weixin_icon.png"
                />
                <img
                  v-if="item.messageType.value == 3"
                  style="width: 14px; height: 11px"
                  src="~@/assets/icons/dx_icon.png"
                />

                <!-- :class="getClassTime(item.overdueStatus.value)" -->
                <span
                  style="
                    width: 133px;
                    margin-left: 20px;
                    text-align: left;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                  "
                >
                  {{ item.executeTime }}
                </span>

                <span
                  style="
                    text-align: center;
                    width: 200px;
                    display: inline-block;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                  "
                >
                  {{ item.templateTitle }}
                </span>

                <span
                  :class="getClass(item.taskBizStatus.value)"
                  style="
                    text-align: center;
                    display: inline-block;
                    margin-left: 20px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                  "
                >
                  {{ item.taskBizStatus.description }}
                </span>
              </div>
            </div>
            <div v-else class="no-data">
              <img src="~@/assets/icons/no_data.jpg" style="margin-left: 5px" />
              <span style="color: #bfbfbf; margin-top: 10px">暂无数据</span>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>


<script>
import {
  getFollowUserPlanPcList,
  stopFollowUserPlan,
  stopFollowUserPlanTask,

  //新增任务相关接口
  addExecuteRecordTempTask,
  messageTypes,
  getAllQuestions,
  getWxTemplateListForJumpType,
  getSmsTemplateListForJumpType,
  qryExecuteRecordByUserId,
} from '@/api/modular/system/posManage'
import Vue from 'vue'
import { TRUE_USER } from '@/store/mutation-types'
import { formatDate, formatDateFull } from '@/utils/util'
import moment from 'moment'
import { parseString } from 'loader-utils'
export default {
  components: {},
  props: {
    record: Object,
  },
  data() {
    return {
      recordIn: this.record,
      dataList: [],
      isLoading: false,
      confirmLoading: false,
      visible: false,
      messageContentType: undefined,
      recordList: [],
      visitTypeList: [],
      msgData: [],
      templateListWX: [],
      templateListSMS: [],
      templateListQues: [],
      rangeValue: '2',
      chosePerson: 0,
      title: '',
      userList: [],
      timeStr: '00:00',
      queryParams: {
        execDoctorUserId: '',
        planId: '',
        userId: '',

        executeTime: moment(new Date()),
        executeType: '1',
        messageContentId: undefined,
        messageContentType: undefined,
        messageType: undefined,
      },

      columns: [
        {
          title: '序号',
          // innerHeight:20,
          dataIndex: 'xh',
        },
        {
          title: '任务类型',
          dataIndex: 'taskTypeName',
          ellipsis: true,
        },
        {
          title: '计划执行时间',
          dataIndex: 'latestExecDate',
          ellipsis: true,
        },
        {
          title: '随访方式',
          // innerHeight:20,
          dataIndex: 'messageTypeName',
        },
        {
          title: '所属科室',
          dataIndex: 'departmentName',
          ellipsis: true,
        },
        {
          title: '随访类型',
          dataIndex: 'taskExecTypeName',
          ellipsis: true,
        },
        {
          title: '随访内容',
          dataIndex: 'followContent',
          ellipsis: true,
        },
        {
          title: '状态',
          dataIndex: 'statusName',
          ellipsis: true,
        },
        {
          title: '操作',
          // width: '100px',
          fixed: 'right',
          // dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      queryParamsRecord: {
        userId: '',
      },
    }
  },

  created() {
    console.log('created basicPlan', this.record)
    // this.recordIn = this.record
    let user = Vue.ls.get(TRUE_USER)
    this.userList.push({ userId: user.userId, userName: user.userName })
    this.queryParamsRecord.userId = this.recordIn.userId
    this.chosePerson = user.userId
    this.queryParams.execDoctorUserId = user.userId
    this.recordIn.sex = this.recordIn.sex ? this.recordIn.sex.description : ''
    this.title =
      this.recordIn.userName + '\xa0' + '\xa0' + ' |   ' + this.recordIn.sex + '    |  ' + '\xa0' + this.recordIn.age
    this.queryParams.planId = this.recordIn.planId
    this.queryParams.userId = this.recordIn.userId
    this.qryExecuteRecordByUserIdOut()

    let param = {
      pageNo: 1,
      pageSize: 10000,
      typeName: '', //获取全量问卷，不根据科室获取
      // typeName: chooseDept.departmentName,
      // typeName: this.projectData.basePlan.executeDepartment,
    }
    messageTypes().then((res) => {
      if (res.code == 0) {
        this.visitTypeList = res.data
      }
    })

    getAllQuestions(param).then((res) => {
      if (res.code == 0) {
        res.data.list.forEach((item) => {
          this.$set(item, 'templateTitle', item.name)
          //问卷新增字段 1:问卷2:文章3:短信模板4:微信模板
          this.$set(item, 'messageContentType', 1)
        })
        this.templateListQues = res.data.list
      } else {
        // return {}
      }
    })

    //全部的微信模板
    getWxTemplateListForJumpType(0).then((res) => {
      if (res.code == 0) {
        res.data.forEach((item) => {
          this.$set(item, 'messageContentType', 4)
        })
        this.templateListWX = res.data
      }
    })

    //全部的短信模板
    getSmsTemplateListForJumpType(0).then((res) => {
      if (res.code == 0) {
        res.data.forEach((item) => {
          this.$set(item, 'messageContentType', 3)
          this.$set(item, 'templateName', item.templateTitle)
        })
        this.templateListSMS = res.data
      }
    })

    this.getDataList()
  },

  methods: {
    moment,
    // /**
    //  * 立即执行  延时执行
    //  */
    // radioChange(event) {
    //   //立即执行
    //   if (event.target.value == 1) {
    //     this.rangeValue = '1'
    //     //延时执行
    //   } else if (event.target.value == 2) {
    //     this.rangeValue = '2'
    //   }
    // },

    getDataList() {
      this.isLoading = true
      getFollowUserPlanPcList({
        pageNo: 1,
        pageSize: 999,
        userId: this.recordIn.userId,
        planId: this.recordIn.planId,
      }).then((res) => {
        this.isLoading = false
        if (res.code === 0) {
          this.dataList = res.data.records
          this.dataList.forEach((item, index) => {
            this.$set(item, 'xh', index + 1)
            this.$set(item, 'taskTypeName', item.taskType.description)
            this.$set(item, 'messageTypeName', item.messageType.description)
            this.$set(item, 'taskExecTypeName', item.taskExecType.description)
            // 状态1:未执行2长期任务执行中3:完成4:取消5:终止
            // statusName= item.status.value==1?'未执行':(item.status.value==2?'长期任务执行中':(item.status.value==3?'完成':(item.status.value==4?'取消':'终止')))

            this.$set(
              item,
              'statusName',
              item.status.value == 1
                ? '未执行'
                : item.status.value == 2
                ? '长期任务执行中'
                : item.status.value == 3
                ? '完成'
                : item.status.value == 4
                ? '取消'
                : '终止'
            )
          })
        } else {
          this.$message.error(res.message)
          this.isLoading = false
        }
      })
    },

    goAdd() {
      this.visible = true
      this.queryParams = {
        execDoctorUserId: Vue.ls.get(TRUE_USER).userId,
        planId: this.recordIn.planId,
        userId: this.recordIn.userId,

        executeTime: moment(new Date()),
        executeType: '1',
        messageType: undefined,
        messageContentId: undefined,
        messageContentType: undefined,
      }
      this.qryExecuteRecordByUserIdOut()
    },
    handleOk() {
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    },

    goStop(record) {
      stopFollowUserPlanTask(record.id)
        .then((res) => {
          if (res.success) {
            this.$message.success('操作成功')
            // this.$refs.table.refresh()
            this.getDataList()
          } else {
            this.$message.error('操作失败：' + res.message)
          }
        })
        .catch((err) => {
          this.$message.error('操作错误：' + err.message)
        })
    },

    goStopPlan() {
      stopFollowUserPlan({ planId: this.recordIn.planId, userId: this.recordIn.userId })
        .then((res) => {
          if (res.success) {
            this.$message.success('操作成功')
            // this.$refs.table.refresh()
            this.getDataList()
          } else {
            this.$message.error('操作失败：' + res.message)
          }
        })
        .catch((err) => {
          this.$message.error('操作错误：' + err.message)
        })
    },

    refreshData(recordIn) {
      this.recordIn = recordIn
    },

    /**
     *
     * @param {随访方式选择}
     *
     */
    onTypeSelect() {
      // if (this.queryParams.messageType == 1) {
      //   //电话消息不需要时间
      // } else if (messageType == 2 || messageType == 3) {
      //   //微信短信消息需要时间
      //   let date = formatDate(new Date()) + ' 08:00:00'
      //   console.log('date', date)
      //   let mom = moment(date, 'YYYY-MM-DD HH:mm:ss')
      //   console.log('mom', mom)
      // }

      if (this.queryParams.messageType == 1) {
        this.msgData = JSON.parse(JSON.stringify(this.templateListQues))
      } else if (this.queryParams.messageType == 2) {
        //查所有微信模版
        this.msgData = JSON.parse(JSON.stringify(this.templateListWX))
      } else if (this.queryParams.messageType == 3) {
        //查所有短信模版
        this.msgData = JSON.parse(JSON.stringify(this.templateListSMS))
      }
    },

    onContentSelect() {
      let hasOne = this.msgData.find((item) => item.id == this.queryParams.messageContentId)
      this.queryParams.messageContentType = hasOne.messageContentType
    },

    /**
     * 查询历史随访记录
     */
    qryExecuteRecordByUserIdOut() {
      qryExecuteRecordByUserId(this.queryParamsRecord)
        .then((res) => {
          if (res.code == 0) {
            this.recordList = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    getClass(status) {
      console.log('VVV:', status)
      if (status == 1) {
        return 'span-gray'
      } else if (status == 2) {
        return 'span-green'
      } else if (status == 3) {
        return 'span-red'
      }
    },

    // getClassTime(status) {
    //   if (status == 2) {
    //     return 'span-red'
    //   } else {
    //     return 'span-gray'
    //   }
    // },

    commit() {
      if (!this.queryParams.messageType) {
        this.$message.error('请选择随访方式')
        return
      }

      if (!this.queryParams.messageContentId) {
        this.$message.error('请选择随访内容')
        return
      }

      if (this.queryParams.executeType == '1') {
        //立即执行的
        let currentTime = formatDateFull(new Date().getTime())
        this.queryParams.executeTime = currentTime
      } else {
        //延时执行的
        debugger
        // console.log("延时发送时间：",this.timeStr)
        if (!this.timeStr) {
          this.timeStr = '00:00'
        }
        let dateStr = this.queryParams.executeTime.format('YYYY-MM-DD') + ' ' + this.timeStr + ':00'
        this.queryParams.executeTime = dateStr
      }
      if (this.queryParams.executeTime.includes('Invalid date')) {
        this.$message.error('请选择发送时间')
        return
      }

      console.log('选择的时间：', this.queryParams)
      this.addExecuteRecordOut()
    },

    timeChangeStart(moment, time) {
      console.log('00000:', time)
      this.timeStr = time
    },

    /**
     * 新增随访记录
     */
    addExecuteRecordOut() {
      this.confirmLoading = true
      let param = JSON.parse(JSON.stringify(this.queryParams))
      param.messageType = parseInt(param.messageType)
      param.executeType = parseInt(param.executeType)
      param.messageContentId = parseString(param.messageContentId)
      console.log('param', JSON.stringify(param))
      // addExecuteRecordTempTask({ addTempTaskReq: param })
      addExecuteRecordTempTask(param)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('新增成功!')
            this.visible = false
            this.getDataList()
            // this.handleCancel()
            this.qryExecuteRecordByUserIdOut()
          } else {
            this.$message.error('新增失败!')
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },
  },
}
</script>
<style lang="less" scoped>
.inner-wrap {
  font-size: 12px;
  height: 500px;
  font-size: 12px;
  // padding: 10px;
  // width: 99%;

  .div-yizhu {
    height: 500px;
    display: flex;
    flex-direction: column;

    .div-janyan {
      flex: 1;
      // height: 100%;
    }
    .div-bo {
      .bo-btn {
        padding: 5px 15px;
        color: white;
        background-color: #fb2929;
        border: 1px solid #fb2929;
        display: inline-block;
        border-radius: 3px;
        font-size: 12px;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  // div-yizhu 同级
}
</style>

<style lang="less" scoped>
.div-add-task {
  display: flex;
  height: 552px;
  flex-direction: row;
  font-size: 12px;
  width: 100%;

  .div-task-left {
    margin-top: 10px;
    width: 48%;

    .div-title {
      display: flex;
      background-color: #f7f7f7;
      flex-direction: row;
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: row;
      height: 26px;

      .div-line-blue {
        width: 5px;
        height: 100%;
        background-color: #409eff;
      }
      .span-title {
        font-size: 14px;
        margin-left: 10px;
        font-weight: bold;
        color: #4d4d4d;
      }
    }

    .display-item {
      display: flex;
      margin-top: 10px;
      flex-direction: row;
      align-items: center;
      width: 100%;
      // margin-top: -20px;
      .item-name {
        color: #4d4d4d;
        text-align: right;
        width: 73px;

        font-weight: 400;
      }
    }
  }

  .line-row {
    width: 1px;
    margin-left: 27px;
    height: 558px;
    background: #cccccc;
  }

  .div-task-right {
    margin-top: 10px;
    margin-left: 27px;
    width: 48%;
    .div-title {
      display: flex;
      background-color: #f7f7f7;
      flex-direction: row;
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: row;
      height: 26px;

      .div-line-blue {
        width: 5px;
        height: 100%;
        background-color: #409eff;
      }
      .span-title {
        font-size: 14px;
        margin-left: 10px;
        font-weight: bold;
        color: #4d4d4d;
      }
    }

    .div-wrap-list {
      overflow-y: auto;
      width: 100%;
      margin-top: 10px;

      .div-part {
        margin-bottom: 10px;
        align-items: center;
        display: flex;
        flex-direction: row;
        // background-color: #409eff;

        .span-gray {
          padding: 2px 6px;
          width: 62px;
          display: inline-block;
          font-size: 12px;
          color: #4d4d4d;
          border: 1px solid #cccccc;
          border-radius: 3px;
          background-color: #f2f2f2;
        }
        .span-green {
          padding: 2px 6px;
          width: 62px;
          display: inline-block;
          font-size: 12px;
          color: #69c07d;
          border: 1px solid #69c07d;
          border-radius: 3px;
          background-color: #ecfff0;
        }

        .span-red {
          padding: 2px 6px;
          width: 62px;
          display: inline-block;
          font-size: 12px;
          color: #e95454;
          border: 1px solid #e95454;
          border-radius: 3px;
          background-color: #fff2f1;
        }
      }
    }
  }
}
</style>