<template>
  <a-modal
    title="过滤条件配置"
    :footer="null"
    width="800px"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="filter-wrap">
        <div class="div-rules">
          <div
            class="end-btn"
            style="margin-left: 2%; margin-top: 1%"
            v-if="filterRules.length == 0"
            @click="addRule()"
          >
            <img style="width: 18px; height: 18px" src="~@/assets/icons/icon_add_rule.png" />

            <span style="width: 50px; color: #1890ff; margin-left: 1%">新增</span>
          </div>

          <div
            class="div-middle-content"
            v-for="(itemRule, indexRule) in filterRules"
            :key="indexRule"
            :value="itemRule.metaConfigureDetailId"
          >
            <div class="div-rule-left">
              <!-- class="mid-select-one" -->
              <a-select
                style="width: 220px"
                v-model="itemRule.metaConfigureDetailId"
                @select="onFieldSelect(itemRule, indexRule)"
                allow-clear
                placeholder="请选择字段"
              >
                <a-select-option
                  v-for="(item, index) in chooseData"
                  :key="index"
                  :value="item.value"
                  :title="item.description"
                  >{{ item.description }}</a-select-option
                >
              </a-select>

              <!-- class="mid-select-one" -->
              <a-select
                style="width: 180px; margin-left: 10px"
                v-model="itemRule.condition"
                allow-clear
                placeholder="请选择操作"
              >
                <a-select-option
                  v-for="(item, index) in operateData"
                  :key="index"
                  :value="item.value"
                  :title="item.description"
                  >{{ item.description }}</a-select-option
                >
              </a-select>

              <a-date-picker
                style="margin-left: 10px"
                v-if="itemRule.fieldType == 2"
                format="YYYY-MM-DD"
                v-model="itemRule.queryValue"
              />

              <a-input
                class="span-middle-value"
                v-model="itemRule.queryValue"
                style="display: inline-block; margin-left: 10px"
                :maxLength="120"
                v-if="itemRule.fieldType == 1 && itemRule.condition != 'in'"
                allow-clear
                placeholder="请输入内容"
              />

              <!-- 新增的包含加文字提示需求 -->
              <div class="div-des" v-if="itemRule.condition == 'in' && itemRule.fieldType != 2">
                <!-- style="display: inline-block; margin-top: 17px;width: 100%;" -->
                <a-input
                  class="span-middle-value"
                  v-model="itemRule.queryValue"
                  style="display: inline-block; width: 100%"
                  :maxLength="120"
                  v-if="itemRule.fieldType == 1"
                  allow-clear
                  placeholder="请输入内容"
                />
                <span style="font-size: 6px; color: #999; margin-left: 5%"> 请用英文逗号隔开多个参数 </span>
              </div>
            </div>

            <div class="div-rule-right">
              <div class="end-btn" style="margin-left: 15%" @click="delRule(indexRule, itemRule)">
                <img style="width: 18px; height: 18px" src="~@/assets/icons/icon_delete.jpg" />

                <span style="width: 50px; color: #1890ff; margin-left: 8%">删除</span>
              </div>

              <div
                class="end-btn"
                style="margin-left: 2%"
                v-if="indexRule == filterRules.length - 1"
                @click="addRule()"
              >
                <img style="width: 18px; height: 18px" src="~@/assets/icons/icon_add_rule.png" />

                <span style="width: 50px; color: #1890ff; margin-left: 8%">新增</span>
              </div>
            </div>
          </div>
        </div>

        <div class="div-bottom">
          <div class="div-relation">
            <span style="color: #333">条件间关系</span>
            <a-select style="width: 80px; margin-left: 8px" v-model="secondaryFilterTypeEnum" placeholder="请选择关系">
              <a-select-option v-for="(item, index) in relationData" :key="index" :value="item.value">{{
                item.name
              }}</a-select-option>
            </a-select>
          </div>
          <div class="div-btn">
            <a-button type="primary" @click="handleSubmit()">确定</a-button>
            <a-button style="margin-left: 20px" @click="cancel()">取消</a-button>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import moment from 'moment'
