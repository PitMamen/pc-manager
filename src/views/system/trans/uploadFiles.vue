<template>
  <a-spin :spinning="confirmLoading">
    <a-card :bordered="false" :loading="loading">
      <!-- 基本信息 -->
      <!-- <div class="div-box"> -->
      <div class="div-title">
        <div class="div-line-blue"></div>
        <span class="span-title">住院病历</span>
      </div>

      <a-button style="margin-top: 20px; margin-left: 10px" type="primary" @click="submitData()">同步病历</a-button>

      <!-- </div> -->

      <a-table
        :scroll="{ x: true }"
        style="margin-top: 10px"
        ref="table"
        size="default"
        :columns="columns"
        :data-source="tableData"
        :alert="true"
        :rowKey="(record) => record.code"
      >
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
      <file-modalshow ref="fileModalshow"  />
    </a-card>
  </a-spin>
</template>

<script>
import {} from '@/api/modular/system/posManage'
import { STable, Ellipsis } from '@/components'
import { formatDecimal } from '@/utils/util'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import fileModalshow from './fileModalshow'

import E from 'wangeditor'
export default {
  components: {
    STable,
    Ellipsis,
    fileModalshow,
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
      otherListphoto:[],
      previewImageBanner: '',
      previewImageDetail: '',
      previewOtherDetail: '',
      previewVisibleBanner: false,
      previewVisibleDetail: false,
      previewVisibleOther: false,

      tableData: [],
      columns: [
        {
          title: '住院流水号',
          // innerHeight:20,
          dataIndex: 'xh',
        },
        {
          title: '入院时间',
          width: 100,
          dataIndex: 'rysj',
          ellipsis: true,
        },
        {
          title: '出院时间',
          dataIndex: 'cysj',
        },
        {
          title: '病案首页',
          dataIndex: 'basy',
        },
        {
          title: '出院小结',
          dataIndex: 'cyxj',
        },

        {
          title: '化验报告',
          dataIndex: 'hybg',
        },

        {
          title: '状态',
          dataIndex: 'zt',
        },

        {
          title: '授权访问',
          dataIndex: 'sqfw',
        },

        {
          title: '授权机构',
          dataIndex: 'sqjg',
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

  /**
   * 初始化判断按钮权限是否拥有，没有则不现实列
   *
   * medicSearch 页面暂时不需要了，换 chooseMedic 弹窗实现功能
   *
   */
  created() {
    this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
    // this.getMedicTypes()
    // // this.getTreatTypes()
    // this.getYiBaoDatas()
    // // this.getCategoryListOut()
    // // this.getBaseUnitDatas()
    // this.getExpenseDatas()
    // // this.getUnitDatas()

    // this.getSpiritualDatas()
    // this.getAnesthesiaDatas()
    // this.getBacteriaDatas()
    // this.getDefaultUseDatas()
    // this.getDefaultFreqDatas()
  },
  mounted() {
    // this.$bus.$on('medicNewEvent', (record) => {
    //   console.log('medicNewEvent', JSON.stringify(record))
    //   //TODO 填充药品数据
    //   this.inputData(record)
    // // })
    // this.$nextTick(() => {
    //   this.initEditor()
    // })
  },
  methods: {
    resetData() {
      this.fileListBanner = []
      this.fileListDetail = []
    },

    // 病历详情
    goRecordDetail() {
      //TODO 测试数据
      let record = {name:'张三',sex:'男',age:12}
      this.$refs.fileModalshow.showFile(record);
    },

    // 授权管理
    goAuthorizeManage() {},

    // 提交病历
    commitPhoto(){

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



