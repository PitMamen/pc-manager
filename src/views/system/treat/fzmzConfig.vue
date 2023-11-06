<template>
  <a-modal
    :title="titleTab"
    :visible="visible"
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
              >{{ record.userName }}|{{ record.userSex }}|{{ record.userAge }}|{{ record.hospitalName }}</span
            >
          </div>

          <div class="div-content" style="margin-top: 20px">
            <span class="span-item-name"><span style="color: red">*</span>单价 </span>
            <!-- 门诊  单价不让修改  只做展示 -->
            <a-input-number
              :disabled="type == 2"
              style="display: inline-block; width: 70px"
              v-model="saleAmount"
              :min="0"
              :max="10000"
              :maxLength="30"
              allow-clear
            />
          </div>
          <div class="div-content" style="margin-top: 20px">
            <a-checkbox @click="limitEnable()" :checked="islimitTip" />
            <span class="span-item-name" style="margin-left: 10px"><span style="color: red">*</span>限制条数</span>
            <a-input
              :maxLength="20"
              class="span-item-value"
              v-model="serviceValue2"
              style="display: inline-block; width: 70px"
              allow-clear
            />
          </div>

          <div class="div-content" style="margin-top: 20px">
            <a-checkbox @click="limitService()" :checked="isSertimelimit" />
            <span class="span-item-name" style="margin-left: 10px"><span style="color: red">*</span>服务时效</span>
            <a-input
              :maxLength="20"
              class="span-item-value"
              v-model="serviceValue1"
              style="display: inline-block; width: 70px"
              allow-clear
            />

            <a-select v-model="unitSelect" style="width: 70px; margin-left: 10px" allow-clear placeholder="单位">
              <a-select-option v-for="(item, index) in timeUnitTypesData" :key="index" :value="item.code">{{
                item.value
              }}</a-select-option>
            </a-select>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
            
            
            <script>
import { getCommodityPkgDetailByid, saveCommodityPkgCollection } from '@/api/modular/system/posManage'

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
      timeAttrExpire: {},
      timeAttrLimitnums: {},
      type: 1,
      saleAmount: 0,
      headers: {},
      price: 1000,
      unitSelect: 1,
      confirmLoading: false,

      serviceValue1: 0,
      serviceValue2: 0,

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
    clearData() {},

    limitEnable() {
      this.islimitTip = !this.islimitTip
    },

    limitService() {
      this.isSertimelimit = !this.isSertimelimit
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
    editmodal(record, type) {
      this.clearData()
      this.visible = true
      this.titleTab = type == 1 ? '复诊续方配置' : '门诊随诊配置'
      this.record = record
      this.type = type

      this.getDetailData(type)
    },

    getDetailData(type) {
      getCommodityPkgDetailByid({
        pkgId: type == 1 ? this.record.fuzhen.commodityPkgId : this.record.menzhen.commodityPkgId,
      })
        .then((res) => {
          if (res.code == 0) {
            //区分新增和修改
            if (res.data.optionalPkgs.length > 0) {
              this.pkgs = res.data.optionalPkgs
              res.data.optionalPkgs.forEach((item) => {
                if (item.items.length > 0) {
                  item.items.forEach((item1) => {
                    this.saleAmount = item1.saleAmount //单价
                    if (item1.itemsAttr) {
                      item1.itemsAttr.forEach((item2) => {
                        if (item2.ruleType == 'ITEM_ATTR_EXPIRE') {
                          //服务时效
                          this.timeAttrExpire = item2
                          this.isSertimelimit = true
                          this.serviceValue1 = this.timeAttrExpire.serviceValue
                          if (this.timeAttrExpire.unit == '小时') {
                            this.unitSelect = 1
                          } else {
                            this.unitSelect = 2
                          }
                        } else if (item2.ruleType == 'ITEM_ATTR_LIMITNUMS') {
                          //限制条数
                          this.islimitTip = true
                          this.timeAttrLimitnums = item2
                          this.serviceValue2 = this.timeAttrLimitnums.serviceValue
                        }
                      })
                    }
                  })
                }
              })
              console.log('1111:', this.timeAttrExpire, this.timeAttrLimitnums)
            } else {
              //将详情数据转换成前端要的数据
              console.log('itemType 修改')
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
      if (!this.serviceValue2 || this.serviceValue2 <= 0) {
        this.$message.error('请设置限制条数!')
        return
      }

      if (!this.serviceValue1 || this.serviceValue1 <= 0) {
        this.$message.error('请输入服务时效!')
        return
      }

      if (this.type != 1) {
        if (this.saleAmount < 0) {
          this.$message.error('请输入价格!')
          return
        }
      }else{
        if (!this.saleAmount || this.saleAmount <= 0) {
          this.$message.error('请输入价格!')
          return
        }
      }


      this.pkgs.forEach((item) => {
        delete item.itemImg
        item.itemType = 1

        if (item.items) {
          item.items.forEach((item2) => {
            this.$set(item2, 'idOut', 1)
            this.$set(item2, 'itemImg', 1)
            this.$set(item2, 'saleAmount', this.saleAmount)
            delete item2.itemInfo
            delete item2.itemStatus
            delete item2.serviceItemName
            delete item2.unit

            if (item2.itemsAttr) {
              item2.itemsAttr.forEach((item3) => {
                if (item3.ruleType == 'ITEM_ATTR_EXPIRE') {
                  this.$set(item3, 'serviceValue', this.serviceValue1) //设置服务时效
                  this.$set(item3, 'unit', this.unitSelect == 1 ? '小时' : '天') //设置服务时效
                } else if (item3.ruleType == 'ITEM_ATTR_LIMITNUMS') {
                  this.$set(item3, 'serviceValue', this.serviceValue2) //设置限制条数
                }
              })
            }
          })
        }
      })

      console.log('rrr:', this.pkgs)

      let uploadData = {
        pkgs: this.pkgs,
        id: this.type == 1 ? this.record.fuzhen.commodityPkgId : this.record.menzhen.commodityPkgId,
      }

      this.confirmLoading = true
      saveCommodityPkgCollection(uploadData)
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
  height: 210px;

  .div-part-left {
    float: left;
    width: 100%;
    overflow: hidden;
    height: 100%;
  }
  .div-part-right {
    float: right;
    width: 353px;
    overflow: hidden;
    height: 100%;
  }

  .div-content {
    margin-top: 5px;
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    margin-left: 25px;

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
            