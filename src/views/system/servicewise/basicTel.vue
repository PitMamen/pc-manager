<template>
  <!-- <div style="height: 500px; width: 100%"> -->
  <a-spin :spinning="isLoading">
    <div class="div-tel" v-if="recordIn" style="padding-right: 10px; padding-bottom: 10px">
      <div class="div-info" style="overflow-y: auto">
        <span style="font-size: 14px;font-weight: 500;color: #4D4D4D;">基本信息</span>
        <div class="divider-col" style="margin-top: 10px;"></div>
        <div class="div-line">
          <div class="div-4">
            <div style="width: 16%; display: inline-block"><span style="color: red">*</span> 姓名：</div>
            <a-input style="width: 67%" placeholder="请输入" />
          </div>
          <div class="div-4">
            <div style="width: 100%">身份证号：111225588852555</div>
            <!-- <span></span>
            <a-input style="width: 70%" placeholder="请输入" /> -->
          </div>
          <div class="div-4">
            <div style="width: 16%; display: inline-block"><span style="color: red">*</span> 年龄：</div>
            <a-input style="width: 67%" placeholder="请输入" />
          </div>
          <div class="div-4">
            <div style="width: 16%; display: inline-block"><span style="color: red">*</span> 性别：</div>
            <a-input style="width: 67%" placeholder="请输入" />
          </div>
        </div>
        <div class="div-line">
          <div class="div-4">
            <div style="width: 24%; display: inline-block"><span style="color: red">*</span> 联系电话：</div>
            <a-input style="width: 59%" placeholder="请输入" />
          </div>
          <div class="div-4">
            <div style="width: 25%; display: inline-block">紧急联系人：</div>
            <a-input style="width: 58%" placeholder="请输入" />
            <!-- <span></span>
            <a-input style="width: 70%" placeholder="请输入" /> -->
          </div>
          <div class="div-4">
            <div style="width: 30%; display: inline-block">紧急联系电话：</div>
            <a-input style="width: 53%" placeholder="请输入" />
          </div>
          <div class="div-4">
            <div style="width: 24%; display: inline-block"><span style="color: red">*</span> 科室管理：</div>
            <a-input style="width: 59%" placeholder="请输入" />
          </div>
        </div>
        <div class="div-line">
          <div class="div-4">
            <div style="width: 21%; display: inline-block; margin-left: 9px">账号信息：</div>
            <img src="~@/assets/icons/weixin.png" style="height: 15px; width: 20px; object-fit: cover" />
            <img src="~@/assets/icons/weixin2.png" style="height: 15px; width: 20px; object-fit: cover" />
          </div>
        </div>
      </div>

      <!--  -->

      <div class="nodata">
        <img src="~@/assets/icons/img_nodata.png" />
      </div>

      <div class="divider-col"></div>

      <div class="div-bo">
        <div style="float: right">
          <!-- <a-popconfirm placement="topRight" title="确认删除？" @confirm="goStopPlan">
            <div class="bo-btn">终止方案</div>
          </a-popconfirm> -->
          <div
            class="bo-btn"
            style="margin-left: 30px; color: #409eff; background-color: white; border: 1px solid #409eff"
          >
            确认修改
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>


<script>
import { getPatientInfo, updatePatientInfo } from '@/api/modular/system/posManage'
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
    }
  },

  created() {
    console.log('created basicTel', this.record)
    this.getPatientInfoOut()
  },

  methods: {
    getPatientInfoOut() {
      this.isLoading = true
      getPatientInfo({
        userId: this.recordIn.userId,
      }).then((res) => {
        this.isLoading = false
        if (res.code === 0) {
          this.dataList = res.data
        } else {
          this.$message.error(res.message)
          this.isLoading = false
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

    refreshData(recordIn) {
      this.recordIn = recordIn
    },
  },
}
</script>
<style lang="less" scoped>
.div-tel {
  font-size: 12px;
  height: 500px;
  display: flex;
  flex-direction: column;

  .div-info {
    width: 100%;
    border: 1px solid #dfe3e5;
    padding: 10px;
    display: flex;
    flex-direction: column;

    .div-line {
      width: 100%;
      display: flex;
      flex-direction: row;

      .div-4 {
        margin-top: 10px;
        width: 25%;
      }
    }
  }

  .nodata {
    margin-top: 10px;
    border: 1px solid #dfe3e5;
    padding: 10px;
    height: 253px;
    text-align: center;
    padding-top: 60px;
  }
  .divider-col {
    margin-top: 20px;
    width: 100%;
    height: 1px;
    // height: 100%;
    // margin-left: 2%;
    background-color: #dfe3e5;
  }
  .div-bo {
    margin-top: 20px;
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
</style>
