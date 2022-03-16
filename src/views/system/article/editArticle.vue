<template>
  <div class="div-check">
    <div class="div-part">
      <div class="div-line-wrap">
        <div class="div-total-one">
          <span class="span-item-name"><span style="color: red">*</span> 文章标题 :</span>
          <a-input
            v-model="checkData.title"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请输入文章名称 "
          />
        </div>
      </div>

      <div class="div-line-wrap">
        <div class="div-total-one">
          <span class="span-item-name"><span style="color: red">*</span>摘要说明 :</span>
          <a-input
            v-model="checkData.brief"
            class="span-item-value"
            style="display: inline-block"
            allow-clear
            placeholder="请输入摘要说明 "
          />
        </div>
      </div>
      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name"><span style="color: red">*</span>所属科室 :</span>
          <a-select v-model="checkData.categoryId" allow-clear placeholder="请选择科室" @change="handleChange">
            <a-select-option v-for="(item, index) in ksTypeData" :key="index" :value="item.departmentId">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
        </div>

        <div class="div-right">
          <span class="span-item-name"><span style="color: red">*</span>所属病种 :</span>
          <a-select v-model="checkData.articleType" allow-clear placeholder="请选择病种">
            <a-select-option v-for="(item, index) in diseaseData" :key="index" :value="item.diseaseName">{{
              item.diseaseName
            }}</a-select-option>
          </a-select>
        </div>
      </div>

      <!-- <div class="div-line-wrap">
        <div class="div-total-one">
          <span class="span-item-name" style="width: 100%;"><span style="color: red">*</span>上传文章头像 :  </span>
        </div>
        <div :key="ImgKey">
            <a-upload name="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"   :multiple="false" :action="actionUrl" :headers="headers" @change="handleChange">
              <a-input
                v-decorator="['fileId', { rules: [{ required: true, message: '请上传图片！' }] }]"
                style="display: none"
              />
              <a-button> <a-icon type="upload" /> 选择文件 </a-button>
            </a-upload>
          </div>
      </div> -->

      <div class="div-line-wrap">
        <div class="div-total-one">
          <span class="span-item-name"><span style="color: red">*</span>文章内容 :</span>
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
import { STable } from '@/components'
import { saveArticle, getArticleById, getDepts, getDiseases } from '@/api/modular/system/posManage'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'

import E from 'wangeditor'

export default {
  components: {},

  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      checkData: {
        title: '',
        brief: '', //描述
        categoryName: '', //科室名称
        categoryId: '', //科室代码
        articleType: '', //专病
        content: '', //内容
      },

      ksTypeData: [],

      keshiData: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getAllArticles(Object.assign(parameter, this.queryParam)).then((res) => {
          return res.data
        })
      },
      diseaseData: [],
      selectedRowKeys: [],
      selectedRows: [],
    }
  },

  created() {
    //获取科室列表
    // queryDepartment('444885559').then((res) => {
    //   if (res.code == 0) {
    //     this.ksTypeData = res.data
    //   } else {
    //     this.$message.error('获取科室列表失败：' + res.message)
    //   }
    // })

    getDepts().then((res) => {
      if (res.code == 0) {
        this.ksTypeData = res.data
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
  },

  methods: {
    handleChange(code) {
      this.getDiseasesOut(code)
    },

    getDiseasesOut(departmentId) {
      getDiseases({ departmentId: departmentId }).then((res) => {
        if (res.code == 0) {
          this.diseaseData = res.data
        } else {
          this.$message.error('获取专病列表失败：' + res.message)
        }
      })
    },

    goConfirm() {
      console.log(this.checkData)
      if (!this.checkData.title) {
        this.$message.error('请填写标题')
        return
      }
      if (!this.checkData.brief) {
        this.$message.error('请填写描述')
        return
      }
      if (!this.checkData.categoryId) {
        this.$message.error('请选择科室')
        return
      }
      if (!this.checkData.articleType) {
        this.$message.error('请选择专病')
        return
      }
      if (!this.checkData.content) {
        this.$message.error('请编辑内容')
        return
      }

      this.ksTypeData.forEach((item) => {
        if (this.checkData.categoryId == item.departmentId) this.checkData.categoryName = item.departmentName
      })

      //todo 写死的
      let user = Vue.ls.get(TRUE_USER)
      this.checkData.publisherName = user.userName
      this.checkData.publisherUserId = user.userId
      saveArticle(this.checkData).then((res) => {
        if (res.code == 0) {
          this.$message.success('保存成功')
          this.$router.go(-1)
        } else {
          this.$message.error(res.message)
        }
      })
    },

    goBack() {
      window.history.back()
    },

    handleStatus(record) {
      record.activeFlag = record.activeFlag == 1 || record.activeFlag == null ? 0 : 1
      changeStatus(record)
        .then((res) => {
          if (res.success) {
            this.$message.success('切换成功')
            this.$refs.table.refresh()
          } else {
            this.$message.error('切换失败：' + res.message)
          }
        })
        .catch((err) => {
          this.$message.error('切换错误：' + err.message)
        })
    },

    goHistoryDetail() {
      window.open(
        'http://www.mclouds.org.cn:30000/patient-view.html?token=eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwMTk4IiwiZXhwIjoxNjQwODY2NjQxfQ.p8rozkAXsPzdBDeAkck3NjUI7iBYWM_4UA4A22rlbElPNYiZMthDnLQ0jhJIk8CpnRJEPfoi11Fybs2bajSb2hnGpVegVqTae_fxc30qL4sXPVPpvG_88ehhylBDtetVXpvJkkETQXq5ZWSfaItrBGZqr0r2NwPJIon6gy-NKditLhu8T7RPYj65qVsh7mX6gr-rhfnC9Ol4gRHjAyxiKm33M_sCn3ELMhDchjHrjE8WfllrT1mfaiP7kB4eDas9FB2D3zpAEb3EWHHdweQIsY8DTidslqjN-OkpjJsnXfahRoHEeiWiagkNzAhNM3-zcsQykvmrVzab2u_PhG-u3g&no=000006392145&type=9',
        '_blank'
      )
    },

    onChange() {},

    handleOk() {
      this.$refs.table.refresh()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
  },
  mounted() {
    var editor = new E('#div1')

    editor.config.height = 600
    editor.config.pasteFilterStyle = false
    console.log('editor', editor)
    console.log('editorconfig', editor.config)
    editor.config.onchange = (html) => {
      this.checkData.content = html
    }
    // 配置 server 接口地址
    editor.config.uploadFileName = 'file'
    editor.config.uploadImgServer = '/api/contentapi/fileUpload/uploadImgFileForEdit'

    editor.config.uploadVideoName = 'file'
    editor.config.uploadVideoServer = '/api/contentapi/fileUpload/uploadVideoFileForEdit'

    editor.create()

    var articleId = this.$route.params.articleId
    if (this.$route.params.articleId) {
      document.title = '修改文章'
    } else {
      document.title = '新增文章'
    }
    console.log(articleId)
    if (articleId) {
      getArticleById(articleId).then((res) => {
        if (res.code == 0) {
          this.checkData = res.data
          this.checkData.categoryId = parseInt(this.checkData.categoryId)
          editor.txt.html(res.data.content)
          this.getDiseasesOut(this.checkData.categoryId)
        } else {
          this.$message.error('获取失败：' + res.message)
        }
      })
    }
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
