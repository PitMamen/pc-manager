<template>
  <a-modal
    class="ant-pxk-footer"
    title="修改分类"
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
            <span class="span-item-name"><span style="color: red">*</span>上级分类:</span>
            <div style="display: inline-block; width: 81%;">
              <div
                style="font-size: 12px; color: #000000a6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
              >{{ formData.pvalue }}</div>
            </div>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>药理分类:</span>
            <a-input
              v-model="formData.value"
              placeholder="请输入药理分类"
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
            />
          </div>
          <div
            class="div-service-user"
            style="margin-top: -7px; margin-left: 0px; position: relative; height: 52%;margin-bottom: 10px;"
          >
            <span style="margin-top: 10px; width: 60px; margin-left: 9px; color: #4d4d4d;">备注说明:</span>
            <a-textarea
              v-model="formData.remark"
              placeholder="请输入备注说明"
              style="height: 80px; min-height: 80px; margin-top: 10px; margin-left: 0px; width: 81%"
              :maxLength="50"
            />
            <span class="m-count-pxk">{{ formData.remark ? formData.remark.length : 0 }}/50</span>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { pinyin } from 'pinyin-pro'
import { isStringEmpty } from '@/utils/util'
import { update3 as update } from '@/api/modular/system/ypclassify'
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      formData: {}
    }
  },
  methods: {
    // 初始化方法
    edit(item) {
      this.formData = JSON.parse(JSON.stringify(item))
      this.visible = true
    },
    onChange(event) {
      this.formData.value = this.formData.value.trim();
      this.$set(this.formData, 'value', this.formData.value)
      this.$set(this.formData, 'acronym', pinyin(this.formData.value, {pattern: 'first',toneType: 'none',type: 'array'}).join(''))
    },
    validate() {
      if (isStringEmpty(this.formData.value)) {
        this.$message.error('请输入药理分类')
        return Promise.reject()
      }
      return Promise.resolve(this.formData)
    },
    handleSubmit() {
      this.validate().then(values => {
        this.confirmLoading = true
        update(values).then((res) => {
          if (res.code === 0){
            this.$message.success('修改成功')
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
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
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
