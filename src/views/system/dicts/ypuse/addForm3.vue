<template>
  <a-modal
    class="ant-pxk-footer"
    title="新增频次"
    :width="400"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-part">
        <div class="div-part-left">
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>频次名称:</span>
            <a-input
              v-model="formData.value"
              placeholder="请输入频次名称"
              class="span-item-value"
              style="display: inline-block"
              :maxLength="20"
              allow-clear
              @change="onChange"
            />
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>频次缩写:</span>
            <a-input
              v-model="formData.abbr"
              placeholder="请输入频次缩写"
              class="span-item-value"
              style="display: inline-block"
              :maxLength="20"
              allow-clear
              @change="onChange"
            />
          </div>
          <div class="div-content">
            <span class="span-item-name">拼音码:</span>
            <a-input
              v-model="formData.acronym"
              placeholder="请输入拼音码"
              class="span-item-value"
              style="display: inline-block"
              :maxLength="20"
              allow-clear
              disabled
            />
          </div>
          <div class="div-content">
            <span class="span-item-name">监管代码:</span>
            <a-select
              v-model="formData.supervisionCode"
              allow-clear
              placeholder="请选择监管代码"
            >
              <a-select-option v-for="item in selects" :key="item.id" :value="item.no">{{
                item.no+ '-' +item.code+ '-' +item.value
              }}</a-select-option>
            </a-select>
          </div>
          <div class="div-content">
            <span class="span-item-name">HIS编码:</span>
            <a-input
              v-model="formData.code"
              placeholder="请输入HIS编码"
              class="span-item-value"
              style="display: inline-block"
              :maxLength="20"
              allow-clear
            />
          </div>
          <div class="div-content">
            <span class="span-item-name" style="position: relative; left: -5px; white-space: nowrap;">corn表达式:</span>
            <a-input
              v-model="formData.corn"
              placeholder="请输入corn表达式"
              class="span-item-value"
              style="display: inline-block"
              :maxLength="20"
              allow-clear
            />
            <a-button style="float: right; margin-right: 0; margin-left: 10px;" @click="geneCornList">校验</a-button>
          </div>
          <div
            class="div-service-user"
            style="margin-top: -7px; margin-left: 0px; position: relative; height: 52%;margin-bottom: 10px;"
          >
            <span style="margin-top: 10px; width: 60px; margin-left: 9px; color: #4d4d4d;">执行计划:<br/>(最近10次)</span>
            <div style="display: inline-block; width: 81%; min-height: 80px; margin-top: 10px; margin-left: 0px; padding: 2px 10px; background: #f5f5f5; border: 1px solid #d9d9d9; border-radius: 2px;">
              <div
                style="font-size: 12px; color: #000000a6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                v-for="item in cornList"
                :key="item"
                :title="item"
              >{{ item }}</div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { pinyin } from 'pinyin-pro'
import { isStringEmpty } from '@/utils/util'
import { add3 as add, info3 as corn, select3 as selects } from '@/api/modular/system/ypuse'
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      selects: [],
      cornList: [],
      formData: {}
    }
  },
  methods: {
    // 初始化方法
    add(code) {
      this.formData.hospitalCode = code
      this.visible = true
      this.getSelects()
    },
    getSelects() {
      selects({
        pageNo: 1,
        pageSize: 99999
      }).then(res => {
        if (res.code === 0) {
          if (res.data && res.data.records) {
            this.selects = res.data.records
          }
        }
      })
    },
    geneCornList() {
      if (isStringEmpty(this.formData.corn)) {
        this.$message.error('请输入corn表达式')
        return
      }
      this.confirmLoading = true
      this.cornList = []
      corn({
        corn: this.formData.corn
      }).then(res => {
        if (res.code === 0) {
          this.cornList = res.data || []
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => {
        this.confirmLoading = false
      })
    },
    onChange(event) {
      this.formData.value = this.formData.value.trim();
      this.$set(this.formData, 'value', this.formData.value)
      this.$set(this.formData, 'acronym', pinyin(this.formData.value, {pattern: 'first',toneType: 'none',type: 'array'}).join(''))
    },
    validate() {
      if (isStringEmpty(this.formData.value)) {
        this.$message.error('请输入频次名称')
        return Promise.reject()
      }
      if (isStringEmpty(this.formData.abbr)) {
        this.$message.error('请输入频次缩写')
        return Promise.reject()
      }
      return Promise.resolve(this.formData)
    },
    handleSubmit() {
      this.validate().then(values => {
        this.confirmLoading = true
        add(values).then((res) => {
          if (res.code === 0){
            this.$message.success('新增成功')
            this.$emit('ok', values)
            this.handleCancel()
            this.clearDatas()
          }else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
      })
    },
    handleCancel() {
      this.visible = false
    },
    clearDatas() {
      this.formData = {}
    }
  }
}
</script>

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
.div-part {
  width: 100%;
  // height: 530px;
  margin-top: 10px;
  .div-part-left {
    float: left;
    width: 353px;
    height: 100%;
  }
  .div-part-right {
    float: right;
    width: 353px;
    overflow: hidden;
    height: 100%;
  }
  .div-content {
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    .span-item-name {
      display: inline-block;
      color: #4d4d4d;
      font-size: 12px;
      text-align: right;
      margin-right: 10px;
      width: 60px;
    }
    .span-item-value {
      flex: 1;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      display: inline-block;
    }
    .ant-select {
      flex: 1;
      font-size: 12px !important;
    }
    .ant-calendar-picker {
      flex: 1;
    }
  }
}
</style>
<style lang="less" >
.ant-pxk-footer{
  .ant-modal-footer {
    padding: 10px 16px !important;
    border-top: none ;
  }
}
</style>
