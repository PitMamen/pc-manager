<template>
  <div class="div-new-package">
    <p class="p-title">新增套餐</p>
    <!-- 分割线 -->
    <div class="div-divider"></div>

    <a-form ref="form" :form="form" class="my-form">
      <a-form-item label="所属类别" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <!-- <a-select allow-clear v-decorator="['belong', { rules: [{ required: true, message: '请选择所属科室' }] }]">
          <a-select-option v-for="(item, index) in goodClasses" :key="index" :value="item.classId">{{
            item.className
          }}</a-select-option>
        </a-select> -->

        <div class="global-search-wrapper" style="width: 300px">
          <a-auto-complete
            class="global-search"
            size="large"
            style="width: 100%; font-size: 14px"
            placeholder="请输入并选择"
            option-label-prop="title"
            @select="onSelect"
            @search="handleSearch"
          >
            <template slot="dataSource">
              <a-select-option v-for="item in goodClassesTemp" :key="item.classId + ''" :title="item.className">
                {{ item.className }}
              </a-select-option>
            </template>
          </a-auto-complete>
        </div>
      </a-form-item>

      <a-form-item label="套餐名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-input v-decorator="['goodsName', { rules: [{ required: true, message: '请输入套餐名称！' }] }]" />
      </a-form-item>

      <!-- <a-form-item label="服务名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-input v-decorator="['goodsSpec', { rules: [{ required: true, message: '请输入服务名称！' }] }]" />
      </a-form-item> -->

      <a-form-item label="是否上架" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-switch :checked="uploadData.goodsInfo.isOnline" @click="goOnline" />
      </a-form-item>

      <!-- <a-form-item label="是否推荐" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-switch :checked="uploadData.goodsInfo.isSuggest" />
      </a-form-item> -->

      <a-form-item label="价格(￥)" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <!-- <a-input v-decorator="['price', { rules: [{ required: true, message: '请输入商品价格！' }] }]" /> -->
        <a-input-number
          v-decorator="['price', { initialValue: 0, rules: [{ required: true, message: '请输入商品价格！' }] }]"
          :min="0"
          :max="1000000"
        />
      </a-form-item>

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
            <a-select-option v-for="(itemType, indexType) in typeDatas" :key="indexType" :value="itemType.code">{{
              itemType.value
            }}</a-select-option>
          </a-select>

          <span class="span-item-name" style="margin-left: 8%"><span style="color: red">*</span> 次数 :</span>

          <a-input-number style="margin-left: 3.5%" v-model="item.attrValue" :min="0" :max="1000000" />

          <span class="span-item-name" style="margin-left: 8%"><span style="color: red">*</span> 上传资料 :</span>

          <a-select v-model="item.plusInfoVo.uploadDocFlag" class="span-item-value" allow-clear placeholder="请选择上传资料">
            <a-select-option v-for="(itemType, indexType) in uploadDatas" :key="indexType" :value="itemType.code"
              >{{ itemType.value }}
            </a-select-option>
          </a-select>
        </div>

        <a-button class="btn-delete" type="primary" @click="deleteItem(index)">刪除</a-button>
      </div>

      <a-button class="btn-add" style="margin-top: 2%" type="primary" @click="addItem">添加</a-button>
    </div>

    <a-button class="btn-submit" type="primary" @click="validate">提交</a-button>
    <div style="height: 25px; color: white"></div>
  </div>
</template>

