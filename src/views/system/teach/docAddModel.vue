<template>
  <a-modal
    :title="articleId == -1 ? '新增文章' : '修改文章'"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-check">
        <div class="div-part">
          <div class="div-line-wrap">
            <div class="div-total-one">
              <span class="span-item-name"><span style="color: red">*</span> 文章标题 :</span>
              <a-input
                v-model="checkData.title"
                class="span-item-value"
                style="display: inline-block; width: 300px"
                allow-clear
                placeholder="请输入文章名称 "
              />
            </div>
          </div>
          <div class="div-line-wrap">
            <div class="div-total-one">
              <span class="span-item-name"><span style="color: red">*</span> 所属类别 :</span>
              <a-select v-model="checkData.categoryId" @select="onSelectType" allow-clear placeholder="请选择类别">
                <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.id">{{
                  item.categoryName
                }}</a-select-option>
              </a-select>
            </div>
          </div>
          <div class="div-line-wrap">
            <div class="div-total-one">
              <span class="span-item-name"><span style="color: red">*</span> 所属科室 :</span>
              <a-select
              style="height: 30px !important;"
                show-search
                :filter-option="false"
                :not-found-content="fetching ? undefined : null"
                v-model="checkData.departmentId"
                allow-clear
                placeholder="请选择科室"
                @change="onDepartmentSelectChange"
                @search="onDepartmentSelectSearch"
              >
                <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                <a-select-option v-for="(item, index) in ksTypeData" :key="index" :value="item.department_id">{{
                  item.department_name
                }}</a-select-option>
              </a-select>
            </div>
          </div>
          <!-- <div class="div-line-wrap">
            <div class="div-left">
              <span class="span-item-name"><span style="color: red">*</span>所属类别 :</span>
              <a-select v-model="checkData.categoryId" allow-clear placeholder="请选择类别">
                <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.id">{{
                  item.categoryName
                }}</a-select-option>
              </a-select>
            </div>
            <div class="div-right">
              <span class="span-item-name"><span style="color: red">*</span>所属科室 :</span>

              <a-select v-model="checkData.departmentId" allow-clear placeholder="请选择科室" @change="handleChangeDept">
                <a-select-option v-for="(item, index) in ksTypeData" :key="index" :value="item.departmentId">{{
                  item.departmentName
                }}</a-select-option>
              </a-select>
            </div>

           
          </div> -->
          <div class="div-line-wrap">
            <div class="div-total-one">
              <span class="span-item-name"><span style="color: red">*</span>摘要说明 :</span>
              <a-input
                v-model="checkData.brief"
                class="span-item-value"
                style="display: inline-block; width: 690px"
                allow-clear
                placeholder="请输入摘要说明 "
              />
            </div>
          </div>

          <!-- <span class="title-article-pic"><span style="color: red">*</span> 图片 :(限定一张,文件大小64kb以下,建议尺寸比例4:3)</span> -->

          <div style="position: absolute; right: 120px; top: 10px">
            <a-upload
              :action="actionUrlCover"
              :multiple="true"
              list-type="picture-card"
              :file-list="fileList"
              :headers="headers"
              accept="image/jpeg,image/png,image/jpg"
              :before-upload="beforeUpload"
              @preview="handlePreview"
              @change="handleChange"
            >
              <div v-if="fileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传封面图片</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel2">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>

          <!-- <div class="div-line-wrap">
            <div class="div-total-one" style="margin-top: 0px">
              <span class="span-item-name"><span style="color: red">*</span>文章内容 :</span>
            </div>
          </div> -->
          <span class="title-article-pic"><span style="color: red">*</span> 文章内容 :</span>
          <div id="div11" style="margin-top: 10px"></div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import {
  getArticleByIdNew,
  modifyArticle,
  getDepartmentListForSelect,
  getDiseases,
  saveArticleWeixin,
  getArticleCategoryList,
  addArticle,
} from '@/api/modular/system/posManage'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { appId } from '@/utils/util'

import E from 'wangeditor'

