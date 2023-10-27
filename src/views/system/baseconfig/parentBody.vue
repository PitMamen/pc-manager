<template>
  <a-modal
    :title="'配置上级机构'"
    :width="392"
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
            <a-input
              v-model="inputName"
              @keyup.enter="searchName"
              @search="searchName"
              @blur="searchName"
              @change="onChanage"
              allow-clear
              placeholder="请输入待选机构名称检索"
              style="width: 304px; margin-left: 20px"
            />
          </div>

          <div class="div-content">
            <div class="half-kuang">
              <div class="top-view">
                <div class="content">机构列表 ({{ checkLenght.length }}/{{ hospitalList.length }})</div>
              </div>

              <div class="row-content" v-for="(item, index) in hospitalList" :key="index" :value="item">
                <a-checkbox
                  :checked="item.isCheck"
                  style="margin-left: 20px; margin-top: 5px"
                  @click="checkChange(item)"
                ></a-checkbox>
                <span
                  :style="{
                    'margin-top': '5px',
                    'margin-left': '15px',
                    'font-size': '14px',
                    color: item.isCheck ? '#409EFF' : '#4d4d4d',
                  }"
                  >{{ item.hospitalName }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
      
      
      <script>
import {
  modifyTbMerchant,
  addTbMerchant,
  getUpHospitalList,
  configUpHospitalCode,
} from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { isObjectEmpty, isStringEmpty, isArrayEmpty } from '@/utils/util'
import Vue from 'vue'
import Item from 'ant-design-vue/es/list/Item'
export default {
  components: {},
  data() {
    return {
      visible: false,
      confirmLoading: false,
      hospitalList: [],
      checkLenght: [],
      queryParamType: {
        id: '',
      },
      inputName: '',
      // 高级搜索 展开/关闭
      checkData: {
        id: '', //id
        hospitalCodeList: [], //机构类型 （多选）
      },
      paramJsonList: [{ key: '', value: '' }],
      fetching: false,
    }
  },
  created() {},
  methods: {
    clearData() {
      this.queryParamType.id = ''
    },

    onChanage(event) {
      console.log('FFF：', event.type)
      if (event.type == 'click') {
        this.hospitalList = JSON.parse(JSON.stringify(this.hospitalList))
      }
    },
    searchName() {
      if (this.inputName) {
        if (this.hospitalList && this.hospitalList.length > 0) {
          var ss = this.hospitalList.filter((p) => {
            return p.hospitalName.indexOf(this.inputName) > -1
          })

          if (ss && ss.length > 0) {
            this.hospitalList = ss
          } else {
            this.hospitalList = JSON.parse(JSON.stringify(this.hospitalList))
          }

          console.log('2222:', ss)
        }
      } else {
        this.hospitalList = JSON.parse(JSON.stringify(this.hospitalList))
      }
    },

    checkChange(item) {
      item.isCheck = !item.isCheck

      if (item.isCheck) {
        this.checkLenght.push(item)
        this.checkData.hospitalCodeList.push(item.hospitalCode)
      } else {
        this.checkLenght.pop()

        this.checkData.hospitalCodeList = this.checkData.hospitalCodeList.filter((local) => local != item.hospitalCode)
      }
    },

    getUpHospitalListOut() {
      getUpHospitalList(this.queryParamType).then((res) => {
        if (res.code == 0 && res.data) {
          this.hospitalList = res.data
          this.hospitalList.forEach((item) => {
            this.$set(item, 'isCheck', false)
            if (this.checkData.hospitalCodeList) {
              this.checkData.hospitalCodeList.forEach((itemIn) => {
                if (itemIn.hospitalCode == item.hospitalCode) {
                  this.$set(item, 'isCheck', true)
                }
              })
            }
          })
        } else {
          this.$message.error('获取失败：' + res.message)
        }
      })
    },

    //修改
    config(record) {
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.checkData = record
      this.queryParamType.id = record.id
      this.getUpHospitalListOut()
    },

    handleSubmit() {
      var postData = {
        hospitalCodeList: this.checkData.hospitalCodeList,
        id: this.checkData.id,
      }
      this.confirmLoading = true

      this.configUpHospitalCodeOut(postData)
    },

    configUpHospitalCodeOut(postData) {
      configUpHospitalCode(postData)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('操作成功！')
            this.visible = false
            this.$emit('ok', '')
          } else {
            this.$message.error(res.message)
          }
          this.confirmLoading = false
        })
        .finally((mess) => {
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
/deep/.ant-transfer-list {
  position: relative;
  display: inline-block;
  width: 180px;
  height: 300px;
  padding-top: 40px;
  margin-left: 9px;
  vertical-align: middle;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
}

/deep/ .ant-checkbox-wrapper {
  font-size: 12px !important;
}
.div-title {
  background-color: #f7f7f7;
  flex-direction: row;
  // width: 420px;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 26px;
  margin-top: 20px;
  margin-bottom: 10px;
  margin-left: 14px;

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
  // height: 342px;
  margin-top: 10px;

  .half-kuang {
    width: 303px;
    height: 350px;
    margin-left: 20px;
    margin-right: 25px;
    background: #ffffff;
    border: 1px solid #e6e6e6;
    overflow-y: auto;

    .top-view {
      width: 303px;
      height: 30px;
      background: #e6e6e6;

      .content {
        display: flex;
        flex-direction: row;
        color: #4d4d4d;
        font-weight: bold;
        padding-left: 5px;
        padding-top: 5px;
      }
    }

    .row-content {
      display: flex;
      flex-direction: row;
      color: #4d4d4d;
    }

    .line {
      width: 100%;
      height: 1px;
      background: #e6e6e6;
    }
  }

  .div-part-left {
    // float: left;
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

  .div-bottomlayout {
    display: flex;
    flex-direction: column;
    width: 420px;
    flex-wrap: wrap;
  }

  .div-content {
    margin-bottom: 10px;
    width: 420px;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    /deep/.ant-select-selection--multiple {
      li {
        margin-top: 1px !important;
      }
    }

    /deep/.ant-select-selection--bb {
      width: 350px;
    }

    /deep/.ant-select-selection--single {
      width: 132px;
    }

    .span-item-name {
      display: inline-block;
      color: #4d4d4d;
      font-size: 12px;
      text-align: right;
      margin-right: 10px;
      width: 60px;
    }

    .span-item-value {
      width: 250px;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      display: inline-block;
    }
    .ant-select {
      // flex: 1;
      font-size: 12px !important;
    }

    .ant-calendar-picker {
      flex: 1;
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
      