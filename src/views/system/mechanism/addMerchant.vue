<template>
  <a-modal
    :title="record.merchantId ? '修改收款商户' : '新增收款商户'"
    :width="488"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-part">
        <div class="div-part-left">
          <div class="div-title" style="margin-top: 0">
            <div class="div-line-blue"></div>
            <span class="span-title">基本信息</span>
          </div>

          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>商户类型:</span>
            <a-select
              v-model="checkData.channel"
              placeholder="请选择商户类型"
              allow-clear
              style="height: 28px"
              class="ant-select-selection--single"
            >
              <a-select-option v-for="item in payeeType" :key="item.code" :value="item.code">{{
                item.name
              }}</a-select-option>
            </a-select>

            <a-checkbox @change="checkBill" v-model="isChecked" :checked="isChecked" style="margin-left: 10px" />
            <div style="margin-left: 10px">参与对账</div>
          </div>

          <div class="div-content">
            <span class="span-item-name">商户编码:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.merchantId"
              style="display: inline-block"
              allow-clear
              :maxLength="36"
              placeholder="请输入商户编码"
            />
          </div>

          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>商户名称:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.name"
              style="display: inline-block"
              allow-clear
              :maxLength="150"
              placeholder="请输入商户名称"
            />
          </div>

          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>拼音码:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.namePy"
              style="display: inline-block"
              allow-clear
              :maxLength="150"
              placeholder="请输入商户名称"
            />
          </div>

          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>所属机构:</span>
            <div style="width: 85% !important">
              <!-- <a-tree-select
                :dropdown-style="{ 'margin-top': '215px', height: '140px', overflow: 'auto' }"
                :tree-data="treeData"
                placeholder="请选择机构"
                @select="treeSelect"
                tree-default-expand-all
                v-model="hospitalName"
                class="ant-select-selection--bb"
              >
              </a-tree-select> -->
              <a-select
                v-model="checkData.hospitalCode"
                placeholder="请选择机构"
                show-search
                class="span-item-value"
                :filter-option="false"
                :not-found-content="fetching ? undefined : null"
                allow-clear
                @change="onHospitalSelectChange"
                @search="onHospitalSelectSearch"
              >
                <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                <a-select-option v-for="(item, index) in treeData" :value="item.hospitalCode" :key="index">{{
                  item.hospitalName
                }}</a-select-option>
              </a-select>
            </div>
          </div>

          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">相关参数</span>
          </div>

          <div class="div-content" v-for="(item, index) in paramJsonList" :key="index" :value="item.key">
            <span style="color: red; margin-right: 5px">*</span>
            <a-input
              v-model="item.key"
              style="display: inline-block; width: 25%"
              allow-clear
              :maxLength="36"
              placeholder="请输入参数名称"
            />
            <a-input
              v-model="item.value"
              style="display: inline-block; width: 40%; margin-left: 10px"
              allow-clear
              :maxLength="200"
              placeholder="请输入参数值"
            />

            <div style="cursor: pointer" @click="deleteMer(index)">
              <!-- <img style="width: 18px; height: 18px; margin-left: 5px" src="~@/assets/icons/icon_delete.jpg" /> -->

              <span style="width: 50px; color: #1890ff; margin-left: 5px">
                <a-icon type="delete" style="width: 18px; height: 18px; margin-left: 5px"></a-icon>删除</span
              >
            </div>

            <div style="cursor: pointer" @click="addMer(index)" v-if="index == paramJsonList.length - 1">
              <!-- <img style="width: 18px; height: 18px; margin-left: 5px" src="~@/assets/icons/icon_add_rule.png" /> -->
              <span style="width: 50px; color: #1890ff; margin-left: 5px">
                <a-icon type="plus" style="width: 18px; height: 18px; margin-left: 5px"></a-icon>新增</span
              >
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
  
  
  <script>
