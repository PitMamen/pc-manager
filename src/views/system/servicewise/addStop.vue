<template>
  <a-modal
    title="终止条件配置"
    style="width: 800px"
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
            :default-value="nowDateBegin"
            format="YYYY-MM-DD"
            v-model="dateValue"
          />

          <a-select
            v-if="item.stopType == 2"
            style="margin-left: 1%; width: 155px"
            v-model="item.conditionValue"
            allow-clear
            placeholder="请选择名单"
          >
            <a-select-option v-for="(item, index) in sourceData" :key="index" :value="item.value">{{
              item.description
            }}</a-select-option>
          </a-select>

          <a-input-number
            v-if="item.stopType == 3"
            style="display: inline-block; margin-left: 1%; width: 155px"
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
import { getDateNow } from '@/utils/util'
import moment from 'moment'
export default {
  data() {
    return {
      index: -1,
      chooseName: '', //
      nowDateBegin: '', //
      dateValue: '', //
      dateFormat: 'YYYY-MM-DD',
      confirmLoading: false,
      showList: true,
      showNum: true,
      stopTaskDetailDtos: [],
      //  stopType 任务终止类型;1:制定日期2:出现在特殊名单3:指定次数
      stopTaskDetailDtosOrigin: [
        { conditionValue: undefined, stopType: 1 },
        { conditionValue: undefined, stopType: 2 },
        { conditionValue: undefined, stopType: 3 },
      ],
      sourceData: [],
      visible: false,
    }
  },
  methods: {
    add(index, stopTaskDetailDtos, sourceData, taskExecType) {
      this.index = index
      this.visible = true
      this.dateValue = moment(new Date(), this.dateFormat)
      this.stopTaskDetailDtos = JSON.parse(JSON.stringify(stopTaskDetailDtos))
      this.sourceData = JSON.parse(JSON.stringify(sourceData))
      console.log('addStop', index)
      console.log('stopTaskDetailDtos', JSON.parse(JSON.stringify(stopTaskDetailDtos)))
      console.log('sourceData', JSON.parse(JSON.stringify(sourceData)))
      this.nowDateBegin = moment(new Date(), this.dateFormat)
      console.log('nowDateBegin', this.nowDateBegin)
      this.stopTaskDetailDtosOrigin[0].conditionValue = this.nowDateBegin

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
        let hasItem
        if (this.stopTaskDetailDtos) {
          hasItem = this.stopTaskDetailDtos.find((item) => item.stopType == tempItem.stopType)
        }
        if (hasItem) {
          this.$set(hasItem, 'isChecked', true)
          if (hasItem.stopType == 1) {
            hasItem.conditionValue = moment(hasItem.conditionValue, 'YYYY-MM-DD HH:mm:ss')
            this.dateValue = moment(hasItem.conditionValue, 'YYYY-MM-DD HH:mm:ss')
            console.log('hasItem.conditionValue', hasItem.conditionValue)
          }
          // tempList.push(JSON.parse(JSON.stringify(hasItem)))
          tempList.push(hasItem)
        } else {
          this.$set(tempItem, 'isChecked', false)
          tempList.push(JSON.parse(JSON.stringify(tempItem)))
        }
      }
      console.log('tempList', JSON.parse(JSON.stringify(tempList)))
      this.stopTaskDetailDtos = JSON.parse(JSON.stringify(tempList))
      //  stopType 任务终止类型;1:制定日期2:出现在特殊名单3:指定次数
      this.stopTaskDetailDtos.forEach((item) => {
        if (item.stopType == 1) {
          this.$set(item, 'stopTitle', '指定日期结束')
        } else if (item.stopType == 2) {
          this.$set(item, 'stopTitle', '出现在特殊名单')
          // if (item.conditionValue) {
          //   item.conditionValue = moment(item.conditionValue, 'YYYY-MM-DD')
          // }
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

      console.log('stopTaskDetailDtos processed', JSON.parse(JSON.stringify(this.stopTaskDetailDtos)))
    },

    goCheck(item) {
      item.isChecked = !item.isChecked
    },

    handleSubmit() {
      let arr = []
      for (let index = 0; index < this.stopTaskDetailDtos.length; index++) {
        const element = this.stopTaskDetailDtos[index]
        if (this.stopTaskDetailDtos[index].isChecked) {
          let tempItem = {}
          if (this.stopTaskDetailDtos[index].stopType == 1) {
            if (!this.stopTaskDetailDtos[index].conditionValue) {
              this.$message.warn('请选择日期')
              return
            }
            tempItem = {
              stopType: 1,
              conditionValue: moment(this.dateValue).format('YYYY-MM-DD') + ' 23:59:59',
            }
          }

          if (this.stopTaskDetailDtos[index].stopType == 2) {
            if (!this.stopTaskDetailDtos[index].conditionValue) {
              this.$message.warn('请选择名单')
              return
            }
            tempItem = {
              stopType: 2,
              conditionValue: this.stopTaskDetailDtos[index].conditionValue,
            }
          }

          if (this.stopTaskDetailDtos[index].stopType == 3) {
            if (!this.stopTaskDetailDtos[index].conditionValue) {
              this.$message.warn('请输入次数')
              return
            }
            tempItem = {
              stopType: 3,
              conditionValue: this.stopTaskDetailDtos[index].conditionValue,
            }
          }
          arr.push(tempItem)
        }
      }

      //拼接描述 stopConditionRemark
      let stopConditionRemark = ''
      if (arr.length > 0) {
        for (let index = 0; index < arr.length; index++) {
          let itemStr = ''
          if (arr[index].stopType == 1) {
            itemStr = arr[index].conditionValue + '终止'
          } else if (arr[index].stopType == 2) {
            let nameStr = this.sourceData.find((item) => item.value == arr[index].conditionValue).description
            itemStr = '出现在' + nameStr + '终止'
          } else if (arr[index].stopType == 3) {
            itemStr = '执行' + arr[index].conditionValue + '次后终止'
          }

          if (index != arr.length - 1) {
            stopConditionRemark = stopConditionRemark + itemStr + '，或'
          } else {
            stopConditionRemark = stopConditionRemark + itemStr + '。'
          }
        }
      }

      console.log('addStop arr', arr)
      this.$emit('ok', this.index, arr, stopConditionRemark)
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
  margin-top: 30px;
  margin-left: 85px;
  height: 350px;
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