export default {
  data() {
    return {
      index: -1,
      //fieldType 为1，输入；为2时，则是选择日期
      filterRules: [{ fieldType: 1 }],
      // filterRules: [],
      chooseData: [],
      operateData: [],
      taskDetailFilterRuleDtos: [],
      relationData: [
        { value: 'and', name: '并且' },
        { value: 'or', name: '或者' },
      ],
      // secondaryFilterTypeEnum: 'and',
      secondaryFilterTypeEnum: 'or',
      confirmLoading: false,

      visible: false,
    }
  },
  methods: {
    moment,
    add(index, filterRules, secondaryFilterTypeEnum, chooseData, operateData) {
      this.visible = true
      this.index = index
      this.filterRules = filterRules || [{ fieldType: 1 }]
      if (secondaryFilterTypeEnum) {
        this.secondaryFilterTypeEnum = secondaryFilterTypeEnum
      }
      this.chooseData = chooseData
      this.operateData = operateData

      this.processData()
    },

    /**
     * 处理数据  有的item覆盖，没有的item拿stopTaskDetailDtosOrigin里的item覆盖
     */
    processData() {
      this.filterRules.forEach((item) => {
        if (item.metaConfigureDetailId) {
          item.metaConfigureDetailId = item.metaConfigureDetailId + ''
        }
        if (item.fieldType == 2) {
          // this.$set(item, 'queryValue', 4)
          item.queryValue = moment(item.queryValue, 'YYYY-MM-DD')
        }
      })
    },

    onFieldSelect(itemRule, indexRule) {
      // console.log('onFieldSelect chooseData', this.chooseData)
      // console.log('onFieldSelect itemRule Be', JSON.parse(JSON.stringify(itemRule)))
      let chooseOne = this.chooseData.find((item) => {
        return item.value == itemRule.metaConfigureDetailId
      })
      this.$set(itemRule, 'fieldType', chooseOne.fieldType)
      // console.log('onFieldSelect itemRule Af', JSON.parse(JSON.stringify(itemRule)))
    },

    delRule(indexRule, itemRule) {
      this.filterRules.splice(indexRule, 1)
    },

    addRule() {
      // if (this.filterRules.length == 5) {
      //   this.$message.warn('最多仅可添加5个过滤条件!')
      //   return
      // }
      this.filterRules.push({ fieldType: 1 })
    },

    cancel() {
      this.visible = false
    },
    handleSubmit() {
      let newArr = JSON.parse(JSON.stringify(this.filterRules))
      let filterConditionRemark = ''
      if (newArr.length > 0) {
        for (let indexRule = 0; indexRule < newArr.length; indexRule++) {
          let itemRule = newArr[indexRule]
          if (!itemRule.metaConfigureDetailId) {
            this.$message.error('请选择第' + (indexRule + 1) + '条名单过滤字段')
            return
          }
          if (!itemRule.condition) {
            this.$message.error('请选择第' + (indexRule + 1) + '条名单过滤操作')
            return
          }
          if (!itemRule.queryValue) {
            this.$message.error('请选择第' + (indexRule + 1) + '条名单过滤操作')
            return
          }

          if (itemRule.fieldType == 2) {
            itemRule.queryValue = moment(itemRule.queryValue).format('YYYY-MM-DD')
          }
          // console.log('itemRule.queryValue', itemRule.queryValue)
        }

        //拼接描述 filterConditionRemark
        for (let index = 0; index < newArr.length; index++) {
          // let nameStr = ''
          let nameStr = this.chooseData.find((item) => item.value == newArr[index].metaConfigureDetailId).description
          let relationStr = this.operateData.find((item) => item.value == newArr[index].condition).description
          if (index != newArr.length - 1) {
            if (this.secondaryFilterTypeEnum == 'or') {
              filterConditionRemark = filterConditionRemark + nameStr + relationStr + newArr[index].queryValue + '，或'
            } else {
              filterConditionRemark = filterConditionRemark + nameStr + relationStr + newArr[index].queryValue + '，且'
            }
          } else {
            filterConditionRemark = filterConditionRemark + nameStr + relationStr + newArr[index].queryValue + '。'
          }
        }
      }

      this.$emit('ok', this.index, newArr, this.secondaryFilterTypeEnum, filterConditionRemark)
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
.filter-wrap {
  width: 100%;
  // height: 100%;
  overflow: hidden;

  overflow-y: auto;
  margin-top: 20px;
  height: 350px;
  display: flex;
  flex-direction: column;
  .div-rules {
    display: flex;
    width: 100%;
    flex: 1;
    flex-direction: column;
    // align-items: center;
    // flex-wrap: wrap;
    // align-content: center;

    .end-btn {
      display: flex;
      flex-direction: row;
      align-items: center;

      &:hover {
        cursor: pointer;
      }
    }

    .div-middle-content {
      margin-right: 2%;
      width: 75%;
      display: flex;
      margin-top: 20px;
      flex-direction: row;
      align-items: center;

      .div-rule-left {
        display: flex;
        width: 80%;
        flex-direction: row;
        // align-items: center;

        .mid-select-one.ant-select {
          width: 30% !important;
          margin-left: 1% !important;
        }
        .mid-select-two.ant-select {
          width: 25% !important;
          margin-left: 1% !important;
        }

        .span-middle-value {
          margin-left: 1%;
          width: 50%;
        }
        .div-des {
          margin-left: 10px;
          display: flex;
          width: 50%;
          flex-direction: column;
        }
      }

      .div-rule-right {
        width: 20%;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }

  .div-bottom {
    display: flex;
    flex-direction: row;
    align-items: center;

    .div-relation {
      flex: 1;
    }
    .div-btn {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
}
</style>
