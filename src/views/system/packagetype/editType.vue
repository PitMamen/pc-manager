<template>
  <div class="div-new-package">
    <p class="p-title">新增类别</p>
    <!-- 分割线 -->
    <div class="div-divider"></div>

    <a-form ref="form" :form="form" class="my-form">
      <a-form-item label="类别名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-input v-decorator="['className', { rules: [{ required: true, message: '请输入类别名称！' }] }]" />
      </a-form-item>

      <a-form-item label="所属科室" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-select allow-clear v-decorator="['belong', { rules: [{ required: true, message: '请选择所属科室' }] }]">
          <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.departmentId">{{
            item.departmentName
          }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="是否上架" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-switch :checked="uploadData.isOnline" @change="onChangeIsOnline" />
      </a-form-item>

      <a-form-item label="是否推荐" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-switch :checked="uploadData.isSuggest" @change="onChangeIsSuggest" />
      </a-form-item>
    </a-form>

    <div class="div-service-pic">
      <span class="title-des-pic"><span style="color: red">*</span> 封面图片 :（只允许上传1张，正方形比例）</span>
      <!-- <div :key="ImgKey" style="margin-top: 1%"> -->
      <div class="clearfix" style="margin-top: 20px">
        <a-upload
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

      <span class="title-des-pic"
        ><span style="color: red">*</span> 详情banner图片 :（可添加多张，建议尺寸比例7：4）</span
      >
      <div class="clearfix" style="margin-top: 20px">
        <a-upload
          :action="actionUrl"
          :multiple="true"
          list-type="picture-card"
          :file-list="fileListBanner"
          @preview="handlePreviewBanner"
          @change="handleChangeBanner"
        >
          <div v-if="fileListBanner.length < 5">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisibleBanner" :footer="null" @cancel="handleCancelBanner">
          <img alt="example" style="width: 100%" :src="previewImageBanner" />
        </a-modal>
      </div>

      <span class="title-des-pic"><span style="color: red">*</span> 商品详情（可添加多张）</span>
      <div class="clearfix" style="margin-top: 20px">
        <a-upload
          :action="actionUrl"
          :multiple="true"
          list-type="picture-card"
          :file-list="fileListDetail"
          @preview="handlePreviewDetail"
          @change="handleChangeDetail"
        >
          <div v-if="fileListDetail.length < 50">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisibleDetail" :footer="null" @cancel="handleCancelDetail">
          <img alt="example" style="width: 100%" :src="previewImageDetail" />
        </a-modal>
      </div>
    </div>
    <a-button class="btn-submit" type="primary" @click="validate">提交</a-button>
    <div style="height: 25px; color: white"></div>
  </div>
</template>

<script>
import { saveGoodsClass, getDepts } from '@/api/modular/system/posManage'