import { queryHospitalList2, modifyTbMerchant, addTbMerchant } from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { isObjectEmpty, isStringEmpty, isArrayEmpty } from '@/utils/util'
import Vue from 'vue'
export default {
  components: {},
  data() {
    return {
      hospitalName: '',
      visible: false,
      record: {},
      headers: {},
      confirmLoading: false,
      findItemData: {},
      // 高级搜索 展开/关闭
      danandataList: [],
      treeData: [],
      localHospitalCode: undefined,
      checkData: {
        name: '', //商户名称
        channel: undefined, //商户类型
        merchantId: '', //商户编码
        namePy: '',
        hospitalCode: undefined, //
        paramJson: '',
        tenantId: '',
      },
      paramJsonList: [{ key: '', value: '' }],
      fetching: false,
      accountChecked: false, //客服坐席
      wecomChecked: false, //企稳账号
      isChecked: false,

      payeeType: [
        {
          code: 'wechat',
          name: '微信',
        },
        {
          code: 'alipay',
          name: '支付宝',
        },
      ],
    }
  },
  created() {},
  methods: {
    treeSelect(hospitalId) {
      //根据选中的 反向查询
      for (let index = 0; index < this.treeData.length; index++) {
        if (hospitalId == this.treeData[index].hospitalId) {
          this.findItemData = JSON.parse(JSON.stringify(this.treeData[index]))
          break
        }
        if (this.treeData[index].children && this.treeData[index].children.length > 0) {
          for (let indexIn = 0; indexIn < this.treeData[index].children.length; indexIn++) {
            if (hospitalId == this.treeData[index].children[indexIn].hospitalId) {
              this.findItemData = JSON.parse(JSON.stringify(this.treeData[index].children[indexIn]))
              break
            }
          }
        }
      }
      // console.log("HHHH:",this.findItemData)
      this.checkData.hospitalCode = this.findItemData.hospitalCode
      this.checkData.tenantId = this.findItemData.hospitalId
    },

    checkBill(e) {
      this.isChecked = e.target.checked
    },

    clearData() {
      this.record = {}
      this.paramJsonList = [{ key: '', value: '' }]
      this.checkData = {
        name: '', //商户名称
        channel: undefined, //商户类型
        merchantId: '', //商户编码
        namePy: '',
        hospitalCode: undefined, //机构
        paramJson: '',
        tenantId: '',
      }
      this.hospitalName = ''
      this.accountChecked = false
      this.wecomChecked = false
    },

    deleteMer(index) {
      if (this.paramJsonList.length == 1) {
        this.$message.error('请至少配置一个参数!')
        return
      }
      this.paramJsonList.splice(index, 1)
    },

    addMer() {
      if (this.paramJsonList && this.paramJsonList.length >= 10) {
        this.$message.error('最多只能添加10个参数!')
        return
      }
      var jsonData = { key: '', value: '' }
      this.paramJsonList.push(jsonData)
    },

    //新增
    addModel() {
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.user = Vue.ls.get(TRUE_USER)
      if (this.user) {
        this.localHospitalCode = this.user.hospitalCode
      }
      this.queryHospitalListOut(undefined)
    },
    //修改
    editModel(record) {
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.record = record
      this.hospitalName = record.hospitalName
      this.checkData = record
      if (record.paramJson) {
        var data = eval(JSON.parse(record.paramJson))
        var keyData = []
        for (var key in data) {
          keyData.push({ key: key, value: data[key] })
        }
        this.paramJsonList = keyData
      }
      this.isChecked = record.billFlag == 1 ? true : false
      this.queryHospitalListOut(undefined)
    },

    /**
     * 所属机构接口
     */
    /**
     *
     * @param {}
     */
    // queryHospitalListOut() {
    //   let queryData = {
    //     tenantId: '',
    //     status: 1,
    //     hospitalName: '',
    //   }
    //   this.confirmLoading = true
    //   queryHospitalList(queryData)
    //     .then((res) => {
    //       if (res.code == 0 && res.data.length > 0) {
    //         res.data.forEach((item, index) => {
    //           this.$set(item, 'key', item.hospitalCode)
    //           this.$set(item, 'value', item.hospitalId)
    //           this.$set(item, 'title', item.hospitalName)
    //           this.$set(item, 'children', item.hospitals)

    //           item.hospitals.forEach((item1, index1) => {
    //             this.$set(item1, 'key', item1.hospitalCode)
    //             this.$set(item1, 'value', item1.hospitalId)
    //             this.$set(item1, 'title', item1.hospitalName)
    //           })
    //         })

    //         this.treeData = res.data
    //       } else {
    //         this.treeData = res.data
    //       }
    //       return []
    //     })
    //     .finally((res) => {
    //       this.confirmLoading = false
    //     })
    // },


/**
     * 所属机构接口
     */
     queryHospitalListOut(name) {
      this.fetching = true
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: name,
      }
      this.confirmLoading = true
      queryHospitalList2(queryData)
        .then((res) => {
          this.fetching = false
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item) => {
              if (item.hospitalCode == this.localHospitalCode) {
                this.checkData.hospitalCode = item.hospitalCode
              }
            })
            this.treeData = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    //机构搜索
    onHospitalSelectSearch(value) {
      this.treeData = []
      this.queryHospitalListOut(value)
    },
    //机构选择变化
    onHospitalSelectChange(value) {
      if (value === undefined) {
        this.localHospitalCode = undefined
        this.treeData = []
        this.queryHospitalListOut(undefined)
      }
    },







    handleSubmit() {
      var object = {}
      for (let index = 0; index < this.paramJsonList.length; index++) {
        if (!this.paramJsonList[index].key || !this.paramJsonList[index].value) {
          this.$message.error('参数不能为空！')
          return
        }
        this.$set(object, this.paramJsonList[index].key, this.paramJsonList[index].value)
      }

      // console.log('KKK:', JSON.stringify(object))

      if (isStringEmpty(this.checkData.name)) {
        this.$message.error('请输入商户名称')
        return
      }

      if (isStringEmpty(this.checkData.channel)) {
        this.$message.error('请选择商户类型')
        return
      }

      if (isStringEmpty(this.checkData.hospitalCode)) {
        this.$message.error('请选择机构')
        return
      }

      if (isStringEmpty(this.checkData.namePy)) {
        this.$message.error('请输入拼音码')
        return
      }

      var postData = {
        tenantId: this.checkData.tenantId,
        name: this.checkData.name,
        channel: this.checkData.channel,
        paramJson: JSON.stringify(object) ? JSON.stringify(object) : '',
        hospitalCode: this.checkData.hospitalCode,
        insideId: this.checkData.insideId,
        namePy: this.checkData.namePy,
        merchantId: this.checkData.merchantId,
        status: 1,
        billFlag: this.isChecked ? 1 : 0,
      }
      console.log('qqqq:', this.isChecked, postData)
      this.confirmLoading = true

      if (this.record.insideId) {
        postData.insideId = this.record.insideId
        //修改
        this.modifyTbMerchantOut(postData)
      } else {
        //新增
        this.addMerchantOut(postData)
      }
    },

    addMerchantOut(postData) {
      addTbMerchant(postData).then((res) => {
        if (res.code == 0) {
          this.$message.success('新增成功！')
          this.visible = false
          this.$emit('ok', '')
        } else {
          this.$message.error(res.message)
        }
        this.confirmLoading = false
      })
    },
    modifyTbMerchantOut(postData) {
      console.log('神经:', postData)
      modifyTbMerchant(postData).then((res) => {
        if (res.code == 0) {
          this.$message.success('修改成功！')
          this.visible = false
          this.$emit('ok', '')
        } else {
          this.$message.error(res.message)
        }
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
// .ant-select-tree-dropdown {
//   max-height: 860vh !important;
//   top: 200px !important;
// }

/deep/ .ant-checkbox-wrapper {
  font-size: 12px !important;
}
.div-title {
  background-color: #f7f7f7;
  flex-direction: row;
  width: 420px;
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
    margin-left: 14px;
    /deep/.ant-select-selection--multiple {
      li {
        margin-top: 1px !important;
      }
    }

    /deep/.ant-select-selection--bb {
      width: 350px;
    }

    /deep/.ant-select-selection--single {
      width: 250px;
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
  