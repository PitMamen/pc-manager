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
            <span class="span-item-name"><span style="color: red">*</span>标签类型:</span>
            <a-select
              v-model="checkData.tagsTypeId"
              placeholder="请选择标签类型"
              allow-clear
              style="width: 120px; height: 28px"
            >
              <a-select-option v-for="item in lableTypeListData" :key="item.id" :value="item.id">{{
                item.tagsTypeName
              }}</a-select-option>
            </a-select>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>标签名称:</span>
            <a-input
              :maxLength="20"
              class="span-item-value"
              v-model="checkData.tagsName"
              style="display: inline-block"
              allow-clear
              placeholder="请输入类别名称"
            />
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
        
        
        <script>
import { getUserTagsTypeList, modifyUserTag, addUserTag } from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { isObjectEmpty, isStringEmpty, isArrayEmpty } from '@/utils/util'
import Vue from 'vue'
export default {
  components: {},
  data() {
    return {
      visible: false,
      titleTab:'新增标签',
      record: {},
      headers: {},
      confirmLoading: false,
      checkData: {
        id: '',
        tagsName: '',
        tagsTypeId: undefined,
      },
      lableTypeListData: [],

      queryParamType: {
        pageNo: 1,
        pageSize: 100,
      },

      selects: [
        { code: 'jbqk', value: '基本情况' },
        { code: 'jkzk', value: '健康状况' },
        { code: 'gwxh', value: ' 购物喜好' },
        { code: 'qt', value: '其他' },
      ],
    }
  },
  created() {},
  methods: {
    clearData() {
      this.checkData = {
        id:'',
        tagsTypeId: undefined,
        tagsName: '',
      }
    },
    //新增
    addLable(tagsTypeId) {
      this.clearData()
      this.titleTab = '新增标签'
      this.visible = true
      this.confirmLoading = false
      this.checkData.tagsTypeId = tagsTypeId
      this.getUserTagsTypeListOut()
    },

    // 修改
    editLable(record) {
      this.clearData()
      this.titleTab = '编辑标签'
      this.visible = true
      this.confirmLoading = false
      this.checkData.tagsName = record.tagsName
      this.checkData.tagsTypeId = record.tagsTypeId
      this.checkData.id = record.id
      this.getUserTagsTypeListOut()
    },

    //标签类型
    getUserTagsTypeListOut() {
      getUserTagsTypeList(this.queryParamType).then((res) => {
        if (res.code == 0) {
          this.lableTypeListData = res.data.records
        } else {
          this.$message.error('获取失败：' + res.message)
        }
      })
    },

    handleSubmit() {
      console.log(this.checkData)

      if (isStringEmpty(this.checkData.tagsTypeId)) {
        this.$message.error('请选择标签类型')
        return
      }

      if (isStringEmpty(this.checkData.tagsName)) {
        this.$message.error('请输入标签名称')
        return
      }
      if (this.checkData.id) {
        this.modifyUserTagOut(this.checkData)
      } else {
        this.addUserTagsOut(this.checkData)
      }
    },

    //修改类别
    modifyUserTagOut(postData) {
        modifyUserTag(postData).then((res) => {
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

    //添加标签
    addUserTagsOut(postData) {
      addUserTag(postData).then((res) => {
        if (res.code == 0) {
          this.$message.success('添加成功！')
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
  margin-top: 10px;

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
    margin-top: 30px;
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    /deep/.ant-select-selection--multiple {
      li {
        margin-top: 1px !important;
      }
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
        