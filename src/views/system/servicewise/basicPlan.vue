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
            <a-popconfirm placement="topRight" title="确认删除？" @confirm="goStop(record)">
              <a style="margin-left: 5px">停止任务</a>
            </a-popconfirm>

            <!-- <a-icon type="arrow-down" /> -->
          </span>
        </a-table>
      </div>

      <!--  -->
      <div class="div-bo">
        <div style="float: right">
          <a-popconfirm placement="topRight" title="确认删除？" @confirm="goStopPlan">
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
      title="Title"
      width="1223px"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="div-service-user">
        <!-- 左边 -->
        <div class="div-totalleft" style="width: 75%">
          <div class="div-title" style="margin-top: -10px; margin-left: 10px; width: 95%">
            <div class="div-line-blue"></div>
            <span class="span-title">添加任务</span>
          </div>

          <div class="display-item" style="margin-left: 10px; margin-top: 10px">
            <span style="margin-top: 10px"> 随访方式:</span>
            <a-form-item style="width: 50%; margin-left: 10px; align-items: center">
              <a-select
                style="width: 322px"
                allow-clear
                v-model="queryParams.messageType"
                @select="onTypeSelect(queryParams.messageType)"
                placeholder="微信随访/短信随访"
              >
                <a-select-option v-for="(item, index) in visitTypeList" :key="index" :value="item.code">{{
                  item.value
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>

          <!--  -->
          <div class="display-item" style="margin-top: 10px; margin-left: 10px">
            <span style="margin-top: 10px"> 随访内容:</span>
            <a-form-item style="width: 50%; margin-left: 10px; align-items: center">
              <a-select style="width: 322px" allow-clear v-model="messageContentType" placeholder="微信随访模板">
                <a-select-option v-for="(item, index) in msgData" :key="index" :value="item.id">{{
                  item.templateTitle
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>

          <!--  -->
          <div class="display-item" style="margin-top: 10px; margin-left: 10px">
            <span style="margin-top: 10px; width: 80px"> 发送时间:</span>
            <a-radio-group
              name="radioGroup"
              style="margin-top: 10px; margin-left: -20px"
              @change="radioChange"
              v-decorator="['roleId', { rules: [{ required: true, message: '请选择发送时间！' }] }]"
            >
              <a-radio class="btn-add-plan" :value="1" style="font-size: 12px"> 立即发送 </a-radio>
              <a-radio :value="2" style="font-size: 12px"> 延时发送 </a-radio>
            </a-radio-group>
          </div>

          <div
            v-if="rangeValue == '2'"
            class="display-item;"
            style="margin-top: 2px; width: 100%; font-size: 12px; margin-left: 60px"
          >
            <!-- <a-form-item> -->
            <a-date-picker
              style="margin-top: 27px; margin-left: 10px; height: 28px; width: 150px"
              v-model="queryParams.executeTime"
              format="YYYY-MM-DD"
            />
            <!-- </a-form-item> -->

            <!-- <div class="display-item;" style="margin-top: 5px"> -->
            <a-time-picker
              style="margin-left: 10px; width: 150px; margin: 20px; height: 28px; font-size: 12px"
              @change="timeChangeStart"
              :default-value="moment('00:00', 'HH:mm')"
              format="HH:mm"
            />
            <!-- </div> -->
          </div>

          <div class="display-item" style="margin-top: 20px; margin-left: 7px">
            <a-button style="margin-left: 1%" type="primary" @click="commit()">任务执行</a-button>
            <a-button style="margin-left: 20px" type="default" @click="reset()">任务取消</a-button>
          </div>
        </div>

        <!-- 中间竖线 -->
        <div class="line-row"></div>

        <!-- ri -->
        <div class="card-right-user" style="overflow-y: auto; height: 400px">
          <div class="div-title" style="margin-top: 8px; margin-left: 10px; width: 96%">
            <div class="div-line-blue"></div>
            <span class="span-title">历史任务</span>
          </div>

          <div class="div-wrap-control" style="margin-top: 2%; overflow-y: auto; width: 100%">
            <div v-if="recordList && recordList.length > 0">
              <div
                class="div-part"
                :class="{ checked: item.isChecked }"
                style="margin-bottom: 10px"
                v-for="(item, index) in recordList"
                :value="item.templateTitle"
                :key="index"
              >
                <!-- <span class="span-name">
                    </span> -->
                <div class="div-rate" style="margin-left: 10px; font-size: 14px">
                  <!-- 1 电话  2微信  3短信 -->
                  <img
                    v-if="item.messageType.value == 1"
                    style="width: 11px; height: 11px"
                    src="~@/assets/icons/dh_icon.png"
                  />
                  <img
                    v-if="item.messageType.value == 2"
                    style="width: 12px; height: 10px"
                    src="~@/assets/icons/weixin_icon.png"
                  />
                  <img
                    v-if="item.messageType.value == 3"
                    style="width: 11px; height: 10px"
                    src="~@/assets/icons/dx_icon.png"
                  />

                  <!-- overflow: hidden; //溢出隐藏
        text-overflow: ellipsis; //超出省略号显示
        white-space: nowrap; //文字不换行 -->
                  <span
                    :class="getClassTime(item.overdueStatus.value)"
                    style="
                      width: 30px;
                      margin-left: 7px;
                      text-align: center;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      white-space: nowrap;
                    "
                  >
                    {{ item.executeTime }}
                  </span>

                  <span
                    style="
                      margin-bottom: -5px;
                      margin-left: 0px;
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
                      margin-left: 0px;
                      width: 55px;
                      text-align: end;
                      display: inline-block;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      white-space: nowrap;
                      margin-bottom: -8px;
                    "
                  >
                    {{ item.taskBizStatus.description }}
                  </span>
                </div>
                <!-- 分割线 -->
                <!-- <div class="div-divider"></div> -->
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
import { getFollowUserPlanPcList, stopFollowUserPlan, stopFollowUserPlanTask } from '@/api/modular/system/posManage'
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
      rangeValue: '1',
      queryParams: {
        execDoctorUserId: '',
        executeDepartmentId: '',
        userId: '',
        tenantId: '',
        messageType: undefined,
        messageContentType: undefined,
        messageContentId: '',
        hospitalCode: '',
        executeTime: '2022-11-01',
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
    }
  },

  created() {
    console.log('created basicPlan', this.record)
    this.getDataList()
  },

  methods: {
    /**
     * 立即发送  延时发送选择
     */
    radioChange(event) {
      //立即发送
      if (event.target.value == 1) {
        this.rangeValue = '1'
        //延时发送
      } else if (event.target.value == 2) {
        this.rangeValue = '2'
      }
    },

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
    display: flex;
    flex-direction: column;

    .div-janyan {
      height: 100%;
    }

    .div-shu {
      font-size: 12px;
      width: 12%;

      /deep/ .ant-timeline-item {
        padding: 0 0 8px 0 !important;
      }

      .div-line-content {
        font-size: 12px;

        .div-name {
          margin-left: 2%;
          margin-top: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        &:hover {
          cursor: pointer;
        }
      }

      .doubled {
        color: #1890ff;
      }
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

<style lang="less">
.no-data {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.line-row {
  width: 1px;
  height: 425px;
  background: #cccccc;
}

.span-red {
  padding: 1% 2%;
  font-size: 12px;
  color: #f26161;
  // background-color: #f26161;
}

.span-gray {
  padding: 1% 2%;
  font-size: 12px;
  color: #4d4d4d;
  // background-color: #85888e;
}

.span-green {
  padding: 1% 2%;
  font-size: 12px;
  color: #69c07d;
  // background-color: #85888e;
}

.table-page-wrapper {
  .ant-form-inline {
    .ant-form-item {
      display: flex;
      margin-bottom: 24px;
      margin-right: 0;

      .ant-form-item-control-wrapper {
        flex: 1 1;
        display: inline-block;
        vertical-align: middle;
      }

      > .ant-form-item-label {
        line-height: 32px;
        padding-right: 8px;
        width: auto;
      }
      .ant-form-item-control {
        height: 32px;
        line-height: 32px;
      }
    }
  }

  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }
}
</style>
<style lang="less">
.div-service-user {
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow: hidden;
  height: 510px;

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
    height: 100%;
    width: 50%;
    // margin-left: 10px;
    //   background-color: #f0f0f2;
    background-color: #ffffff;
    // border: 1px solid #e6e6e6;
    border-radius: 5px;
    padding: 20px 0;
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

  .div-totaltopleft {
    height: 40px;
    width: 100%;
    margin-right: 60px;
    margin-top: -20px;
    //   background-color: #f0f0f2;
    background-color: #ffffff;
    border: 1px solid #e6e6e6;
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
    height: 40px;
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
      width: 15%;
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
    margin-top: -20px;
  }

  .card-right-user {
    overflow: hidden;
    width: 85% !important;

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
