<template>
  <a-modal
    title="终止条件配置"
    :width="800"
    :height="50"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="stop-wrap">
        <div class="stop-row" v-for="(item, index) in stopTaskDetailDtos" :key="index" :value="item.stopType">
          <a-checkbox @click="goCheck(item)" :checked="item.isChecked" style="margin-left: 1%" />
          <!-- <span class="span-titl" style="margin-left: 1%">电话跟进</span> -->
          <span style="margin-left: 1%; width: 120px">{{ item.stopTitle }}</span>

          <a-date-picker
            v-if="item.stopType == 1"
            style="margin-left: 1%"
            format="YYYY-MM-DD"
            v-model="item.conditionValue"
          />

          <a-select
            v-if="item.stopType == 2 && showList"
            style="margin-left: 1%; width: 96px"
            v-model="item.conditionValue"
            allow-clear
            placeholder="请选择名单"
          >
            <a-select-option v-for="(item, index) in sourceData" :key="index" :value="item.value">{{
              item.description
            }}</a-select-option>
          </a-select>

          <a-input-number
            v-if="item.stopType == 3 && showNum"
            style="display: inline-block; margin-left: 1%; width: 96px"
            v-model="item.conditionValue"
            :min="0"
            :max="10000"
            :maxLength="30"
            allow-clear
            placeholder="请输入数量"
          />
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import { getPlatTypeList } from '@/api/modular/system/posManage'
export default {
  data() {
    return {
      index: -1,
      chooseName: '', //
      confirmLoading: false,
      showList: true,
      showNum: true,
      stopTaskDetailDtos: [],
      //  stopType 任务终止类型;1:制定日期2:出现在特殊名单3:指定次数
      stopTaskDetailDtosOrigin: [
        { conditionValue: '', stopType: 1 },
        { conditionValue: '', stopType: 2 },
        { conditionValue: '', stopType: 3 },
      ],
      sourceData: [],
      visible: false,
    }
  },
  methods: {
    add(index, stopTaskDetailDtos, sourceData, taskExecType) {
      this.index = index
      this.visible = true
      this.stopTaskDetailDtos = stopTaskDetailDtos
      this.sourceData = sourceData
      console.log('addStop', index)
      console.log('stopTaskDetailDtos', stopTaskDetailDtos)
      console.log('sourceData', sourceData)

      //名单没有了不显示名单
      this.showList = this.sourceData.length == 0 ? false : true
      //taskExecType 为1为临时任务,不显示次数
      this.showNum = taskExecType == 1 ? false : true

      this.processData()
    },

    /**
     * 处理数据  有的item覆盖，没有的item拿stopTaskDetailDtosOrigin里的item覆盖
     */
    processData() {
      let tempList = []
      for (let index = 0; index < this.stopTaskDetailDtosOrigin.length; index++) {
        let tempItem = this.stopTaskDetailDtosOrigin[index]
        let hasItem = this.stopTaskDetailDtos.find((item) => item.stopType == tempItem.stopType)
        if (hasItem) {
          this.$set(hasItem, 'isChecked', true)
          tempList.push(JSON.parse(JSON.stringify(hasItem)))
        } else {
          this.$set(tempItem, 'isChecked', false)
          tempList.push(JSON.parse(JSON.stringify(tempItem)))
        }
      }
      this.stopTaskDetailDtos = JSON.parse(JSON.stringify(tempList))
      //  stopType 任务终止类型;1:制定日期2:出现在特殊名单3:指定次数
      this.stopTaskDetailDtos.forEach((item) => {
        if (item.stopType == 1) {
          this.$set(item, 'stopTitle', '指定日期结束')
        } else if (item.stopType == 2) {
          this.$set(item, 'stopTitle', '出现在特殊名单')
        }
        if (item.stopType == 3) {
          this.$set(item, 'stopTitle', '指定次数后结束')
        }
      })

      //去除不显示内容
      if (!this.showList) {
        this.stopTaskDetailDtos = this.stopTaskDetailDtos.filter((item) => item.stopType != 2)
      }
      if (!this.showNum) {
        this.stopTaskDetailDtos = this.stopTaskDetailDtos.filter((item) => item.stopType != 3)
      }
    },

    goCheck(item) {
      item.isChecked = !item.isChecked
    },

    handleSearch(inputName) {},

    onSelect(userId) {},

    handleSubmit() {
      if (this.choseNum == 0) {
        this.$message.error('请选择人员')
        return
      }
      console.log('this.proccesedAssignments', proccesedAssignments)
      this.$emit('ok', this.index, proccesedAssignments)
      this.visible = false
    },
    handleCancel() {
      // this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
<style lang="less" scoped>
.stop-wrap {
  width: 100%;
  // height: 100%;
  overflow: hidden;
  overflow-y: auto;
  margin-top: 5%;
  margin-left: 5%;
  height: 500px;
  // display: flex;
  // flex-direction: row;

  .stop-row {
    display: flex;
    margin-top: 3%;
    align-items: center;
    flex-direction: row;
    font-size: 12px;
  }

  .divider-col {
    width: 2px;
    // height: 100%;
    margin-left: 2%;
    background-color: #eee;
  }
}
</style>
