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
    <div class="div-notice">右键点击下方二维码选择【图片另存为】并添加.png或者.jpg的后缀进行保存！</div>

    <!-- <div id="imgKeyDept"> -->
    <div :key="imgKeyDept" class="imgcontent">
      <img :src="extraImage" alt="testload"  />
    </div>
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
      getQrUrl({ ks: record.department_id, bq: 0 }).then((res) => {
        if (res.code == 0) {
          // this.data = res.data
          this.extraImage = res.data
        } else {
          // this.$message.error('新增失败：' + res.message)
        }
      })
    },

    handleSubmit() {},

    handleCancel() {
      this.visible = false
    },
  },
}
</script>
<style lang="less">
.div-notice {
  width: 100% !important;
  overflow: hidden;

  text-align: left;
  font-size: 12px;
  margin-bottom: 10px;
  
  color: #333;
}
.imgcontent{
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>