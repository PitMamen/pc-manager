<template>
  <a-card :bordered="false">
    <div class="div-tabs">
      <div class="div-tab-item" @click="tabClick('1')">
        <div class="tab-top">
          <img
            style="width: 15px; height: 15px; margin-right: 7px"
            v-if="activeKey == '1'"
            src="~@/assets/icons/shouquan.png"
          />
          <img style="width: 15px; height: 15px; margin-right: 7px" v-else src="~@/assets/icons/shouquan_not.png" />
          <!-- 患者服务授权协议 -->
          <span style="font-size: 14px; color: #4d4d4d" :class="{ active: activeKey == '1' }">
            {{ contractList[0].description }}
          </span>
        </div>
        <div v-show="activeKey == '1'" class="tab-line"></div>
        <div v-show="activeKey != '1'" class="tab-line" style="background-color: white"></div>
      </div>

      <div class="div-tab-item" @click="tabClick('2')">
        <div class="tab-top">
          <img
            style="width: 15px; height: 15px; margin-right: 7px"
            v-if="activeKey == '2'"
            src="~@/assets/icons/huanzhe.png"
          />
          <img style="width: 15px; height: 15px; margin-right: 7px" v-else src="~@/assets/icons/huanzhe_not.png" />
          <!-- 患者服务授权协议 -->
          <span style="font-size: 14px; color: #4d4d4d" :class="{ active: activeKey == '2' }">
            {{ contractList[1].description }}
          </span>
        </div>
        <div v-show="activeKey == '2'" class="tab-line"></div>
        <div v-show="activeKey != '2'" class="tab-line" style="background-color: white"></div>
      </div>

      <div class="div-tab-item" @click="tabClick('3')">
        <div class="tab-top">
          <img
            style="width: 15px; height: 15px; margin-right: 7px"
            v-if="activeKey == '3'"
            src="~@/assets/icons/yisheng.png"
          />
          <img style="width: 15px; height: 15px; margin-right: 7px" v-else src="~@/assets/icons/yisheng_not.png" />
          <!-- 患者服务授权协议 -->
          <span style="font-size: 14px; color: #4d4d4d" :class="{ active: activeKey == '3' }">
            {{ contractList[2].description }}
          </span>
        </div>
        <div v-show="activeKey == '3'" class="tab-line"></div>
        <div v-show="activeKey != '3'" class="tab-line" style="background-color: white"></div>
      </div>
    </div>

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
    </div>
    <div class="div-text">
      <div v-show="activeKey == '1'" class="wrap-rich" style="margin-top: 10px" id="richId1"></div>
      <div v-show="activeKey == '2'" class="wrap-rich" style="margin-top: 10px" id="richId2"></div>
      <div v-show="activeKey == '3'" class="wrap-rich" style="margin-top: 10px" id="richId3"></div>
    </div>
  </a-card>
</template>

<script>
import {
  accessHospitals,
  contractTypes,
  getContract,
  saveContract,
  downloadPdfContract,
  reportPdfContract,
} from '@/api/modular/system/posManage'
import E from 'wangeditor'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'

