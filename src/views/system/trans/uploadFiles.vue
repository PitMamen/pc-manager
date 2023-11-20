<template>
  <a-spin :spinning="confirmLoading">
    <a-card :bordered="false" :loading="loading">
      <!-- 基本信息 -->
      <!-- <div class="div-box"> -->
      <div class="div-title">
        <div class="div-line-blue"></div>
        <span class="span-title">住院病历</span>
      </div>

      <a-button style="margin-top: 20px; margin-left: 10px" type="primary" @click="syncCase()">同步病历</a-button>

      <!-- </div> -->

      <a-table
        :scroll="{ x: true }"
        style="margin-top: 10px"
        ref="table"
        :pagination="false"
        size="default"
        :columns="columns"
        :data-source="tableData"
        :alert="true"
        :rowKey="(record) => record.code"
      >
        <span slot="ztshow" slot-scope="text, record">
          <span style="color: #69c07d">{{ record.zt }}</span>
        </span>
      </a-table>

      <div class="div-pro-btn">
        <div style="flex: 1"></div>
        <a-button ghost type="primary" @click="goRecordDetail()">病历详情</a-button>
        <a-button ghost type="primary" style="margin-left: 10px" @click="goAuthorizeManage()">授权管理</a-button>
      </div>

      <div class="div-title">
        <div class="div-line-blue"></div>
        <span class="span-title">图片记录(自行补充)</span>
      </div>

      <!-- 化验报告图片上传 -->
      <span class="title-des-pic" style="margin-left: 8px"> 化验报告(最多允许上传10张)</span>
      <div class="clearfix" style="margin-top: 20px">
        <a-upload
          :action="actionUrl"
          :headers="headers"
          :multiple="true"
          accept="image/jpeg,image/png,image/jpg"
          list-type="picture-card"
          :file-list="fileListBanner"
          @preview="handlePreviewBanner"
          @change="handleChangeBanner"
        >
          <div v-if="fileListBanner.length < 10">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisibleBanner" :footer="null" @cancel="handleCancelBanner">
          <img alt="example" style="width: 100%" :src="previewImageBanner" />
        </a-modal>
      </div>

      <!-- 检查报告图片上传 -->
      <span class="title-des-pic" style="margin-left: 8px">检查报告(最多允许上传10张)</span>
      <div class="clearfix" style="margin-top: 20px">
        <a-upload
          :action="actionUrl"
          :headers="headers"
          :multiple="true"
          accept="image/jpeg,image/png,image/jpg"
          list-type="picture-card"
          :file-list="fileListDetail"
          @preview="handlePreviewDetail"
          @change="handleChangeDetail"
        >
          <div v-if="fileListDetail.length < 10">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisibleDetail" :footer="null" @cancel="handleCancelDetail">
          <img alt="example" style="width: 100%" :src="previewImageDetail" />
        </a-modal>
      </div>

      <!-- 其他病历上传 -->

      <span class="title-des-pic" style="margin-left: 8px">其他病历(最多允许上传20张)</span>
      <div class="clearfix" style="margin-top: 20px">
        <a-upload
          :action="actionUrl"
          :headers="headers"
          :multiple="true"
          accept="image/jpeg,image/png,image/jpg"
          list-type="picture-card"
          :file-list="otherListphoto"
          @preview="handlePreviewOther"
          @change="handleChangeOther"
        >
          <div v-if="otherListphoto.length < 20">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisibleOther" :footer="null" @cancel="handleCancelOther">
          <img alt="example" style="width: 100%" :src="previewOtherDetail" />
        </a-modal>
      </div>

      <div class="div-pro-btn">
        <div style="flex: 1"></div>
        <a-button ghost type="primary" @click="commitPhoto()">提交记录</a-button>
      </div>
      <file-modalshow ref="fileModalshow" />
      <empower-Manage ref="empowerManage" @ok="handleOk" />
    </a-card>
  </a-spin>
</template>

<script>
import { synPatientCase, getSynRecord, getTradeImg, uploadTradeImg } from '@/api/modular/system/posManage'
import { STable, Ellipsis } from '@/components'
import { formatDecimal } from '@/utils/util'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import fileModalshow from './fileModalshow'
import empowerManage from './empowerManage'

