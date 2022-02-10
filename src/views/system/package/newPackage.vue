<template>
  <div class="div-new-package">
    <p class="p-title">新增套餐</p>
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
          defaultChecked
          v-decorator="['status', { rules: [{ required: true, message: '请选择是否上架！' }] }]"
        />
      </a-form-item>

      <a-form-item label="是否推荐" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-switch
          defaultChecked
          v-decorator="['topFlag', { rules: [{ required: true, message: '请选择是否推荐！' }] }]"
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

      <a-form-item label="有效期" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-select allow-clear v-decorator="['theLastTime', { rules: [{ required: true, message: '请选择有效期' }] }]">
          <a-select-option v-for="(item, index) in periodData" :key="index" :value="item.value">{{
            item.valueName
          }}</a-select-option>
        </a-select>
      </a-form-item>

      <!-- <a-form-item label="服务类别" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <span
          v-decorator="['dd', { initialValue: 0, rules: [{ required: true, message: '请输入商品价格！' }] }]"
        ></span>
      </a-form-item> -->
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

        <a-button class="btn-delete" type="primary" @click="deleteItem(index)">刪除</a-button>
      </div>

      <a-button class="btn-add" style="margin-top: 2%" type="primary" @click="addItem">添加</a-button>
    </div>

    <div class="div-service-pic">
      <span class="title-des-pic"><span style="color: red">*</span> 套餐图片 :（只允许上传1张，正方形比例）</span>
      <!-- <div :key="ImgKey" style="margin-top: 1%"> -->
      <div style="margin-top: 1%">
        <a-upload
          name="file"
          list-type="picture-card"
          :multiple="false"
          :action="actionUrl"
          :headers="headers"
          class="upload-list-inline"
          @change="handleChange"
        >
          <a-button> <a-icon type="upload" /> 选择文件 </a-button>
        </a-upload>
      </div>

      <!-- <div class="clearfix">
        <a-upload
          :action="actionUrl"
          :multiple="false"
          list-type="picture-card"
          :file-list="fileList"
          @preview="handlePreview"
          @change="handleChange"
        >
          <div v-if="fileList.length < 8">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </div> -->

      <span class="title-des-pic"><span style="color: red">*</span> 详情banner图片</span>
      <!-- <div :key="ImgKey2" style="margin-top: 1%"> -->
      <div style="margin-top: 1%">
        <a-upload
          name="file"
          list-type="picture-card"
          :multiple="true"
          class="upload-list-inline"
          :action="actionUrl"
          :headers="headers"
          @change="handleChange2"
        >
          <!-- <a-input
            v-decorator="['fileId', { rules: [{ required: true, message: '请上传图片！' }] }]"
            style="display: none"
          /> -->
          <a-button> <a-icon type="upload" /> 选择文件 </a-button>
        </a-upload>
      </div>

      <span class="title-des-pic"><span style="color: red">*</span> 商品详情</span>
      <!-- <div :key="ImgKey3" style="margin-top: 1%"> -->
      <div style="margin-top: 1%">
        <a-upload
          name="file"
          list-type="picture-card"
          :multiple="true"
          :action="actionUrl"
          class="upload-list-inline"
          :headers="headers"
          @change="handleChange3"
        >
          <a-button> <a-icon type="upload" /> 选择文件 </a-button>
        </a-upload>
      </div>
    </div>
    <a-button class="btn-submit" type="primary" @click="validate">提交</a-button>
    <div style="height: 25px; color: white"></div>
  </div>
</template>

<script>
import { queryDepartment } from '@/api/modular/system/posManage'

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
      ImgKey: '1',
      ImgKey2: '1',
      ImgKey3: '1',
      hosData: [],
      periodData: [
        { code: 1, valueName: '半年', value: 6 },
        { code: 2, valueName: '一年', value: 12 },
        { code: 3, valueName: '永久', value: 1200 },
      ],
      keshiData: [],
      actionUrl: 'http://192.168.1.122:8071/fileUpload/uploadImgFile',
      headers: {
        authorization: 'authorization-text',
      },
      form: this.$form.createForm(this),
      typeDatas: [
        { type: 'textNum', value: '视频问诊' },
        { type: 'videoNum', value: '健康咨询' },
      ],

      goodsAttr: [
        { name: '视频问诊', attrName: 'videoNum', attrValue: '1' },
        // { name: '健康咨询', attrName: 'textNum', attrValue: '1' },
      ],
    }
  },

  watch: {
    visible() {
      if (this.visible) {
        this.ImgKey = ''
        this.ImgKey2 = ''
        this.ImgKey3 = ''
      } else {
        this.ImgKey = Math.random()
        this.ImgKey2 = Math.random()
        this.ImgKey3 = Math.random()
      }
      console.log('this.ImgKey :>> ', this.ImgKey)
    },
  },

  created() {
    queryDepartment('444885559').then((res) => {
      if (res.code == 0) {
        this.keshiData = res.data
      } else {
        this.$message.error('获取科室列表失败：' + res.message)
      }
    })
  },

  methods: {
    deleteItem(index) {
      this.goodsAttr.splice(index, 1)
    },

    handleChange(s1, s2) {
      debugger
      console.log('handleChange', s1)
    },

    handleChange2(s1, s2) {
      debugger
      console.log('handleChange2', s1)
    },

    handleChange3(s1, s2) {
      debugger
      console.log('handleChange3', s1)
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

    .upload-list-inline .ant-upload-list-item {
      float: left;
      width: 200px;
      margin-right: 8px;
    }
  }

  .btn-submit {
    margin-top: 3%;
    margin-left: 38%;
  }
}
</style>
