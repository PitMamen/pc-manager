<template>
  <div class="div-new-package">
    <p class="p-title">新增套餐</p>
    <!-- 分割线 -->
    <div class="div-divider"></div>

    <a-form ref="form" :form="form" class="my-form">
      <a-form-item label="套餐名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入套餐名称！' }] }]" />
      </a-form-item>

      <a-form-item label="所属科室" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-select allow-clear v-decorator="['ks', { rules: [{ required: true, message: '请选择所属科室' }] }]">
          <a-select-option v-for="(item, index) in hosData" :key="index" :value="item.code">{{
            item.value
          }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="服务名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-input v-decorator="['serveName', { rules: [{ required: true, message: '请输入服务名称！' }] }]" />
      </a-form-item>

      <a-form-item label="是否上架" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-switch v-decorator="['isOnline', { rules: [{ required: true, message: '请选择是否上架！' }] }]" />
      </a-form-item>

      <a-form-item label="是否推荐" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-switch v-decorator="['isSuggest', { rules: [{ required: true, message: '请选择是否推荐！' }] }]" />
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
        <a-select allow-clear v-decorator="['period', { rules: [{ required: true, message: '请选择有效期' }] }]">
          <a-select-option v-for="(item, index) in periodData" :key="index" :value="item.value">{{
            item.value
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

      <div class="div-item" v-for="(item, index) in typeDatasChoose" :key="index">
        <div class="div-bg">
          <span class="span-item-name"><span style="color: red">*</span> 类别{{ index + 1 }} :</span>

          <a-select
            v-model="item.name"
            style="display: inline-block"
            class="span-item-value"
            allow-clear
            placeholder="请选择服务类别"
            @change="handleChange"
          >
            <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.deptCode">{{
              item.deptName
            }}</a-select-option>
          </a-select>

          <span class="span-item-name" style="margin-left: 8%"><span style="color: red">*</span> 次数 :</span>

          <a-input-number
            v-model="item.count"
            v-decorator="['count', { initialValue: 0, rules: [{ required: true, message: '请输入商品次数！' }] }]"
            :min="0"
            :max="1000000"
          />

          <!-- <a-input
            v-model="item.count"
            class="span-item-value"
            :maxLength="30"
            type
            style="display: inline-block"
            allow-clear
            placeholder="请输入计划名称 "
          /> -->
        </div>

        <a-button class="btn-delete" type="primary" @click="validate">刪除</a-button>
      </div>

      <a-button class="btn-add" style="margin-top: 2%" type="primary" @click="validate">添加</a-button>
    </div>

    <div class="div-service-pic">
      <span class="title-des-pic"><span style="color: red">*</span> 套餐图片 :（只允许上传1张，正方形比例）</span>
      <div :key="ImgKey" style="margin-top: 1%">
        <a-upload name="file" :multiple="false" :action="actionUrl" :headers="headers" @change="handleChange">
          <a-input
            v-decorator="['fileId', { rules: [{ required: true, message: '请上传图片！' }] }]"
            style="display: none"
          />
          <a-button> <a-icon type="upload" /> 选择文件 </a-button>
        </a-upload>
      </div>

      <span class="title-des-pic"><span style="color: red">*</span> 详情banner图片</span>
      <div :key="ImgKey" style="margin-top: 1%">
        <a-upload name="file" :multiple="false" :action="actionUrl" :headers="headers" @change="handleChange">
          <a-input
            v-decorator="['fileId', { rules: [{ required: true, message: '请上传图片！' }] }]"
            style="display: none"
          />
          <a-button> <a-icon type="upload" /> 选择文件 </a-button>
        </a-upload>
      </div>

      <span class="title-des-pic"><span style="color: red">*</span> 商品详情</span>
      <div :key="ImgKey" style="margin-top: 1%">
        <a-upload name="file" :multiple="false" :action="actionUrl" :headers="headers" @change="handleChange">
          <a-input
            v-decorator="['fileId', { rules: [{ required: true, message: '请上传图片！' }] }]"
            style="display: none"
          />
          <a-button> <a-icon type="upload" /> 选择文件 </a-button>
        </a-upload>
      </div>
    </div>
    <a-button class="btn-submit" type="primary" @click="validate">提交</a-button>
  </div>
</template>

<script>
import { getPlanDetail, queryDepartment, getKeShiData } from '@/api/modular/system/posManage'

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
      ImgKey: '',
      hosData: [],
      periodData: [
        { code: 0, value: '一个月' },
        { code: 1, value: '一季度' },
        { code: 2, value: '一年' },
      ],
      keshiData: [],
      form: this.$form.createForm(this),
      typeDatas: [
        { code: 0, value: '视频问诊' },
        { code: 1, value: '健康咨询' },
      ],

      typeDatasChoose: [
        { name: '视频问诊', count: '3' },
        { name: '健康咨询', count: '8' },
      ],
    }
  },

  watch: {
    visible() {
      if (this.visible) {
        this.ImgKey = ''
      } else {
        this.ImgKey = Math.random()
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

    for (let i = 0; i < 30; i++) {
      this.timeCountData.push({
        code: i + 1,
        value: i + 1,
      })
    }
  },

  methods: {
    validate() {
      const {
        form: { validateFields },
      } = this

      validateFields((errors, values) => {
        if (!errors) {
          console.log('11', 'feferwf')
        } else {
          console.log('22', errors)
        }
      })
    },

    getKeShi() {
      getKeShiData({ hospitalCode: '444885559' })
        .then((res) => {
          if (res.success) {
            let newData = []
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].departmentList && res.data[i].departmentList.length > 0) {
                newData = newData.concat(res.data[i].departmentList)
              }
            }
            this.keshiData = newData
          } else {
            // this.$message.error('切换失败：' + res.message)
          }
        })
        .catch((err) => {
          // this.$message.error('切换错误：' + err.message)
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
  }

  .btn-submit {
    margin-top: 3%;
    margin-left: 20%;
  }
}
</style>
