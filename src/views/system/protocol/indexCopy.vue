<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" v-if="hasPerm('sysConfig:page')">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="所属机构">
              <a-tree-select
                v-model="deptId"
                tree-default-expand-all
                :tree-data="treeData"
                @change="refreshProtocol"
                placeholder="请选择所属机构"
                style="min-width: 120px"
              >
              </a-tree-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="wrap-tab">
      <!-- <a-tabs default-active-key="2" v-model="activeKey" @change="tabChange"> -->
      <a-tabs default-active-key="2" @change="tabChange" v-model="activeKey">
        <a-tab-pane key="1">
          <span slot="tab">
            <img
              style="width: 15px; height: 15px; margin-right: 7px; margin-top: -4px"
              v-if="activeKey == '1'"
              src="~@/assets/icons/shouquan.png"
            />
            <img
              style="width: 15px; height: 15px; margin-right: 7px; margin-top: -4px"
              v-else
              src="~@/assets/icons/shouquan_not.png"
            />
            <!-- 患者服务授权协议 -->
            {{ contractList[0].description }}
          </span>
          <!-- <protocol-edit ref="protocolEdit1" :protocolType="'CP_10001'" /> -->
          <!-- <protocol-edit ref="protocolEdit1" :protocolType="contractList[0].value" /> -->
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

              <div class="wrap-rich" style="margin-top: 10px" id="richId"></div>
            </div>
          </a-spin>
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab">
            <img
              style="width: 15px; height: 15px; margin-right: 7px; margin-top: -4px"
              v-if="activeKey == '2'"
              src="~@/assets/icons/huanzhe.png"
            />
            <img
              style="width: 15px; height: 15px; margin-right: 7px; margin-top: -4px"
              v-else
              src="~@/assets/icons/huanzhe_not.png"
            />
            <!-- 患者端用户协议 -->
            {{ contractList[1].description }}
          </span>
          <!-- <protocol-edit ref="protocolEdit2" :protocolType="'CP_10002'" /> -->
          <!-- <protocol-edit ref="protocolEdit2" :protocolType="contractList[1].value" /> -->
          <a-spin :spinning="confirmLoading">
            <div class="wrap-pro">
              <div class="wrap-btn">
                <div class="btn-item" @click="goSave2">
                  <img style="width: 13px; height: 13px; margin-right: 7px" src="~@/assets/icons/baocun_not.png" />
                  <div>保存发布</div>
                </div>
                <div class="btn-item2" @click="goUpload2">
                  <img style="width: 14px; height: 14px; margin-right: 7px" src="~@/assets/icons/yun.png" />
                  <div>上传平台</div>
                </div>
                <div class="btn-item2" @click="goDownload2">
                  <img style="width: 12px; height: 12px; margin-right: 7px" src="~@/assets/icons/xiazai.png" />
                  <div>下载文件</div>
                </div>
              </div>

              <div style="width: 100%; height: 1px; background-color: #e6e6e6; margin-top: 10px"></div>

              <div class="wrap-rich" style="margin-top: 10px" id="richId2"></div>
            </div>
          </a-spin>
        </a-tab-pane>
        <a-tab-pane key="3">
          <span slot="tab">
            <img
              style="width: 15px; height: 15px; margin-right: 7px; margin-top: -4px"
              v-if="activeKey == '3'"
              src="~@/assets/icons/yisheng.png"
            />
            <img
              style="width: 15px; height: 15px; margin-right: 7px; margin-top: -4px"
              v-else
              src="~@/assets/icons/yisheng_not.png"
            />
            <!-- 医生端用户协议 -->
            {{ contractList[2].description }}
          </span>
          <!-- <protocol-edit ref="protocolEdit3" :protocolType="'CP_10003'" /> -->
          <!-- <protocol-edit ref="protocolEdit3" :protocolType="contractList[2].value" /> -->
        </a-tab-pane>
      </a-tabs>
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
import protocolEdit from './protocolEdit'
import E from 'wangeditor'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'