export default {
  components: {},

  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      activeKey: '1',
      selectedRowKeys: [],
      selectedRows: [],
      groupCodeDictTypeDropDown: [],

      deptId: '',
      treeData: [],
      contractList: [
        { value: '', description: '' },
        { value: '', description: '' },
        { value: '', description: '' },
      ],
      editor1: {},
      editor2: {},
      editor3: {},
      isSaved1: false,
      isSaved2: false,
      isSaved3: false,
      content1: '',
      content2: '',
      content3: '',
    }
  },

  /**
   * 初始化判断按钮权限是否拥有，没有则不现实列
   */
  created() {
    this.contractTypesOut()
  },

  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },

  methods: {
    init() {
      this.initEdit1()
      this.initEdit2()
      this.initEdit3()
    },

    initEdit1() {
      // if (this.editor1.isEnable) {
      //   return
      // }
      let editor = new E('#richId1')

      editor.config.height = 600
      editor.config.pasteFilterStyle = false
      console.log('editor', editor)
      console.log('editorconfig', editor.config)
      editor.config.onchange = (html) => {
        this.content1 = html
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
      this.editor1 = editor
    },
    initEdit2() {
      // if (this.editor2.isEnable) {
      //   return
      // }
      let editor = new E('#richId2')

      editor.config.height = 600
      editor.config.pasteFilterStyle = false
      console.log('editor', editor)
      console.log('editorconfig', editor.config)
      editor.config.onchange = (html) => {
        this.content2 = html
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
      this.editor2 = editor
    },

    initEdit3() {
      // if (this.editor3.isEnable) {
      //   return
      // }
      let editor = new E('#richId3')

      editor.config.height = 600
      editor.config.pasteFilterStyle = false
      console.log('editor', editor)
      console.log('editorconfig', editor.config)
      editor.config.onchange = (html) => {
        this.content3 = html
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
      this.editor3 = editor
    },

    tabClick(tab) {
      this.activeKey = tab
    },
    getContractOut1(protocolType) {
      let queryData = {
        // hospitalCode: this.deptId,
        categoryId: protocolType,
      }
      getContract(queryData)
        .then((res) => {
          // if (res.code == 0 && res.data.content) {
          // debugger
          if (res.code == 0) {
            if (res.data.content == null || res.data.content == '') {
              this.editor1.txt.clear()
              this.content1 = ''
            } else {
              this.editor1.txt.html(res.data.content)
              this.isSaved1 = true
              this.content1 = res.data.content
            }
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },
    getContractOut2(protocolType) {
      let queryData = {
        // hospitalCode: this.deptId,
        categoryId: protocolType,
      }
      getContract(queryData)
        .then((res) => {
          // if (res.code == 0 && res.data.content) {
          // debugger
          if (res.code == 0) {
            if (res.data.content == null || res.data.content == '') {
              this.editor2.txt.clear()
              this.content2 = ''
            } else {
              this.editor2.txt.html(res.data.content)
              this.isSaved2 = true
              this.content2 = res.data.content
            }
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },
    getContractOut3(protocolType) {
      let queryData = {
        // hospitalCode: this.deptId,
        categoryId: protocolType,
      }
      getContract(queryData)
        .then((res) => {
          // if (res.code == 0 && res.data.content) {
          // debugger
          if (res.code == 0) {
            if (res.data.content == null || res.data.content == '') {
              this.editor3.txt.clear()
              this.content3 = ''
            } else {
              this.editor3.txt.html(res.data.content)
              this.isSaved3 = true
              this.content3 = res.data.content
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

    contractTypesOut() {
      contractTypes({})
        .then((res) => {
          if (res.code == 0) {
            this.contractList = res.data
            this.getContractOut1(this.contractList[0].value)
            this.getContractOut2(this.contractList[1].value)
            this.getContractOut3(this.contractList[2].value)
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    // queryHospitalListOut() {
    //   let queryData = {
    //     tenantId: '',
    //     status: 1,
    //     hospitalName: '',
    //   }
    //   accessHospitals(queryData)
    //     .then((res) => {
    //       if (res.code == 0 && res.data.length > 0) {
    //         this.deptId = res.data[0].hospitalCode

    //         res.data.forEach((item, index) => {
    //           this.$set(item, 'key', item.hospitalCode)
    //           this.$set(item, 'value', item.hospitalCode)
    //           this.$set(item, 'title', item.hospitalName)
    //           this.$set(item, 'children', item.hospitals)

    //           item.hospitals.forEach((item1, index1) => {
    //             this.$set(item1, 'key', item1.hospitalCode)
    //             this.$set(item1, 'value', item1.hospitalCode)
    //             this.$set(item1, 'title', item1.hospitalName)
    //           })
    //         })

    //         this.treeData = res.data
    //       } else {
    //         this.treeData = res.data
    //       }

    //       this.refreshProtocol()
    //       return []
    //     })
    //     .finally((res) => {
    //       // this.confirmLoading = false
    //     })
    // },

    refreshProtocol() {
      // if (this.$refs.protocolEdit1) {
      //   this.$refs.protocolEdit1.refreshData(this.deptId)
      // }
      // if (this.$refs.protocolEdit2) {
      //   this.$refs.protocolEdit2.refreshData(this.deptId)
      // }
      // if (this.$refs.protocolEdit3) {
      //   this.$refs.protocolEdit3.refreshData(this.deptId)
      // }

      this.$nextTick(() => {
        if (this.$refs.protocolEdit1) {
          this.$refs.protocolEdit1.refreshData(this.deptId)
        }
        if (this.$refs.protocolEdit2) {
          this.$refs.protocolEdit2.refreshData(this.deptId)
        }
        if (this.$refs.protocolEdit3) {
          this.$refs.protocolEdit3.refreshData(this.deptId)
        }
      })
    },

    tabChange(key) {
      console.log('tabChange', key)
      // debugger
      switch (key) {
        case '1':
          // if (this.$refs.protocolEdit1) {
          //   this.$refs.protocolEdit1.refreshData(this.deptId)
          // }
          this.$nextTick(() => {
            if (this.$refs.protocolEdit1) {
              this.$refs.protocolEdit1.refreshData(this.deptId)
            }
          })
          break
        case '2':
          // this.$refs.protocolEdit2.refreshData(this.deptId)

          this.$nextTick(() => {
            if (this.$refs.protocolEdit2) {
              this.$refs.protocolEdit2.refreshData(this.deptId)
            }
          })
          break
        case '3':
          this.$nextTick(() => {
            if (this.$refs.protocolEdit3) {
              this.$refs.protocolEdit3.refreshData(this.deptId)
            }
          })
          break
        default:
          break
      }
    },
  },
}
</script>

<style lang="less" >
.div-tabs {
  display: flex;
  flex-direction: row;
  align-items: center;

  .div-tab-item {
    display: flex;
    padding: 5px 30px;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .tab-top {
      display: flex;
      flex-direction: row;
      align-items: center;

      .active {
        color: #409eff !important;
      }
    }

    .tab-line {
      width: 80%;
      background-color: #409eff;
      height: 2px;
      margin-top: 8px;
    }
  }
}

.wrap-pro {
  margin-top: 10px;
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

/deep/ .ant-tabs-bar {
  margin-bottom: 10px !important;
}

// .aaa .ant-select-dropdown{
//   z-index: 11111 !important;
// }
// /deep/ .ant-select-dropdown {
//   z-index: 11111 !important;
// }

.w-e-toolbar {
  z-index: 1 !important;
}

.w-e-menu {
  z-index: 2 !important;
}
.w-e-text-container {
  z-index: 1 !important;
}
</style>