export default {
  components: {},
  data() {
    return {
      previewVisible: false,
      fetching: false,
      visible: false,
      confirmLoading: false,
      articleId: -1,
      // 高级搜索 展开/关闭
      advanced: false,
      checkData: {
        title: '',
        brief: '', //描述
        departmentName: '', //科室名称
        departmentId: '', //科室
        categoryId: '', //类别
        imgPath: '', //图片
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
      actionUrlCover: '/api/content-api/fileUpload/uploadImgFile',
      fileList: [],
    
      previewImage: '',
      diseaseData: [],
      typeData: [],
      selectedRowKeys: [],
      selectedRows: [],

      chooseDeptItem: {},
      ksTypeDataTemp: [],
      headers: {
        Authorization: '',
      },

      editor: {},
    }
  },
  created() {
    this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
  },
  methods: {
    clearData() {
      this.articleId = -1
      this.record = {}
      ;(this.checkData = {
        title: '',
        brief: '', //描述
        departmentName: '', //科室名称
        departmentId: '', //科室
        categoryId: '', //类别
        imgPath: '', //图片
        content: '', //内容
      }),
        (this.fileList = [])
      if (this.editor && this.editor.txt) {
        this.editor.txt.html('')
      }
    },
    //新增
    addModel() {
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.getDepartmentSelectList(undefined)
      this.getArticleCategoryListOut()
      this.$nextTick(() => {
        this.init()
      })
    },
    //修改
    editModel(articleId) {
      this.clearData()
      this.visible = true
      this.confirmLoading = true
      this.articleId = articleId
      this.getDepartmentSelectList(undefined)
      this.getArticleCategoryListOut()
      this.$nextTick(() => {
        this.init()

        getArticleByIdNew(this.articleId).then((res) => {
          if (res.code == 0) {
            res.data.departmentId = Number(res.data.departmentId)
            res.data.categoryId = Number(res.data.categoryId)
            res.data.imgPath = res.data.previewUrl
            this.checkData = res.data

            this.fileList.push({
              uid: '-1',
              name: '封面',
              status: 'done',
              url: res.data.previewUrl,
            })
            this.editor.txt.html(res.data.content)
          } else {
            this.$message.error('获取失败：' + res.message)
          }
          this.confirmLoading = false
        })
      })
    },

    //获取管理的科室 可首拼
    getDepartmentSelectList(departmentName) {
      this.fetching = true
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getDepartmentListForSelect(departmentName, undefined).then((res) => {
        this.fetching = false
        if (res.code == 0) {
          this.ksTypeData = res.data.records
        }
      })
    },
    //科室搜索
    onDepartmentSelectSearch(value) {
      this.ksTypeData = []
      this.getDepartmentSelectList(value)
    },
    //科室选择变化
    onDepartmentSelectChange(value) {
      if (value === undefined) {
        this.ksTypeData = []
        this.getDepartmentSelectList(undefined)
      }
      // this.$refs.table.refresh(true)
    },

    goBack() {
      window.history.back()
    },
    handleCancel2() {
      this.previewVisible = false
    },
    handleCancel() {
      this.visible = false
    },
    handleChangeDept(code) {
      this.getDiseasesOut(code)
    },


    onSelect(departmentId) {
      //选择类别
      this.checkData.categoryId = departmentId
      this.chooseDeptItem = this.ksTypeData.find((item) => item.departmentId == departmentId)
      this.getDiseasesOut(departmentId)
    },

    onSelectType(typeId){
      console.log('oooooooooo',typeId)
      Vue.ls.set('cache_article_type', typeId)
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
      this.fileList = changeObj.fileList
      console.log(this.fileList)
      if (this.fileList.length == 0) {
        this.checkData.imgPath = ''
      } else {
        console.log(this.fileList[0])
        if (this.fileList[0].response) {
          this.checkData.imgPath = this.fileList[0].response.data.fileLinkUrl
        } else {
          this.checkData.imgPath = ''
        }
      }
      // if (changeObj.file.status == 'done' && changeObj.file.response.code != 0) {
      //   this.$message.error(changeObj.file.response.message)
      //   changeObj.fileList.pop()
      //   this.fileList = changeObj.fileList
      // } else {
      //   this.fileList = changeObj.fileList
      //   console.log(this.fileList)
      //   if(this.fileList.length==0){
      //   this.checkData.imgPath = ''
      // }else{
      //   console.log(this.fileList[0])
      //   this.checkData.imgPath = this.fileList[0].response.data.fileLinkUrl
      // }
      // }
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!isJpgOrPng) {
        this.$message.error('请选择正确的图片格式')
        this.fileList = []
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小不能超过2M')
        return false
      }
      return true
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
    //分类列表
    getArticleCategoryListOut() {
      getArticleCategoryList({ pageNo: 1, pageSize: 10000,own: "doctor" }).then((res) => {
        if (res.code == 0) {
          this.typeData = res.data.records
          //记住文章选项
          let cacheType = Vue.ls.get('cache_article_type')
          let getOne = this.typeData.find((item) => item.id == cacheType)
          if (cacheType && getOne) {
            this.checkData.categoryId = cacheType
          }

          // this.checkData.categoryId = this.typeData[0].id
        } else {
          this.$message.error('获取失败：' + res.message)
        }
      })
    },
    handleSubmit() {
      console.log('goConfirmCheckData', this.checkData)
      if (!this.checkData.title) {
        this.$message.error('请填写标题')
        return
      }

      if (!this.checkData.categoryId) {
        this.$message.error('请选择类别')
        return
      }
      if (!this.checkData.departmentId) {
        this.$message.error('请选择科室')
        return
      }
      if (!this.checkData.brief) {
        this.$message.error('请填写描述')
        return
      }

      //组装图片
      if (!this.checkData.imgPath) {
        this.$message.error('请上传图片！')
        return
      }

      if (!this.checkData.content) {
        this.$message.error('请编辑内容')
        return
      }

      this.ksTypeData.forEach((item) => {
        if (this.checkData.departmentId == item.departmentId) this.checkData.departmentName = item.departmentName
      })

      var postdata = {
        title: this.checkData.title,
        brief: this.checkData.brief, //描述
        departmentName: this.checkData.departmentName, //科室名称
        departmentId: this.checkData.departmentId, //科室
        categoryId: this.checkData.categoryId, //类别
        imgPath: this.checkData.imgPath, //图片
        content: this.checkData.content, //内容
        own: "doctor"
      }

      //todo

      this.confirmLoading = true

      if (this.articleId == -1) {
        let user = Vue.ls.get(TRUE_USER)
        // this.checkData.publisherName = user.userName
        // this.checkData.source = 'weixin'
        // this.checkData.publisherUserId = user.userId
        //作者，只有新增的时候才传的字段
        postdata.author = user.userName

        addArticle(postdata).then((res) => {
          if (res.code == 0) {
            this.$message.success('新增成功！')
            this.visible = false
            this.$emit('ok', '')
          } else {
            this.$message.error(res.message)
          }
          this.confirmLoading = false
        })
      } else {
        postdata.id = this.articleId
        modifyArticle(postdata).then((res) => {
          if (res.code == 0) {
            this.$message.success('修改成功！')
            this.visible = false
            this.$emit('ok', '')
          } else {
            this.$message.error(res.message)
          }
          this.confirmLoading = false
        })
      }
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

    init() {
      if (this.editor.isEnable) {
        return
      }
      var editor = new E('#div11')

      editor.config.height = 430
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
      editor.config.uploadImgServer = '/api/content-api/fileUpload/uploadImgFileForEdit'
      // editor.config.uploadImgServer = '/api/wx-api/health/wx/' + appId + '/uploadInnerImg'

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
      this.editor = editor
    },
  },
}
</script>
<style lang="less" scoped>
.ant-select-dropdown {
  z-index: 20000;
}
.div-check {
  background-color: white;
  padding: 0;
  position: relative;
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
    padding: 0;

    .p-part-title {
      margin-top: 20px;
      height: 18px;
      font-size: 14px;
      text-align: center;
      color: #000;
      font-weight: bold;
    }

    .ant-select {
      width: 42% !important;
      margin-left: 0% !important;
    }

    .ant-calendar-picker {
      margin-left: 3.5%;
    }

    .title-article-pic {
      display: inline-block;
      color: #000;
      text-align: left;
      margin-top: 10px;
      font-size: 12px;
    }

    .div-line-wrap {
      width: 100%;
      overflow: hidden;

      .div-left {
        float: left;
        width: 50%;
        margin-top: 10px;
        overflow: hidden;
        padding-right: 10px;

        .span-item-name {
          display: inline-block;
          color: #000;
          font-size: 12px;
          text-align: left;
          width: 70px;
        }
        .span-item-value {
          width: 300px;
          color: #333;
          text-align: left;
          padding-left: 0px;
          font-size: 12px;
          display: inline-block;
        }
        .ant-select {
          width: 300px !important;
          font-size: 12px !important;
        }
      }

      .div-right {
        margin-top: 10px;
        width: 50%;
        padding-left: 10px;
        float: right;
        overflow: hidden;
        .span-item-name {
          display: inline-block;
          color: #000;
          text-align: left;
          font-size: 12px;
          width: 70px;
        }
        .span-item-value {
          width: 45%;
          color: #333;
          font-size: 12px;
          padding-left: 20px;
          text-align: left;
          display: inline-block;
        }
        .ant-select {
          width: 300px !important;
          font-size: 12px !important;
        }
      }

      .div-total-one {
        margin-top: 10px;
        // overflow: hidden;
        width: 100%;

        .span-item-name {
          display: inline-block;
          color: #000;
          text-align: left;
          font-size: 12px;
          width: 70px;
        }
        .span-item-value {
          width: 45%;
          color: #333;
          font-size: 12px;
          padding-left: 0px;
          text-align: left;
          display: inline-block;
        }

        .ant-input {
          width: 300px !important;
        }

        .ant-select {
          width: 300px !important;
        }
      }
    }
  }
}
</style>
