<template>
  <a-modal
    :title="title"
    :width="500"
    :visible="visible"
    :footer="null"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
  <a-spin :spinning="confirmLoading">
 
  <div class="div-radio">
        <div class="radio-item" :class="{ 'checked-btn': currentTab == 2 }" @click="onRadioClick(2)">
          <span style="margin-left: 3px">入院随访二维码</span>
        </div>
        <div class="radio-item" :class="{ 'checked-btn': currentTab == 1 }" @click="onRadioClick(1)">
          <span style="margin-left: 3px">出院随访二维码</span>
        </div>
  
      </div>
    <div class="div-notice">右键点击下方二维码选择【图片另存为】并添加.png或者.jpg的后缀进行保存！</div>

    <!-- <div id="imgKeyDept"> -->
    <div :key="imgKeyDept" class="imgcontent">
      <img :src="extraImage" alt="testload"  />
    </div>
  </a-spin>
  </a-modal>
</template>


<script>
import { newDept, getQrUrl } from '@/api/modular/system/posManage'
export default {
  data() {
    return {
      extraImage: '',
      title:'',
      confirmLoading: false,
      visible: false,
      record: {},
      imgKeyDept: '',
      currentTab:2
    }
  },

  watch: {
    visible() {
      if (this.visible) {
        this.imgKeyDept = ''
      } else {
        this.imgKeyDept = Math.random()
      }
      console.log('this.imgKeyDept :>> ', this.imgKeyDept)
    },
  },

  methods: {
    //初始化方法
    add(record) {
      this.record = {}
      this.record = record
      this.title=record.department_name+' - 随访二维码'
      this.visible = true
      this.getQrCode()
    },

    getQrCode(){
      this.confirmLoading=true
      getQrUrl({ ks: this.record.department_id, bq: 0,type:this.currentTab }).then((res) => {
        if (res.code == 0) {
         
          this.extraImage = res.data
        } 
        this.confirmLoading=false
      })
    },

    onRadioClick(type) {
        //如果在加载中  不让点击
        if (this.confirmLoading) {
          return
        }
        this.currentTab = type
        this.getQrCode()
      },
    handleSubmit() {},

    handleCancel() {
      this.visible = false
    },
  },
}
</script>
<style lang="less">
 .div-radio {
  
    display: flex;
    align-items: center;
    flex-direction: row;
    .radio-item {
      display: flex;
      overflow: hidden;
      padding: 10px 20px;
      align-items: center;
      flex-direction: row;
      &:hover {
        cursor: pointer;
      }
  
      .table-operator {
        margin-bottom: 30px;
        float: right !important;
      }
    }
  
    .checked-btn {
      background-color: #eff7ff;
      color: #1890ff;
      border-bottom: #1890ff 2px solid;
    }
  
    .text-color {
      background-color: #eff7ff;
      color: #1890ff;
    }
  
    // svg 使用到 drop-shadow 阴影展示 ， 所以父元素加 overflow: hidden;
    .checked-icon {
      filter: drop-shadow(#1890ff 200px 0);
      transform: translateX(-200px);
    }
  }
.div-notice {
  width: 100% !important;
  overflow: hidden;

  text-align: left;
  font-size: 12px;
  margin-bottom: 10px;
  margin-top: 10px;
  color: #333;
}
.imgcontent{
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>