export default {
  components: {},

  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperColN: {
        xs: { span: 24 },
        sm: { span: 12 },
      },

      hosCode: '444885559',
      loading: false,
      keshiData: [],
      classId: '',
      actionUrl: '/api/contentapi/fileUpload/uploadImgFile',
      headers: {
        authorization: 'authorization-text',
      },
      form: this.$form.createForm(this),

      uploadData: {
        className: '',
        belong: '',
        imgList: [],
        previewList: [],
        bannerList: [],
        status: '',
        topFlag: '',
        isOnline: true,
        isSuggest: true,
      },

      previewVisible: false,
      previewVisibleBanner: false,
      previewVisibleDetail: false,

      previewImage: '',
      previewImageBanner: '',
      previewImageDetail: '',

      fileList: [],
      fileListBanner: [],
      fileListDetail: [],

      uploadData: {},
    }
  },

  watch: {
    visible() {},
  },

  created() {
    this.getDeptsOut()
    this.uploadData = this.$route.params.record
    this.uploadData.belong = parseInt(this.uploadData.belong)
    this.initData()
  },

  methods: {
    initData() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.form.setFieldsValue({
            className: this.uploadData.className,
            belong: this.uploadData.belong,
          })
        })
      })

      console.log('555', this.uploadData.status == 1)
      if (this.uploadData.status == 1) {
        this.uploadData.isOnline = true
      } else {
        this.uploadData.isOnline = false
      }

      console.log('666', this.uploadData.topFlag == 1)
      if (this.uploadData.topFlag == 1) {
        this.uploadData.isSuggest = true
      } else {
        this.uploadData.isSuggest = false
      }
      //组装图片
      /**
           *    {
          uid: '-2',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
           */
      
      this.fileList.push({
        uid: '-1',
        name: '封面' + 1,
        status: 'done',
        url: this.uploadData.previewList,
      })

      //banner图
      let bannerPics = this.uploadData.bannerList.split(',')
      for (let index = 0; index < bannerPics.length; index++) {
        this.fileListBanner.push({
          uid: 0 - index + '',
          name: 'Banner' + index,
          status: 'done',
          url: bannerPics[index],
        })
      }

      //详情图
      let detailPics = this.uploadData.imgList.split(',')
      for (let index = 0; index < detailPics.length; index++) {
        this.fileListDetail.push({
          uid: 0 - index + '',
          name: '详情' + index,
          status: 'done',
          url: detailPics[index],
        })
      }
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },

    getDeptsOut() {
      getDepts().then((res) => {
        if (res.code == 0) {
          this.keshiData = res.data
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },

    onChangeIsOnline() {
      this.uploadData.isOnline = !this.uploadData.isOnline
    },

    onChangeIsSuggest() {
      this.uploadData.isSuggest = !this.uploadData.isSuggest
    },

    handleCancel() {
      this.previewVisible = false
    },

    handleCancelBanner() {
      this.previewVisibleBanner = false
    },

    handleCancelDetail() {
      this.previewVisibleDetail = false
    },

    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
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

    handleChange({ fileList }) {
      this.fileList = fileList
      if (this.fileList.length > 1) {
        let newData = this.fileList[0]
        this.fileList = [newData]
      }
    },

    handleChangeBanner({ fileList }) {
      this.fileListBanner = fileList
    },

    handleChangeDetail({ fileList }) {
      this.fileListDetail = fileList
    },

    validate() {
      const {
        form: { validateFields },
      } = this

      validateFields((errors, values) => {
        if (!errors) {
          console.log('11', values)
          //校验表格数据无误，则组装数据

          this.uploadData.className = values.className
          this.uploadData.belong = values.belong
          this.uploadData.status = this.uploadData.isOnline ? '1' : '3'
          this.uploadData.topFlag = this.uploadData.isSuggest ? '1' : '0'

          //组装图片
          if (this.fileList.length == 0) {
            this.$message.error('请上传封面图片！')
            return
          } else {
            delete this.uploadData.previewList
            this.$set(this.uploadData, 'previewList', '')
            if (this.fileList[0].response) {
              this.uploadData.previewList = this.fileList[0].response.data.fileLinkUrl
            } else {
              this.uploadData.previewList = this.fileList[0].url
            }
          }

          if (this.fileListBanner.length == 0) {
            this.$message.error('请上传详情banner图片！')
            return
          } else {
            //后台返回的bannerList为字符串，提交的时候先删除此属性，再将此字段做成数组
            delete this.uploadData.bannerList
            this.$set(this.uploadData, 'bannerList', '')
            let str = ''
            for (let index = 0; index < this.fileListBanner.length; index++) {
              // this.uploadData.bannerList.push(this.fileListBanner[index].response.data.fileLinkUrl)
              if (index != this.fileListBanner.length - 1) {
                if (this.fileListBanner[index].response) {
                  str = str + this.fileListBanner[index].response.data.fileLinkUrl + ','
                } else {
                  str = str + this.fileListBanner[index].url + ','
                }
              } else {
                if (this.fileListBanner[index].response) {
                  str = str + this.fileListBanner[index].response.data.fileLinkUrl
                } else {
                  str = str + this.fileListBanner[index].url
                }
              }
            }
            this.uploadData.bannerList = str
          }

          if (this.fileListDetail.length == 0) {
            this.$message.error('请上传商品详情图片！')
            return
          } else {
            //后台返回的bannerList为字符串，提交的时候先删除此属性，再将此字段做成数组
            delete this.uploadData.imgList
            this.$set(this.uploadData, 'imgList', '')

            let str = ''
            for (let index = 0; index < this.fileListDetail.length; index++) {
              // this.uploadData.bannerList.push(this.fileListBanner[index].response.data.fileLinkUrl)
              if (index != this.fileListDetail.length - 1) {
                if (this.fileListDetail[index].response) {
                  str = str + this.fileListDetail[index].response.data.fileLinkUrl + ','
                } else {
                  str = str + this.fileListDetail[index].url + ','
                }
              } else {
                if (this.fileListDetail[index].response) {
                  str = str + this.fileListDetail[index].response.data.fileLinkUrl
                } else {
                  str = str + this.fileListDetail[index].url
                }
              }
            }
            this.uploadData.imgList = str
          }

          //删除后台不需要的属性
          delete this.uploadData.isOnline
          delete this.uploadData.isSuggest
          delete this.uploadData.isSuggestText
          delete this.uploadData.isOnlineText
          delete this.uploadData.xh
          delete this.uploadData.createTimeName
          //完成所有数据组装，上传后台
          saveGoodsClass(this.uploadData).then((res) => {
            if (res.code == 0) {
              this.$message.success('保存成功')
              this.$router.go(-1)
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          console.log('22', errors)
        }
      })
    },
  },
}
</script>

<style lang="less">
.div-new-package {
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

  .my-form {
    margin-top: 2%;
  }

  .div-service-type {
    width: 100%;
    padding: 0 15.2%;
    overflow: hidden;

    .title-des {
      color: rgba(0, 0, 0, 0.85);
    }

    .div-item {
      margin-top: 2%;
      overflow: hidden;

      .div-bg {
        margin-left: 2%;
        padding: 1% 5%;
        border-radius: 6px;
        border: 1px solid #e6e6e6;
        // background-color: #e6e6e6;
        background-color: rgb(240, 240, 242);
        float: left;
        overflow: hidden;
        width: 70%;

        .ant-select {
          // width: 7% !important;
          // margin-left: 1.5% !important;
        }

        .span-item-name {
          display: inline-block;
          color: #000;
          font-size: 14px;
          text-align: left;
        }

        .span-item-value {
          width: 30%;
          color: #333;
          text-align: left;
          padding-left: 20px;
          font-size: 14px;
          display: inline-block;
        }
      }

      .btn-delete {
        margin-top: 1%;
        width: 12%;
        margin-left: 3%;
        overflow: hidden;
      }
    }
  }

  .div-service-pic {
    width: 100%;
    padding: 0 15.2%;
    margin-top: 2%;
    overflow: hidden;

    .title-des-pic {
      margin-top: 2%;
      display: block;
      color: rgba(0, 0, 0, 0.85);
    }

    // .upload-list-inline .ant-upload-list-item {
    //   float: left;
    //   width: 200px;
    //   margin-right: 8px;
    // }

    .ant-upload-select-picture-card i {
      font-size: 32px;
      color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
      margin-top: 8px;
      color: #666;
    }
  }

  .btn-submit {
    margin-top: 3%;
    margin-left: 38%;
  }
}
</style>
