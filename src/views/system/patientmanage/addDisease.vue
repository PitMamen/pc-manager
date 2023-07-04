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
            <span class="span-item-name"><span style="color: red">*</span>所属学科:</span>
            <a-tree-select
              v-model="checkData.medicalId"
              style="min-width: 120px"
              :tree-data="treeData"
              placeholder="请选择"
              tree-default-expand-all
            >
            </a-tree-select>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>病种名称:</span>
            <a-input
              :maxLength="20"
              class="span-item-value"
              v-model="checkData.typeName"
              style="display: inline-block"
              allow-clear
              placeholder="请输入病种名称"
            />
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
          
          
          <script>
import {
  addDiseaseType,
  modifyDiseaseType,
  gettreeMedicalSubjects,
} from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { isObjectEmpty, isStringEmpty, isArrayEmpty } from '@/utils/util'
import Vue from 'vue'
export default {
  components: {},
  data() {
    return {
      visible: false,
      titleTab: '新增病种',
      record: {},
      headers: {},
      confirmLoading: false,
      treeData:[],
      checkData: {
        id: '',
        typeName: '',
        medicalId: undefined,
      },


    }
  },
  created() {},
  methods: {
    clearData() {
      this.checkData = {
        id: '',
        typeName: '',
        medicalId: undefined,
      }
    },
    //新增
    addDis(medicalId) {
      this.clearData()
      this.titleTab = '新增病种'
      this.visible = true
      this.confirmLoading = false
      if(medicalId){
        var ids = medicalId.toString().split(',')
        this.checkData.medicalId = ids[ids.length-1]
      }
      
      this.gettreeMedicalSubjectsOut()
    },

    // 修改
    editDis(record) {
      this.clearData()
      this.titleTab = '编辑病种'
      this.visible = true
      this.confirmLoading = false
      this.checkData.typeName = record.typeName
      this.checkData.medicalId = record.medicalId
      this.checkData.id = record.id
      this.gettreeMedicalSubjectsOut()
    },

    //学科列表
    gettreeMedicalSubjectsOut() {
      gettreeMedicalSubjects().then((res) => {
        if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item, index) => {
              this.$set(item, 'key', item.subjectClassifyId)
              this.$set(item, 'value', item.subjectClassifyId)
              this.$set(item, 'title', item.subjectClassifyName)
              this.$set(item, 'children', item.children)

              item.children.forEach((item1, index1) => {
                this.$set(item1, 'key', item1.subjectClassifyId)
                this.$set(item1, 'value', item1.subjectClassifyId)
                this.$set(item1, 'title', item1.subjectClassifyName)
              })
            })

            this.treeData = res.data
          } else {
            this.treeData = res.data
          }
      })
    },

    handleSubmit() {
      console.log(this.checkData)

      if (isStringEmpty(this.checkData.medicalId)) {
        this.$message.error('请选择学科')
        return
      }

      if (isStringEmpty(this.checkData.typeName)) {
        this.$message.error('请输入病种名称')
        return
      }
      if (this.checkData.id) {
        this.modifyUserTagOut(this.checkData)
      } else {
        this.addUserTagsOut(this.checkData)
      }
    },

    //修改病种
    modifyUserTagOut(postData) {
        modifyDiseaseType(postData).then((res) => {
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

    //添加病种
    addUserTagsOut(postData) {
        addDiseaseType(postData).then((res) => {
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
          