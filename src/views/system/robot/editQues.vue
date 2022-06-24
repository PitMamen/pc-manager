<template>
  <div class="div-check">
    <div class="div-part">
      <div class="div-line-wrap">
        <div class="div-total-one">
          <span class="span-item-name"><span style="color: red">*</span> 所属类别 :</span>
          <a-select v-model="checkData.knowledgeType" allow-clear placeholder="请选择所属类别">
            <a-select-option v-for="(item, index) in statusData" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
        </div>
      </div>

      <div class="div-line-wrap">
        <div class="div-total-one">
          <span class="span-item-name"><span style="color: red">*</span> 内容标题 :</span>
          <a-input
            v-model="checkData.title"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请输入内容标题 "
          />
        </div>
      </div>

      <div class="div-line-wrap">
        <div class="div-total-one">
          <span class="span-item-name"><span style="color: red">*</span>内容详情 :</span>
        </div>
      </div>

      <div id="div1" style="margin-top: 3%"></div>
    </div>

    <div style="margin-top: 30px">
      <a-button size="large" type="primary" @click="goConfirm" style="margin-left: 47%"> 保存 </a-button>
    </div>
    <div style="height: 50px; backgroud-color: white" />
  </div>
</template>


<script type="text/javascript">
import { saveSysKnowledge, qryCodeValue } from '@/api/modular/system/posManage'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import { appId } from '@/utils/util'

import E from 'wangeditor'

export default {
  components: {},

  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      checkData: {
        title: '',
        knowledgeType: '',
        content: '', //内容
      },

      statusData: [],
    }
  },

  created() {
    qryCodeValue('KNOWLEDGE_TYPE').then((res) => {
      if (res.code == 0) {
        if (res.data && res.data.length > 0) {
          this.statusData = res.data
        }
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
  },

  methods: {
    goConfirm() {
      console.log('goConfirmCheckData', this.checkData)
      if (!this.checkData.knowledgeType) {
        this.$message.error('请选择所属类别')
        return
      }
      if (!this.checkData.title) {
        this.$message.error('请输入内容标题')
        return
      }

      if (!this.checkData.content) {
        this.$message.error('请编辑内容')
        return
      }
      let chooseOne = this.statusData.find((item) => {
        return item.code == this.checkData.knowledgeType
      })
      this.$set(this.checkData, 'typeName', chooseOne.value)

      let user = Vue.ls.get(TRUE_USER)
      this.$set(this.checkData, 'creator', user.userName)
      saveSysKnowledge(this.checkData)
        .then((res) => {
          if (res.success) {
            this.$message.success('保存成功')
            this.$router.go(-1)
          } else {
            this.$message.error('保存失败：' + res.message)
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    goBack() {
      window.history.back()
    },
  },
  mounted() {
    this.checkData = JSON.parse(this.$route.query.recordStr)
    var editor = new E('#div1')

    editor.config.height = 600
    editor.config.pasteFilterStyle = false
    console.log('editor', editor)
    console.log('editorconfig', editor.config)
    editor.config.onchange = (html) => {
      this.checkData.content = html
    }
    // 默认情况下，显示所有菜单
    editor.config.menus = [
      'head',
      'bold',
      'fontSize',
      'fontName',
      'italic',
      'underline',
      'strikeThrough',
      'indent',
      'lineHeight',
      'foreColor',
      'backColor',
      'link',
      'list',
      'todo',
      'justify',
      'quote',
      // 'emoticon',
      'image',
      // 'video',
      'table',
      'code',
      'splitLine',
      'undo',
      'redo',
    ]
    // 配置 server 接口地址
    editor.config.uploadFileName = 'file'
    editor.config.uploadImgServer = '/api/contentapi/fileUpload/uploadImgFileForEdit'

    //教育文章先不支持视频，所以注释
    // editor.config.uploadVideoName = 'file'
    // editor.config.uploadVideoServer = '/api/contentapi/fileUpload/uploadVideoFileForEdit'

    editor.create()
    editor.txt.html(this.checkData.content)
    document.title = '编辑问题'
  },
}
</script>

<style lang="less">
.ant-select-dropdown {
  z-index: 20000;
}
.div-check {
  background-color: white;
  padding: 0 15% 0 5%;
  // padding: 0 15%;

  .top-btn {
    margin-left: 47%;
    float: right;
    margin-top: 20px;
  }

  .div-divider {
    margin-top: 3%;
    margin-left: 10%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1px;
  }
  .div-part {
    width: 100%;
    height: 100%;

    // border-bottom: 1px solid #e6e6e6;
    background-color: white;
    overflow: hidden;
    padding: 1.5%;

    .p-part-title {
      margin-top: 20px;
      height: 18px;
      font-size: 18px;
      text-align: center;
      color: #000;
      font-weight: bold;
    }

    .ant-select {
      width: 42% !important;
      margin-left: 0% !important;
    }

    .ant-input {
      margin-left: 2% !important;
    }

    .ant-calendar-picker {
      margin-left: 3.5%;
    }

    .title-article-pic {
      display: inline-block;
      color: #000;
      text-align: left;
      margin-top: 3%;
      font-size: 14px;
    }

    .div-line-wrap {
      width: 100%;
      overflow: hidden;

      .div-left {
        float: left;
        width: 50%;
        margin-top: 3%;
        overflow: hidden;

        .span-item-name {
          display: inline-block;
          color: #000;
          font-size: 14px;
          text-align: left;
          width: 20%;
        }
        .span-item-value {
          width: 45%;
          color: #333;
          text-align: left;
          padding-left: 0px;
          font-size: 14px;
          display: inline-block;
        }
      }

      .div-right {
        margin-top: 3%;
        width: 50%;
        float: right;
        overflow: hidden;
        .span-item-name {
          display: inline-block;
          color: #000;
          text-align: left;
          font-size: 14px;
          width: 20%;
        }
        .span-item-value {
          width: 45%;
          color: #333;
          font-size: 14px;
          padding-left: 20px;
          text-align: left;
          display: inline-block;
        }
      }

      .div-total-one {
        margin-top: 3%;
        overflow: hidden;
        width: 100%;

        .span-item-name {
          display: inline-block;
          color: #000;
          text-align: left;
          font-size: 14px;
          width: 10%;
        }
        .span-item-value {
          width: 45%;
          color: #333;
          font-size: 14px;
          padding-left: 0px;
          text-align: left;
          display: inline-block;
        }

        .ant-input {
          margin-left: 0.5% !important;
        }

        .ant-select {
          width: 35% !important;
          margin-left: 0% !important;
        }
      }
    }
  }
}
</style>
