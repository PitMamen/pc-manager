<template>
  <a-modal
    title="就诊人上传资料"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-order-detail">
        <div class="div-line-wrap">
          <span class="span-item-name">就诊人 :</span>
          <span class="span-item-value">{{ record.patientName }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 联系方式 :</span>
          <span class="span-item-value">{{ record.phone }} </span>
        </div>

        <div class="clearfix" style="margin-top: 20px">
          <a-upload
            disabled
            :action="actionUrl"
            :multiple="true"
            list-type="picture-card"
            :file-list="fileListBanner"
            @preview="handlePreviewBanner"
            @change="handleChangeBanner"
          >
            <div v-if="false">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisibleBanner" :footer="null" @cancel="handleCancelBanner">
            <img alt="example" style="width: 100%" :src="previewImageBanner" />
          </a-modal>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import { getMedicalOrdersDetail } from '@/api/modular/system/posManage'
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      actionUrl: '/api/contentapi/fileUpload/uploadImgFile',
      record: {},
      previewVisibleBanner: false,
      previewImageBanner: '',
      fileListBanner: [],
    }
  },
  methods: {
    //初始化方法
    edit(record) {
      this.record = {}
      this.fileListBanner = []
      this.record = record
      this.visible = true

      for (let index = 0; index < this.record.medRecordImagesArr.length; index++) {
        this.fileListBanner.push({
          uid: 0 - index + '',
          name: 'Banner' + index,
          status: 'done',
          url: this.record.medRecordImagesArr[index],
        })
      }
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

    handleChangeBanner({ fileList }) {
      this.fileListBanner = fileList
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },

    handleSubmit() {},
    handleCancel() {
      this.visible = false
    },
  },
}
</script>
<style lang="less">
.div-order-detail {
  background-color: white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0 5% 0 5%;
  // padding: 0 15%;
  .p-title {
    margin-top: 20px;
    height: 20px;
    font-size: 20px;
    text-align: left;
    color: #000;
    font-weight: bold;
    // border-bottom: 1px solid #e6e6e6;
  }
  .div-divider {
    margin-top: 2%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1px;
  }

  .div-line-wrap {
    width: 100%;
    margin-top: 3%;
    overflow: hidden;

    .span-item-name {
      width: 12%;
      display: inline-block;
      color: #000;
      font-size: 14px;
      text-align: left;
    }
    .span-item-value {
      width: 35%;
      color: #333;
      text-align: left;
      padding-left: 20px;
      font-size: 14px;
      display: inline-block;
    }

    .ant-select {
      width: 18.5% !important;
      margin-left: 1.5% !important;
    }

    .sign-name {
      color: #000;
      font-size: 18px;
      font-family: '楷体', '楷体_GB2312';
      // font-family: 'FZKai-Z03S';
      // font-family: 'LiSu';
      font-style: italic;
    }
  }

  .div-medicine-wrap {
    margin-top: 2%;
    width: 96%;
    margin-left: 2%;
    height: 100%;
    border-radius: 6px;
    border: 1px solid #e6e6e6;

    .firstItem {
      // border-radius: 6px;
      border-bottom: 1px solid #e6e6e6;
    }
    .div-medicine-item {
      background-color: white;
      padding: 2% 2%;

      // margin-top: 1%;
      // margin-bottom: 1%;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .div-line-medicine {
        width: 100%;
        margin-top: 1%;
        overflow: hidden;
        .span-item-name {
          width: 10%;
          display: inline-block;
          color: #000;
          font-size: 14px;
          text-align: left;
        }

        .span-item-value {
          width: 15%;
          color: #333;
          text-align: left;
          padding-left: 20px;
          font-size: 14px;
          display: inline-block;
        }
      }
    }
  }

  .btn-add-plan {
    margin-top: 3%;
    margin-left: 35%;
  }
  .btn-save-plan {
    margin-top: 5%;
    display: block;
    margin-bottom: 10%;
  }
}
</style>
