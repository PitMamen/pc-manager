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
            class="bo-btn"
            style="margin-left: 30px; color: #409eff; background-color: white; border: 1px solid #409eff"
          >
            新增任务
          </div>
        </div>
      </div>
    </div>

    <div v-else class="nodata">
      <img src="~@/assets/icons/img_nodata.png" />
    </div>
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
    getDataList() {
      getFollowUserPlanPcList({
        pageNo: 1,
        pageSize: 999,
        userId: this.recordIn.userId,
        planId: this.recordIn.planId,
      }).then((res) => {
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
        }
      })
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

    onItemClick(itemOut, indexOut) {
      for (let index = 0; index < this.insideJbxx.yzxx.length; index++) {
        this.insideJbxx.yzxx[index].color = 'gray'
        if (indexOut == index) {
          this.insideJbxx.yzxx[index].color = 'blue'
        }
      }
      this.insideShowDataYizhu = this.insideJbxx.yzxx[indexOut]
      console.log('this.insideShowDataYizhu', this.insideShowDataYizhu)
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

  .nodata {
    height: 90%;
    width: 99%;
    text-align: center;
    padding-top: 150px;
  }
}
</style>
