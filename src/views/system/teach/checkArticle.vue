<template>
  <div class="div-check-article">
    <div class="div-part">
      <div class="div-line-wrap">
        <div class="div-total-one">
          <span class="span-item-name">{{ checkData.title }}</span>
        </div>
      </div>

      <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name">所属科室 :{{ checkData.categoryName }}</span>
        </div>
        <div class="div-left">
          <span class="span-item-name">所属病种 :{{ checkData.articleType }}</span>
        </div>

        <div class="div-left">
          <span class="span-item-name">创建作者 :{{ checkData.publisherName }}</span>
        </div>
        <div class="div-left">
          <span class="span-item-name">创建时间 :{{ checkData.createTime }}</span>
        </div>
      </div>
      <!-- <div class="div-line-wrap">
        <div class="div-left">
          <span class="span-item-name">图片 :</span>
        </div>
        <div class="div-left" v-show="false">
          <span class="span-item-name">所属病种 :{{ checkData.articleType }}</span>
        </div>

        <div class="div-left" v-show="false">
          <span class="span-item-name">创建作者 :{{ checkData.author }}</span>
        </div>
        <div class="div-left" v-show="false">
          <span class="span-item-name">创建时间 :{{ checkData.createTime }}</span>
        </div>
      </div> -->

      <span class="title-article-pic">图片 :</span>

      <div class="clearfix" style="margin-top: 20px; margin-left: 7%">
        <a-upload
          disabled
          :action="actionUrl"
          :multiple="true"
          list-type="picture-card"
          :file-list="fileList"
          @preview="handlePreview"
          @change="handleChange"
        >
          <div v-if="fileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </div>
    </div>

    <div id="myHtml" style="margin-left: 8%"></div>

    <div style="height: 50px; backgroud-color: white" />
  </div>
</template>


<script type="text/javascript">
import { STable } from '@/components'
import { saveArticle, getArticleById } from '@/api/modular/system/posManage'

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

      ksTypeData: [{ code: 36, value: '骨科' }],
      zbTypeData: [
        { code: 1, value: '专病1' },
        { code: 2, value: '专病2' },
        { code: 3, value: '专病3' },
      ],

      keshiData: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getAllArticles(Object.assign(parameter, this.queryParam)).then((res) => {
          return res.data
        })
      },
      actionUrl: '/api/contentapi/fileUpload/uploadImgFile',
      fileList: [],
      previewVisible: false,
      previewImage: '',
      selectedRowKeys: [],
      selectedRows: [],
      articleData: {},
    }
  },

  created() {
    // var articleId = this.$route.params.articleId
    this.articleData = JSON.parse(this.$route.query.recordStr)
    let articleId = this.articleData.articleId
    console.log(articleId)
    if (articleId) {
      getArticleById(articleId).then((res) => {
        if (res.code == 0) {
          this.checkData = res.data

          //  var h= <meta http-equiv="Access-Control-Allow-Origin" content="*" />
          document.getElementById('myHtml').innerHTML = res.data.content
          this.fileList.push({
            uid: '-1',
            name: '封面',
            status: 'done',
            url: this.checkData.previewUrl,
          })
        } else {
          this.$message.error('获取失败：' + res.message)
        }
      })
    }
  },

  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced
    },

    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },

    handleChange({ fileList }) {
      this.fileList = fileList
      if (this.fileList.length > 1) {
        let newData = this.fileList[0]
        this.fileList = [newData]
      }
    },

    handleCancel() {
      this.previewVisible = false
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

    getKeShi() {
      getKeShiData({ hospitalCode: '444885559' })
        .then((res) => {
          if (res.success) {
            let newData = []
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].departmentList && res.data[i].departmentList.length > 0) {
                newData = newData.concat(res.data[i].departmentList)
              }
            }
            this.keshiData = newData
          } else {
            // this.$message.error('切换失败：' + res.message)
          }
        })
        .catch((err) => {
          // this.$message.error('切换错误：' + err.message)
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
  mounted() {},
}
</script>

<style lang="less">
.div-check-article {
  background-color: white;
  padding: 0 15% 0 5%;
  // padding: 0 15%;

  #myHtml {
    word-wrap: break-word;
    word-break: break-all;
  }

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
      margin-left: 7%;
      font-size: 14px;
    }

    .div-line-wrap {
      width: 100%;
      overflow: hidden;

      .div-left {
        float: left;
        width: 25%;
        margin-top: 3%;
        overflow: hidden;

        .span-item-name {
          display: inline-block;
          color: #000;
          font-size: 14px;
          text-align: center;
          width: 100%;
        }
      }

      .div-right {
        margin-top: 3%;
        width: 25%;
        float: right;
        overflow: hidden;
        .span-item-name {
          display: inline-block;
          color: #000;
          text-align: left;
          font-size: 14px;
          width: 100%;
        }
      }

      .div-total-one {
        margin-top: 3%;
        overflow: hidden;
        width: 100%;

        .span-item-name {
          display: inline-block;
          color: #000;
          text-align: center;
          font-size: 24px;
          width: 100%;
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