import E from 'wangeditor'
export default {
  components: {
    STable,
    Ellipsis,
    fileModalshow,
    empowerManage,
  },
  data() {
    return {
      confirmLoading: false,
      loading: false,
      actionUrl: '/api/content-api/fileUpload/uploadImgFile',
      headers: {
        Authorization: '',
      },
      fileListBanner: [],
      fileListDetail: [],
      otherListphoto: [],
      previewImageBanner: '',
      previewImageDetail: '',
      previewOtherDetail: '',
      previewVisibleBanner: false,
      previewVisibleDetail: false,
      previewVisibleOther: false,

      tradeId: '',

      tableData: [],

      tempData: {
        imgList: [],
        tradeId: '',
      },
      record:{},

      columns: [
        {
          title: '住院流水号',
          // innerHeight:20,
          dataIndex: 'regNo',
        },
        {
          title: '入院时间',
          dataIndex: 'inDate',
          ellipsis: true,
        },
        {
          title: '出院时间',
          dataIndex: 'outDate',
        },
        {
          title: '病案首页',
          dataIndex: 'caseNum',
          align: 'center',
        },
        {
          title: '出院小结',
          dataIndex: 'summaryNum',
          align: 'center',
        },

        {
          title: '化验报告',
          dataIndex: 'examNum',
          align: 'center',
        },

        {
          title: '检查报告',
          dataIndex: 'checkNum',
          align: 'center',
        },

        {
          title: '状态',
          dataIndex: 'createTimeshow',
        },

        {
          title: '授权访问',
          dataIndex: 'zt',
          scopedSlots: { customRender: 'ztshow' },
        },

        {
          title: '授权机构',
          dataIndex: 'hospitalName',
        },
      ],
    }
  },

  watch: {
    $route(to, from) {
      //TODO watch不回调需要找原因
      console.log('watch****************uploadFiles ', to, from)
      if (to.path.indexOf('uploadFiles') > -1) {
        this.resetData()
      }
    },
  },

  activated() {
    if (this.$route.query.tradeId) {
      this.resetData()
      this.tradeId = this.$route.query.tradeId
      this.tempData.tradeId = this.tradeId
      this.getSynRecordOut()
    }
  },

  created() {
    this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
  },
  mounted() {},
  methods: {
    resetData() {
      this.fileListBanner = []
      this.fileListDetail = []
      this.otherListphoto = []
    },

    // 每次点击当前tab时 会触发
    refershData(activeKey) {
      console.log('2222222222222222222:', activeKey)
      this.getSynRecordOut()
    },

    // 获取档案信息
    getSynRecordOut() {
      this.confirmLoading = true
      // getSynRecord({ tradeId: '20231108095148621' }).then((res) => {
      getSynRecord({ tradeId: this.tradeId })
        .then((res) => {
          if (res.code == 0) {
            this.tableData = res.data
            if (this.tableData) {
              this.tableData.forEach((item) => {
                this.$set(item, 'zt', '已授权')
                if (item.createTime && item.createTime.length > 10) {
                  this.$set(item, 'createTimeshow', item.createTime.substring(0, 10) + '同步')
                }
              })
            }
          }
        })
        .finally((erro) => {
          this.confirmLoading = false
        })
    },

        // 获取详情信息
    getRecordDetail() {
      this.confirmLoading = true
      // getSynRecord({ tradeId: '20231108095148621' }).then((res) => {
        upReferralDetail(this.tradeId )
        .then((res) => {
          if (res.code == 0) {
              this.record = res.data
          }
        })
        .finally((erro) => {
          this.confirmLoading = false
        })
    },

    // 同步病历
    synPatientCaseOut() {
      this.confirmLoading = true
      // synPatientCase({ tradeId: '20231108095148621' }).then((res) => {
      synPatientCase({ tradeId: this.tradeId })
        .then((res) => {
          if (res.code == 0) {
            this.confirmLoading = false
            this.$message.success('操作成功!')
            this.getSynRecordOut()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally((erro) => {
          this.confirmLoading = false
        })
    },

    // 同步
    syncCase() {
      this.synPatientCaseOut()
    },

    // 病历详情
    goRecordDetail() {
      //TODO 测试数据
      // let record = { name: '张三', sex: '男', age: 12 }
      this.$refs.fileModalshow.showFile(this.record)
    },

    // 授权管理
    goAuthorizeManage() {
      this.$refs.empowerManage.manage('1')
    },

    // 提交病历
    commitPhoto() {
      // 化验报告图片
      this.tempData.imgList = []
      if (this.fileListBanner.length == 0) {
        this.$message.error('请上传化验报告图片！')
        return
      } else {
        for (let index = 0; index < this.fileListBanner.length; index++) {
          this.tempData.imgList.push({ imgPath: this.fileListBanner[index].response.data.fileLinkUrl, imgType: 1 })
        }
      }

      // 检查报告图片
      if (this.fileListDetail.length == 0) {
        this.$message.error('请上传检查报告图片！')
        return
      } else {
        for (let index = 0; index < this.fileListDetail.length; index++) {
          this.tempData.imgList.push({ imgPath: this.fileListDetail[index].response.data.fileLinkUrl, imgType: 2 })
        }
      }

      if (this.otherListphoto.length == 0) {
        this.$message.error('请上传其它病历图片！')
        return
      } else {
        for (let index = 0; index < this.fileListDetail.length; index++) {
          this.tempData.imgList.push({ imgPath: this.otherListphoto[index].response.data.fileLinkUrl, imgType: 3 })
        }
      }

      this.tempData.tradeId = this.tradeId
      uploadTradeImg(this.tempData).then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功!')
        }
      })
    },

    handleChangeBanner(changeObj) {
      console.log('changeObj', JSON.stringify(changeObj))
      if (changeObj.file.status == 'done' && changeObj.file.response.code != 0) {
        this.$message.error(changeObj.file.response.message)
        changeObj.fileList.pop()
        this.fileListBanner = changeObj.fileList
      } else {
        this.fileListBanner = changeObj.fileList
      }
    },

    handleChangeDetail(changeObj) {
      if (changeObj.file.status == 'done' && changeObj.file.response.code != 0) {
        this.$message.error(changeObj.file.response.message)
        changeObj.fileList.pop()
        this.fileListDetail = changeObj.fileList
      } else {
        this.fileListDetail = changeObj.fileList
      }
    },

    handleChangeOther(changeObj) {
      if (changeObj.file.status == 'done' && changeObj.file.response.code != 0) {
        this.$message.error(changeObj.file.response.message)
        changeObj.fileList.pop()
        this.otherListphoto = changeObj.fileList
      } else {
        this.otherListphoto = changeObj.fileList
      }
    },

    handleCancelOther() {
      this.previewVisibleOther = false
    },

    handleCancelDetail() {
      this.previewVisibleDetail = false
    },

    handleCancelBanner() {
      this.previewVisibleBanner = false
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },

    async handlePreviewBanner(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImageBanner = file.url || file.preview
      this.previewVisibleBanner = true
    },

    async handlePreviewDetail(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImageDetail = file.url || file.preview
      this.previewVisibleDetail = true
    },

    async handlePreviewOther(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewOtherDetail = file.url || file.preview
      this.previewVisibleOther = true
    },

    handleOk() {},
  },
}
</script>

