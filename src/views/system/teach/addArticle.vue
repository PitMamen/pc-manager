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
          <div class="global-search-wrapper" style="width: 300px; display: inline-block">
            <a-auto-complete
              class="global-search"
              v-model="checkData.categoryName"
              size="large"
              style="width: 100%; font-size: 14px"
              placeholder="请输入并选择"
              option-label-prop="title"
              show-search
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @select="onSelect"
              @search="handleSearch"
            >
              <template slot="dataSource">
                <a-select-option
                  v-for="item in ksTypeDataTemp"
                  :key="item.departmentId + ''"
                  :title="item.departmentName"
                >
                  {{ item.departmentName }}
                </a-select-option>
              </template>
            </a-auto-complete>
          </div>

          <!-- <a-select v-model="checkData.categoryId" allow-clear placeholder="请选择科室" @change="handleChangeDept">
            <a-select-option v-for="(item, index) in ksTypeData" :key="index" :value="item.departmentId">{{
              item.departmentName
            }}</a-select-option>
          </a-select> -->
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

      <span class="title-article-pic"
        ><span style="color: red">*</span> 图片 :（限定一张，文件大小64kb以下，建议尺寸比例4：3）</span
      >
      <!-- <div :key="ImgKey" style="margin-top: 1%"> -->
      <div class="clearfix" style="margin-top: 20px">
        <a-upload
          :action="actionUrlCover"
          :multiple="true"
          list-type="picture-card"
          :file-list="fileList"
          :headers="headers"
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
import { saveArticle, getArticleById, getDepts, getDiseases, saveArticleWeixin } from '@/api/modular/system/posManage'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { appId } from '@/utils/util'

import E from 'wangeditor'

export default {
  components: {},

  data() {
    return {
      // 高级搜索 展开/关闭
      fetching: false,
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
      actionUrlCover: '/api/content-api/fileUpload/uploadImgFileForWX',
      fileList: [],
      previewVisible: false,
      previewImage: '',
      diseaseData: [],
      selectedRowKeys: [],
      selectedRows: [],

      chooseDeptItem: {},
      ksTypeDataTemp: [],
      headers: {
        Authorization: '',
      },
    }
  },

  created() {
    this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
    this.fetching = true
    getDepts().then((res) => {
      this.fetching = false
      if (res.code == 0) {
        this.ksTypeData = res.data
        this.ksTypeDataTemp = JSON.parse(JSON.stringify(this.ksTypeData))
      }
    })
  },

  methods: {
    handleChangeDept(code) {
      this.getDiseasesOut(code)
    },

    /**
     *autoComplete回调，本地模拟的数据处理
     */
    handleSearch(inputName) {
      if (inputName) {
        this.ksTypeDataTemp = this.ksTypeData.filter((item) => item.departmentName.indexOf(inputName) != -1)
      } else {
        this.ksTypeDataTemp = JSON.parse(JSON.stringify(this.ksTypeData))
      }
    },

    onSelect(departmentId) {
      //选择类别
      this.checkData.categoryId = departmentId
      this.chooseDeptItem = this.ksTypeData.find((item) => item.departmentId == departmentId)
      this.getDiseasesOut(departmentId)
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

    // handleChange({ fileList }) {
    //   this.fileList = fileList
    //   if (this.fileList.length > 1) {
    //     let newData = this.fileList[0]
    //     this.fileList = [newData]
    //   }
    // },

    handleChange(changeObj) {
      if (changeObj.file.status == 'done' && changeObj.file.response.code != 0) {
        this.$message.error(changeObj.file.response.message)
        changeObj.fileList.pop()
        this.fileList = changeObj.fileList
      } else {
        this.fileList = changeObj.fileList
      }
    },

    handleCancel() {
      this.previewVisible = false
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
      console.log('goConfirmCheckData', this.checkData)
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

      //组装图片
      if (this.fileList.length == 0) {
        this.$message.error('请上传图片！')
        return
      } else {
        this.checkData.extraData = this.fileList[0].response.data.mediaId
        this.checkData.previewUrl = this.fileList[0].response.data.url
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
      this.checkData.source = 'weixin'
      this.checkData.publisherUserId = user.userId
      //作者，只有新增的时候才传的字段
      this.checkData.author = user.userName

      //contentSourceUrl、digest、url不管
      let articleList = [
        {
          thumbMediaId: this.checkData.extraData,
          author: this.checkData.publisherName,
          title: this.checkData.title,
          content: this.checkData.content,
          showCoverPic: 0,
          needOpenComment: 0,
          onlyFansCanComment: 0,
        },
      ]
      saveArticleWeixin(articleList).then((res) => {
        if (res.code == 0) {
          // this.$message.success('保存成功')
          // this.$router.go(-1)
          // this.checkData.templateId = res.data.data
          this.$set(this.checkData, 'templateId', res.data)
          saveArticle(this.checkData).then((res) => {
            if (res.code == 0) {
              this.$message.success('保存成功')
              this.$router.go(-1)
            } else {
              this.$message.error(res.message)
            }
          })
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
      'video',
      'table',
      'code',
      'splitLine',
      'undo',
      'redo',
    ]

    editor.config.uploadImgHeaders = {
      Authorization: Vue.ls.get(ACCESS_TOKEN),
    }

    // 配置 server 接口地址
    editor.config.uploadFileName = 'file'
    // editor.config.uploadImgServer = '/api/content-api/fileUpload/uploadImgFileForEdit'
    editor.config.uploadImgServer = '/api/wx-api/health/wx/' + appId + '/uploadInnerImg'

    // editor.config.showLinkVideo = false

    //教育文章先不支持视频，所以注释
    editor.config.uploadVideoName = 'file'
    editor.config.uploadVideoServer = '/api/content-api/fileUpload/uploadVideoFileForEdit'
    editor.config.uploadVideoHeaders = {
      Authorization: Vue.ls.get(ACCESS_TOKEN),
    }

    /**
     * 插入视频写法：
     *
     * <iframe frameborder="0" src="https://v.qq.com/txp/iframe/player.html?vid=n0020yrnly7" allowFullScreen="true"></iframe>
     * <iframe frameborder="0" src="https://vd3.bdstatic.com/mda-nit9wfd413e2xjsh/sc/cae_h264/1664351398486048214/mda-nit9wfd413e2xjsh.mp4?v_from_s=hkapp-haokan-hbf&auth_key=1664420478-0-0-ee34ef2d3450dbb1901bde7ab5ebd63b&bcevod_channel=searchbox_feed&pd=1&cd=0&pt=3&logid=1878163596&vid=7560524968628684931&abtest=104960_1-104959_1&klogid=1878163596" allowFullScreen="true"></iframe>
     *
     */

    editor.create()

    var articleId = this.$route.params.articleId
    if (this.$route.params.articleId) {
      document.title = '修改教育文章'
    } else {
      document.title = '新增教育文章'
    }
    console.log('articleId', articleId)
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