export default {
  components: {
    protocolEdit,
  },

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
      confirmLoading: false,
      isSaved: false,
      deptId: '',
      editor: {},
      editor2: {},
      content: '',
      content2: '',
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
      if (this.editor.isEnable) {
        return
      }

      var editor = new E('#richId')
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

      if (this.editor2.isEnable) {
        return
      }

      var editor2 = new E('#richId2')
      // var editor = new E('#div11')

      editor2.config.height = 600
      editor2.config.pasteFilterStyle = false
      console.log('editor', editor2)
      console.log('editorconfig', editor2.config)
      editor2.config.onchange = (html) => {
        // this.checkData.content = html
        this.content2 = html
      }
      // 默认情况下，显示所有菜单
      editor2.config.menus = [
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

      editor2.config.uploadImgHeaders = {
        Authorization: Vue.ls.get(ACCESS_TOKEN),
      }

      // 配置 server 接口地址
      editor2.config.uploadFileName = 'file'
      editor2.config.uploadImgServer = '/api/content-api/fileUpload/uploadImgFileForEdit'
      // editor.config.uploadImgServer = '/api/wx-api/health/wx/' + appId + '/uploadInnerImg'

      // editor.config.showLinkVideo = false

      //教育文章先不支持视频，所以注释
      editor2.config.uploadVideoName = 'file'
      editor2.config.uploadVideoServer = '/api/content-api/fileUpload/uploadVideoFileForEdit'
      editor2.config.uploadVideoHeaders = {
        Authorization: Vue.ls.get(ACCESS_TOKEN),
      }

      /**
       * 插入视频写法：
       *
       * <iframe frameborder="0" src="https://v.qq.com/txp/iframe/player.html?vid=n0020yrnly7" allowFullScreen="true"></iframe>
       * <iframe frameborder="0" src="https://vd3.bdstatic.com/mda-nit9wfd413e2xjsh/sc/cae_h264/1664351398486048214/mda-nit9wfd413e2xjsh.mp4?v_from_s=hkapp-haokan-hbf&auth_key=1664420478-0-0-ee34ef2d3450dbb1901bde7ab5ebd63b&bcevod_channel=searchbox_feed&pd=1&cd=0&pt=3&logid=1878163596&vid=7560524968628684931&abtest=104960_1-104959_1&klogid=1878163596" allowFullScreen="true"></iframe>
       *
       */

      editor2.create()
      this.editor2 = editor2
    },

    goSave() {
      let queryData = {
        hospitalCode: this.deptId,
        // categoryId: this.protocolType,
        categoryId: this.contractList[0].value,
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
        categoryId: this.contractList[0].value,
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
        categoryId: this.contractList[0].value,
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

    goSave2() {
      let queryData = {
        hospitalCode: this.deptId,
        // categoryId: this.protocolType,
        categoryId: this.contractList[1].value,
        content: this.content2,
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

    goDownload2() {
      if (!this.isSaved) {
        this.$message.error('请先保存发布')
        return
      }
      let queryData = {
        hospitalCode: this.deptId,
        categoryId: this.contractList[1].value,
      }
      downloadPdfContract(queryData)
        .then((res) => {
          // TODO 处理下载 this.$message.success('保存成功')
          this.downloadfile2(res)
        })
        .catch((err) => {
          this.$message.error('导出错误：' + err.message)
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    downloadfile2(res) {
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
    goUpload2() {
      if (!this.isSaved) {
        this.$message.error('请先保存发布')
        return
      }
      let queryData = {
        hospitalCode: this.deptId,
        categoryId: this.contractList[1].value,
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
            this.queryHospitalListOut()
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    queryHospitalListOut() {
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: '',
      }
      accessHospitals(queryData)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.deptId = res.data[0].hospitalCode

            res.data.forEach((item, index) => {
              this.$set(item, 'key', item.hospitalCode)
              this.$set(item, 'value', item.hospitalCode)
              this.$set(item, 'title', item.hospitalName)
              this.$set(item, 'children', item.hospitals)

              item.hospitals.forEach((item1, index1) => {
                this.$set(item1, 'key', item1.hospitalCode)
                this.$set(item1, 'value', item1.hospitalCode)
                this.$set(item1, 'title', item1.hospitalName)
              })
            })

            this.treeData = res.data
          } else {
            this.treeData = res.data
          }

          this.refreshProtocol()
          return []
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

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