<style lang="less" scoped>
button {
  margin-right: 8px;
}
</style>
<style lang="less" scoped>
.div-title {
  display: flex;
  background-color: #ebebeb;
  flex-direction: row;
  width: 100% !important;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 26px;

  .div-line-blue {
    width: 5px;
    height: 100%;
    background-color: #1890ff;
  }

  .span-title {
    font-size: 12px;
    margin-left: 10px;
    font-weight: bold;
    color: #333;
  }
}

.div-box {
  border: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
  font-size: 12px;

  .box-title {
    color: #1a1a1a;
    font-weight: bold;
    font-size: 14px;
    padding: 10px 20px;
  }

  .box-divider {
    height: 1px;
    background-color: #e6e6e6;
  }

  .div-line {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .div-cell {
      width: 23%;
      display: flex;
      flex-direction: row;
      align-items: center;

      .div-cell-name {
        width: 80px;
        text-align: right;
      }

      .div-cell-value {
      }

      .temp {
        /deep/ .ant-input {
          color: #409eff;
        }
      }
    }

    .check {
      &:hover {
        cursor: pointer;
      }
    }

    .div-shu-cell {
      display: flex;
      flex-direction: column;

      .div-shu-cell-ori {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }
}

.title-des-pic {
  margin-top: 20px;
  display: block;
  color: rgba(0, 0, 0, 0.85);
}

.div-pro-btn {
  display: flex;
  flex-direction: row;
  align-items: center;

  margin-top: 1%;
  margin-bottom: 60px;
}
</style>



