<template>
  <a-modal
    :title="record.id ? '修改类别' : '新增类别'"
    :width="460"
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
            <span class="span-item-name"><span style="color: red">*</span>类别名称:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.categoryName"
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
import {
  addArticleCategory,
  modifyArticleCategory,

} from '@/api/modular/system/posManage'


export default {
  components: {},
  data() {
    return {
      visible: false,
      record: {},
      confirmLoading:false,
      checkData: {
        categoryName: '', //登录账号
     
      },
  
    }
  },
  created() {},
  methods: {
    clearData() {
      this.record = {}
      this.checkData = {
        categoryName: '', //类别名称
        
      }
     
    },
    //新增
    addModel() {
    
      this.clearData()
      this.visible = true
      this.confirmLoading = false
    
    },
    //修改
    editModel(record) {
     
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.record = record
      this.checkData.categoryName=record.categoryName
   

      
    },
    

   
    handleSubmit() {
      console.log(this.checkData)

      if (this.checkData.categoryName.length == 0) {
        this.$message.error('请输入类别名称')
        return
      }
      

      var postData = {
        categoryName: this.checkData.categoryName,
       
      }
      
      this.confirmLoading = true

      if (this.record.id) {
        postData.id = this.record.id
        //修改
        this.editAccount(postData)
      } else {
        //新增
        this.addAccount(postData)
      }
    },

    addAccount(postData) {
      addArticleCategory(postData).then((res) => {
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
    editAccount(postData) {
      modifyArticleCategory(postData).then((res) => {
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
  height: 40px;
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
