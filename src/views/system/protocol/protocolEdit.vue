<template>
  <a-spin :spinning="confirmLoading">
    <div class="wrap-pro">
      <div class="wrap-btn">
        <div class="btn-item" @click="goSave">
          <img style="width: 13px; height: 13px; margin-right: 7px" src="~@/assets/icons/baocun_not.png" />
          <div>保存发布</div>
        </div>
        <div class="btn-item2" @click="goUpload">
          <img style="width: 14px; height: 14px; margin-right: 7px" src="~@/assets/icons/yun.png" />
          <div>上传平台</div>
        </div>
        <div class="btn-item2" @click="goDownload">
          <img style="width: 12px; height: 12px; margin-right: 7px" src="~@/assets/icons/xiazai.png" />
          <div>下载文件</div>
        </div>
      </div>

      <div style="width: 100%; height: 1px; background-color: #e6e6e6; margin-top: 10px"></div>

      <div class="wrap-rich" style="margin-top: 10px" :id="'richId' + protocolType"></div>
    </div>
  </a-spin>
</template>


<script>
import E from 'wangeditor'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { getContract, saveContract, downloadPdfContract, reportPdfContract } from '@/api/modular/system/posManage'
import { appId } from '@/utils/util'

export default {
  props: {
    protocolType: {
      type: String,
      default: '1',
    },
  },
  data() {
    return {
      confirmLoading: false,
      isSaved: false,
      deptId: '',
      editor: {},
      content: '',
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
    // let id = 'richId' + this.protocolType
    // var editor = new E(`#${id}`)

    // editor.config.height = 600
    // editor.config.pasteFilterStyle = false
    // console.log('editor', editor)
    // console.log('editorconfig', editor.config)
    // editor.config.onchange = (html) => {
    //   this.content = html
    // }
    // // 配置 server 接口地址
    // // 默认情况下，显示所有菜单
    // editor.config.menus = [
    //   'head',
    //   'bold',
    //   'fontSize',
    //   'fontName',
    //   'italic',
    //   'underline',
    //   'strikeThrough',
    //   'indent',
    //   'lineHeight',
    //   'foreColor',
    //   'backColor',
    //   'link',
    //   'list',
    //   'todo',
    //   'justify',
    //   'quote',
    //   'image',
    //   // 'emoticon',
    //   // 'video',
    //   'table',
    //   'code',
    //   'splitLine',
    //   'undo',
    //   'redo',
    // ]

    // editor.config.uploadImgHeaders = {
    //   Authorization: Vue.ls.get(ACCESS_TOKEN),
    // }

    // // 配置 server 接口地址
    // // editor.config.uploadFileName = 'file'
    // // editor.config.uploadImgServer = '/api/wx-api/health/wx/' + appId + '/uploadInnerImg'
    // editor.config.uploadFileName = 'file'
    // editor.config.uploadImgServer = '/api/content-api/fileUpload/uploadImgFileForEdit'

    // // editor.config.showLinkVideo = false

    // //教育文章先不支持视频，所以注释
    // editor.config.uploadVideoName = 'file'
    // editor.config.uploadVideoServer = '/api/content-api/fileUpload/uploadVideoFileForEdit'
    // editor.config.uploadVideoHeaders = {
    //   Authorization: Vue.ls.get(ACCESS_TOKEN),
    // }

    // console.log('rrr-----------------', editor.config.menus)

    // editor.create()
    // this.editor = editor
  },


  methods: {
    //初始化方法
    edit(record) {},

    init() {
      if (this.editor.isEnable) {
        return
      }

      let id = 'richId' + this.protocolType
      var editor = new E(`#${id}`)
      // var editor = new E('#div11')

      editor.config.height = 600
      editor.config.pasteFilterStyle = false
      console.log('editor', editor)
      console.log('editorconfig', editor.config)
      editor.config.onchange = (html) => {
        // this.checkData.content = html
        this.content = html
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

    refreshData(deptId) {
      this.deptId = deptId
      this.getContractOut()
      //TODO 更新协议内容
      console.log('ddd', this.protocolType)
      console.log('fff', this.deptId)
    },

    getContractOut() {
      let queryData = {
        hospitalCode: this.deptId,
        categoryId: this.protocolType,
      }
      getContract(queryData)
        .then((res) => {
          // if (res.code == 0 && res.data.content) {
          // debugger
          if (res.code == 0) {
            if (res.data.content == null || res.data.content == '') {
              this.editor.txt.clear()
              this.content = ''
            } else {
              this.editor.txt.html(res.data.content)
              this.isSaved = true
              this.content = res.data.content
            }
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },
    goSave() {
      let queryData = {
        hospitalCode: this.deptId,
        categoryId: this.protocolType,
        content: this.content,
      }
      saveContract(queryData)
        .then((res) => {
          if (res.code == 0) {
            this.isSaved = true
            this.$message.success('保存成功')
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    goDownload() {
      if (!this.isSaved) {
        this.$message.error('请先保存发布')
        return
      }
      let queryData = {
        hospitalCode: this.deptId,
        categoryId: this.protocolType,
      }
      downloadPdfContract(queryData)
        .then((res) => {
          // TODO 处理下载 this.$message.success('保存成功')
          this.downloadfile(res)
        })
        .catch((err) => {
          this.$message.error('导出错误：' + err.message)
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    downloadfile(res) {
      var blob = new Blob([res.data], { type: 'application/octet-stream;charset=UTF-8' })
      var contentDisposition = res.headers['content-disposition']
      var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
      var result = patt.exec(contentDisposition)
      var filename = result[1]
      var downloadElement = document.createElement('a')
      var href = window.URL.createObjectURL(blob) // 创建下载的链接
      var reg = /^["](.*)["]$/g
      downloadElement.style.display = 'none'
      downloadElement.href = href
      downloadElement.download = decodeURI(filename.replace(reg, '$1')) // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href)
    },

    //上传下载需要先判断是否已保存
    goUpload() {
      if (!this.isSaved) {
        this.$message.error('请先保存发布')
        return
      }
      let queryData = {
        hospitalCode: this.deptId,
        categoryId: this.protocolType,
      }
      reportPdfContract(queryData)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('上传成功')
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },
  },
}
</script>
<style lang="less" scoped>
.wrap-pro {
  .wrap-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 12px;

    .btn-item {
      padding: 9px 12px;
      display: flex;
      margin-right: 10px;
      flex-direction: row;
      align-items: center;
      color: white;
      border: #409eff 1px solid;
      border-radius: 2px;
      background-color: #409eff;

      &:hover {
        cursor: pointer;
      }
    }
    .btn-item2 {
      padding: 9px 12px;
      display: flex;
      flex-direction: row;
      margin-right: 10px;
      align-items: center;
      color: #409eff;
      border: #409eff 1px solid;
      border-radius: 2px;
      background-color: white;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>