<script>
import { savePlan, qryGoodsClass, qryCodeValue } from '@/api/modular/system/posManage'

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
        { code: 1, valueName: '半年', value: 6 },
        { code: 2, valueName: '一年', value: 12 },
        { code: 3, valueName: '永久', value: 1200 },
      ],
      actionUrl: '/api/contentapi/fileUpload/uploadImgFile',
      headers: {
        authorization: 'authorization-text',
      },
      form: this.$form.createForm(this),
      typeDatas: [],
      uploadDatas: [
        {
          code: '0',
          value: '无',
        },
        {
          code: '1',
          value: '重症医学科资料1',
        },
      ],

      goodsAttrFull: [],
      goodsAttr: [],

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
          isOnline: true,
          isSuggest: true,
          goodsClass: '',
        },
        templateTask: [],
        templateName: '',
        basetimeType: '0',
      },

      goodClasses: [],
      goodClassesTemp: [],
      chooseClassItem: {},
    }
  },

  watch: {
    visible() {},
  },

  created() {
    this.form.setFieldsValue({
      topFlagIf: true,
      statusIf: true,
    })

    qryGoodsClass({ pageNo: 1, pageSize: 99 }).then((res) => {
      if (res.code == 0) {
        this.goodClasses = res.data.rows
        this.goodClassesTemp = JSON.parse(JSON.stringify(this.goodClasses))
      } else {
        this.$message.error(res.message)
      }
    })

    qryCodeValue('GOODS_SERVICE_TYPE').then((res) => {
      if (res.code == 0) {
        this.typeDatas = res.data
        // typeDatas元素的值 let item = {
        //   id: 3,
        //   codeGroup: 'GOODS_SERVICE_TYPE',
        //   code: 'videoNum',
        //   value: '视频咨询',
        //   parentCode: null,
        //   remark: null,
        // }

        //将typeDatas组装转换成goodsAttrFull
        for (let index = 0; index < this.typeDatas.length; index++) {
          // goodsAttrFull元素值: [{ name: '视频咨询', attrName: 'videoNum', attrValue: '1' }],
          this.goodsAttrFull.push({
            name: this.typeDatas[index].value,
            attrName: this.typeDatas[index].code,
            attrValue: '1',
            plusInfoVo: {
              uploadDocFlag: '0',
            },
          })
        }
        this.goodsAttr.push(JSON.parse(JSON.stringify(this.goodsAttrFull[0])))
      } else {
        this.$message.error(res.message)
      }
    })
  },

  methods: {
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },

    goOnline() {
      this.uploadData.goodsInfo.isOnline = !this.uploadData.goodsInfo.isOnline
    },

    /**
     *autoComplete回调，本地模拟的数据处理
     */
    handleSearch(inputName) {
      if (inputName) {
        this.goodClassesTemp = this.goodClasses.filter((item) => item.className.indexOf(inputName) != -1)
      } else {
        this.goodClassesTemp = JSON.parse(JSON.stringify(this.goodClasses))
      }
    },

    onSelect(choseClassId) {
      //选择类别
      this.uploadData.goodsInfo.goodsClass = choseClassId
      this.chooseClassItem = this.goodClasses.find((item) => item.classId == choseClassId)
    },

    deleteItem(index) {
      if (this.goodsAttr.length <= 1) {
        this.$message.error('至少选择一个服务类别')
        return
      }
      this.goodsAttr.splice(index, 1)
    },

    /**
     * 添加条目时不能重复，需要处理
     */
    addItem() {
      if (this.goodsAttr.length >= this.goodsAttrFull.length) {
        this.$message.error('目前仅支持' + this.goodsAttrFull.length + '种服务类型！')
        return
      }

      let newName = this.getNewOne()
      console.log('newName', newName)

      this.goodsAttr.push(
        this.goodsAttrFull.find((item) => {
          return item.name == newName
        })
      )
    },

    getNewOne() {
      //添加typeDatas没有包含在this.goodsAttr里面的数据
      for (let index = 0; index < this.typeDatas.length; index++) {
        let value = this.typeDatas[index].value

        let has = this.goodsAttr.some((item) => {
          return item.name == value
        })

        if (!has) {
          return value
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
          // this.uploadData.goodsInfo.goodsSpec = values.goodsSpec
          this.uploadData.goodsInfo.price = values.price
          this.uploadData.goodsInfo.theLastTime = values.theLastTime
          this.uploadData.templateName = values.goodsName
          this.uploadData.goodsInfo.goodsAttr = this.goodsAttr
          this.uploadData.goodsInfo.status = this.uploadData.goodsInfo.isOnline ? '1' : '3'

          //从类别里面拿的属性
          this.uploadData.goodsInfo.belong = this.chooseClassItem.belong
          this.uploadData.goodsInfo.topFlag = this.chooseClassItem.topFlag
          this.uploadData.goodsInfo.previewList = this.chooseClassItem.previewList
          this.uploadData.goodsInfo.bannerList = this.chooseClassItem.bannerList
          this.uploadData.goodsInfo.imgList = this.chooseClassItem.imgList

          if (!this.uploadData.goodsInfo.goodsClass) {
            this.$message.error('请选择类别！')
            return
          }

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
        width: 80%;

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
          width: 23%;
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
