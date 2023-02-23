<template>
  <!-- <div style="height: 500px; width: 100%"> -->
  <a-spin :spinning="isLoading">
    <div class="div-tel" v-if="recordIn" style="padding-right: 10px; padding-bottom: 10px">
      <div class="div-info" style="overflow-y: auto">
        <span style="font-size: 14px; font-weight: 500; color: #4d4d4d">基本信息</span>
        <div class="divider-col" style="margin-top: 10px"></div>
        <div class="div-line">
          <div class="div-4">
            <div style="width: 16%; display: inline-block"><span style="color: red">*</span> 姓名：</div>
            <a-input v-model="baseData.userName" style="width: 67%" placeholder="请输入" />
          </div>
          <div class="div-4">
            <div style="width: 100%">身份证号：{{ baseData.idNumber }}</div>
            <!-- <span></span>
            <a-input style="width: 70%" placeholder="请输入" /> -->
          </div>
          <div class="div-4">
            <div style="width: 16%; display: inline-block"><span style="color: red">*</span> 年龄：</div>
            <a-input type="number" v-model="baseData.age" style="width: 67%" placeholder="请输入" />
          </div>
          <div class="div-4">
            <div style="width: 16%; display: inline-block"><span style="color: red">*</span> 性别：</div>
            <a-input v-model="baseData.sex" style="width: 70%" placeholder="请输入" />
          </div>
        </div>
        <div class="div-line">
          <div class="div-4">
            <div style="width: 25%; display: inline-block"><span style="color: red">*</span> 联系电话：</div>
            <a-input type="number" v-model="baseData.tel" style="width: 58%" placeholder="请输入" />
          </div>
          <div class="div-4">
            <div style="width: 26%; display: inline-block">紧急联系人：</div>
            <a-input v-model="baseData.urgentContacts" style="width: 57%" placeholder="请输入" />
            <!-- <span></span>
            <a-input style="width: 70%" placeholder="请输入" /> -->
          </div>
          <div class="div-4">
            <div style="width: 30%; display: inline-block">紧急联系电话：</div>
            <a-input type="number" v-model="baseData.urgentTel" style="width: 53%" placeholder="请输入" />
          </div>
          <div class="div-4">
            <div style="width: 25%; display: inline-block"><span style="color: red">*</span> 科室管理：</div>
            <!-- <a-input style="width: 59%" placeholder="请输入" /> -->
            <!-- 折叠展示 -->
            <a-select
              style="width: 61%; height: 30px"
              v-model="baseData.deptInfo"
              mode="multiple"
              :token-separators="[',']"
              allow-clear
              :maxTagCount="1"
              :collapse-tags="true"
              placeholder="请选择执行科室"
            >
              <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.departmentId">{{
                item.departmentName
              }}</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="div-line">
          <div class="div-4">
            <div style="width: 24%; display: inline-block; margin-left: 9px">账号信息：</div>
            <img
              src="~@/assets/icons/weixin.png"
              v-if="baseData.openidFlag == 1"
              style="height: 15px; width: 20px; object-fit: cover"
            />
            <img v-else src="~@/assets/icons/weixin2.png" style="height: 15px; width: 20px; object-fit: cover" />
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
            @click="goSave"
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
import { getPatientInfo, updatePatientInfo, getDepts } from '@/api/modular/system/posManage'
export default {
  components: {},
  props: {
    record: Object,
  },
  data() {
    return {
      recordIn: this.record,
      baseData: {},
      dataList: [],
      keshiData: [],
      isLoading: false,
    }
  },

  created() {
    console.log('created basicTel', this.record)

    getDepts().then((res) => {
      if (res.code == 0) {
        this.keshiData = res.data
        this.getPatientInfoOut()
      }
    })
  },

  methods: {
    getPatientInfoOut() {
      this.isLoading = true
      getPatientInfo({
        userId: this.recordIn.userId,
      }).then((res) => {
        this.isLoading = false
        if (res.code === 0) {
          this.baseData = res.data

          this.baseData.deptInfo = this.baseData.deptInfo ? this.baseData.deptInfo : []
          let newArr = []
          this.baseData.deptInfo.forEach((element) => {
            newArr.push(parseInt(element))
          })
          this.baseData.deptInfo = newArr
          console.log('fff', this.baseData.deptInfo)
          this.baseData.age = new Date().getFullYear() - parseInt(this.baseData.age.substring(0, 4))
        } else {
          this.$message.error(res.message)
          this.isLoading = false
        }
      })
    },

    goSave() {
      if (!this.baseData.userName) {
        this.$message.error('请输入姓名')
        return
      }
      if (!this.baseData.age) {
        this.$message.error('请输入年龄')
        return
      }
      if (!this.baseData.sex) {
        this.$message.error('请输入性别')
        return
      }
      if (!this.baseData.tel) {
        this.$message.error('请输入联系电话')
        return
      }
      if (!this.baseData.deptInfo || this.baseData.deptInfo.length == 0) {
        this.$message.error('请选择科室管理')
        return
      }

      let data = JSON.parse(JSON.stringify(this.baseData))
      updatePatientInfo(data)
        .then((res) => {
          if (res.success) {
            this.$message.success('操作成功')
            this.$emit('handleCancel')
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

  /deep/ .ant-select-selection--multiple {
    height: auto !important;
  }

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
    flex: 1;
    // height: 253px;
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
