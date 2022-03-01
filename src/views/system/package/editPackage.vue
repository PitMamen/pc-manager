<template>
  <div class="div-new-package">
    <p class="p-title">修改套餐</p>
    <!-- 分割线 -->
    <div class="div-divider"></div>

    <a-form ref="form" :form="form" class="my-form">
      <a-form-item label="套餐名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-input v-decorator="['goodsName', { rules: [{ required: true, message: '请输入套餐名称！' }] }]" />
      </a-form-item>

      <a-form-item label="所属科室" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-select allow-clear v-decorator="['belong', { rules: [{ required: true, message: '请选择所属科室' }] }]">
          <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.deptCode">{{
            item.deptName
          }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="服务名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-input v-decorator="['goodsSpec', { rules: [{ required: true, message: '请输入服务名称！' }] }]" />
      </a-form-item>

      <a-form-item label="是否上架" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-switch
          :checked="statusIf"
          @change="statusChange"
          v-decorator="['statusIf', { rules: [{ required: true, message: '请选择是否上架！' }] }]"
        />
      </a-form-item>

      <a-form-item label="是否推荐" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-switch
          :checked="topFlagIf"
          @change="topFlagChange"
          v-decorator="['topFlagIf', { rules: [{ required: true, message: '请选择是否推荐！' }] }]"
        />
      </a-form-item>

      <a-form-item label="价格(￥)" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <!-- <a-input v-decorator="['price', { rules: [{ required: true, message: '请输入商品价格！' }] }]" /> -->
        <a-input-number
          v-decorator="['price', { initialValue: 0, rules: [{ required: true, message: '请输入商品价格！' }] }]"
          :min="0"
          :max="1000000"
        />
      </a-form-item>

      <!-- v-decorator="['theLastTime', { rules: [{ required: true, message: '请选择有效期' }] }]" -->
      <!-- v-model="theLastTime" -->
      <a-form-item label="有效期" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-select allow-clear v-decorator="['theLastTime', { rules: [{ required: true, message: '请选择有效期' }] }]">
          <a-select-option v-for="(item, index) in periodData" :key="index" :value="item.value">{{
            item.valueName
          }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>

    <div class="div-service-type">
      <span class="title-des"><span style="color: red">*</span> 服务类别 :</span>

      <div class="div-item" v-for="(item, index) in goodsAttr" :key="index">
        <div class="div-bg">
          <span class="span-item-name"><span style="color: red">*</span> 类别{{ index + 1 }} :</span>

          <a-select v-model="item.attrName" class="span-item-value" allow-clear placeholder="请选择服务类别">
            <a-select-option v-for="(itemType, indexType) in typeDatas" :key="indexType" :value="itemType.type">{{
              itemType.value
            }}</a-select-option>
          </a-select>

          <span class="span-item-name" style="margin-left: 8%"><span style="color: red">*</span> 次数 :</span>

          <a-input-number v-model="item.attrValue" :min="0" :max="1000000" />
        </div>

        <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="deleteItem(index)">
          <a-button class="btn-delete" type="primary">刪除</a-button>
        </a-popconfirm>
        <!-- <a-button class="btn-delete" type="primary" @click="deleteItem(index)">刪除</a-button> -->
      </div>

      <a-button class="btn-add" style="margin-top: 2%" type="primary" @click="addItem">添加</a-button>
    </div>

    <div class="div-service-pic">
      <span class="title-des-pic"><span style="color: red">*</span> 套餐图片 :（只允许上传1张，正方形比例）</span>
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

      <span class="title-des-pic"><span style="color: red">*</span> 详情banner图片 :（建议尺寸比例7：4）</span>
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

      <span class="title-des-pic"><span style="color: red">*</span> 商品详情</span>
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
import { queryDepartment, savePlan, getPlanDetail, delGoodsAttr } from '@/api/modular/system/posManage'

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
      hosData: [],
      periodData: [
        { code: 1, valueName: '半年', value: '6' },
        { code: 2, valueName: '一年', value: '12' },
        { code: 3, valueName: '永久', value: '1200' },
      ],
      keshiData: [],
      statusIf: false,
      topFlagIf: false,
      // actionUrl: 'http://192.168.1.122:8071/fileUpload/uploadImgFile',
      actionUrl: '/api/fileApi/fileUpload/uploadImgFile',
      headers: {
        authorization: 'authorization-text',
      },
      form: this.$form.createForm(this),
      typeDatas: [
        { type: 'textNum', value: '健康咨询' },
        { type: 'videoNum', value: '视频问诊' },
      ],

      goodsAttr: [
        // { name: '视频问诊', attrName: 'videoNum', attrValue: '1' },
        // { name: '健康咨询', attrName: 'textNum', attrValue: '1' },
      ],

      uploadData: {
        goodsInfo: {
          goodsName: '',
          belong: '',
          goodsType: 'service_package',
          goodsSpec: '',
          imgList: [],
          previewList: [],
          bannerList: [],
          status: '',
          price: '',
          theLastTime: '120',
          goodsAttr: [],
        },
        templateTask: [
          // {
          //   execTime: '0',
          //   taskName: '套餐购买',
          // },
        ],
        templateName: '',
        basetimeType: '0',
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
    }
  },

  watch: {
    visible() {},
  },

  created() {
    this.planId = this.$route.params.planId
    this.getPlanDetailOut()
    queryDepartment('444885559').then((res) => {
      if (res.code == 0) {
        this.keshiData = res.data
      } else {
        this.$message.error('获取科室列表失败：' + res.message)
      }
    })
  },

  methods: {
    statusChange() {
      this.statusIf = this.statusIf ? false : true
    },
    topFlagChange() {
      this.topFlagIf = this.topFlagIf ? false : true
    },
    getPlanDetailOut() {
      getPlanDetail(this.planId).then((res) => {
        if (res.code == 0) {
          this.uploadData = res.data

          this.form.setFieldsValue({
            goodsName: this.uploadData.goodsInfo.goodsName,
            belong: this.uploadData.goodsInfo.belong,
            goodsSpec: this.uploadData.goodsInfo.goodsSpec,
            price: this.uploadData.goodsInfo.price,
            theLastTime: this.uploadData.goodsInfo.theLastTime,
          })

          console.log('555', this.uploadData.goodsInfo.status == 1)
          if (this.uploadData.goodsInfo.status == 1) {
            this.statusIf = true
            this.form.setFieldsValue({
              statusIf: true,
            })
          } else {
            this.form.setFieldsValue({
              statusIf: false,
            })
          }

          console.log('666', this.uploadData.goodsInfo.topFlag == 1)
          if (this.uploadData.goodsInfo.topFlag == 1) {
            this.topFlagIf = true
            this.form.setFieldsValue({
              topFlagIf: true,
            })
          } else {
            this.form.setFieldsValue({
              topFlagIf: false,
            })
          }

          //组装服务类型
          for (let index = 0; index < this.uploadData.goodsInfo.goodsAttr.length; index++) {
            if (
              this.uploadData.goodsInfo.goodsAttr[index].attrName == 'videoNum' ||
              this.uploadData.goodsInfo.goodsAttr[index].attrName == 'textNum'
            ) {
              this.goodsAttr.push(this.uploadData.goodsInfo.goodsAttr[index])
            }
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
            url: this.uploadData.goodsInfo.previewList,
          })

          //banner图
          let bannerPics = this.uploadData.goodsInfo.bannerList.split(',')
          for (let index = 0; index < bannerPics.length; index++) {
            this.fileListBanner.push({
              uid: 0 - index + '',
              name: 'Banner' + index,
              status: 'done',
              url: bannerPics[index],
            })
          }

          //详情图
          let detailPics = this.uploadData.goodsInfo.imgList.split(',')
          for (let index = 0; index < detailPics.length; index++) {
            this.fileListDetail.push({
              uid: 0 - index + '',
              name: '详情' + index,
              status: 'done',
              url: detailPics[index],
            })
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
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

    deleteItem(index) {
      if (this.goodsAttr[index].id) {
        delGoodsAttr(this.goodsAttr[index].id).then((res) => {
          if (res.code == 0) {
            this.goodsAttr.splice(index, 1)
            this.$message.success('删除成功')
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        this.goodsAttr.splice(index, 1)
      }
    },

    /**
     * 添加条目时不能重复，需要处理
     */
    addItem() {
      if (this.goodsAttr.length >= 2) {
        this.$message.error('目前仅支持两种服务类型！')
        return
      }

      if (this.goodsAttr.length == 0) {
        this.goodsAttr.push({ name: '健康咨询', attrName: 'textNum', attrValue: '1' })
        return
      }

      if (this.goodsAttr.length == 1) {
        if (this.goodsAttr[0].attrName == 'textNum') {
          this.goodsAttr.push({ name: '视频问诊', attrName: 'videoNum', attrValue: '1' })
        } else {
          this.goodsAttr.push({ name: '健康咨询', attrName: 'textNum', attrValue: '1' })
        }
      }
    },
    validate() {
      const {
        form: { validateFields },
      } = this

      validateFields((errors, values) => {
        if (!errors) {
          console.log('11', values)
          //校验表格数据无误，则组装数据

          this.uploadData.goodsInfo.goodsName = values.goodsName
          this.uploadData.goodsInfo.belong = values.belong
          this.uploadData.goodsInfo.goodsSpec = values.goodsSpec
          this.uploadData.goodsInfo.price = values.price
          this.uploadData.goodsInfo.theLastTime = values.theLastTime
          this.uploadData.goodsInfo.status = values.statusIf ? '1' : '3'
          this.uploadData.goodsInfo.topFlag = values.topFlagIf ? '1' : '0'
          this.uploadData.goodsInfo.goodsAttr = this.goodsAttr

          this.uploadData.templateName = values.goodsName

          //组装图片
          if (this.fileList.length == 0) {
            this.$message.error('请上传套餐图片！')
            return
          } else {
            delete this.uploadData.goodsInfo.previewList
            this.$set(this.uploadData.goodsInfo, 'previewList', '')
            if (this.fileList[0].response) {
              this.uploadData.goodsInfo.previewList = this.fileList[0].response.data.fileLinkUrl
            } else {
              this.uploadData.goodsInfo.previewList = this.fileList[0].url
            }
          }

          if (this.fileListBanner.length == 0) {
            this.$message.error('请上传详情banner图片！')
            return
          } else {
            //后台返回的bannerList为字符串，提交的时候先删除此属性，再将此字段做成数组
            delete this.uploadData.goodsInfo.bannerList
            this.$set(this.uploadData.goodsInfo, 'bannerList', '')
            let str = ''
            for (let index = 0; index < this.fileListBanner.length; index++) {
              // this.uploadData.goodsInfo.bannerList.push(this.fileListBanner[index].response.data.fileLinkUrl)
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

            this.uploadData.goodsInfo.bannerList = str
          }

          if (this.fileListDetail.length == 0) {
            this.$message.error('请上传商品详情图片！')
            return
          } else {
            //后台返回的bannerList为字符串，提交的时候先删除此属性，再将此字段做成数组
            delete this.uploadData.goodsInfo.imgList
            this.$set(this.uploadData.goodsInfo, 'imgList', '')

            let str = ''
            for (let index = 0; index < this.fileListDetail.length; index++) {
              // this.uploadData.goodsInfo.bannerList.push(this.fileListBanner[index].response.data.fileLinkUrl)
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

            this.uploadData.goodsInfo.imgList = str
          }
          console.log('www', this.uploadData)
          //完成所有数据组装，上传后台
          savePlan(this.uploadData).then((res) => {
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
          width: 20%;
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
